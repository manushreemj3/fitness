import { useState } from "react";
import Companion from "../components/Companion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ACTIVITY_LEVELS, COMPANION_ACCESSORIES, COMPANION_COLORS, FITNESS_GOALS, GENDERS, TIMELINE_OPTIONS, labelFor } from "../data/options";
import { updateAccount, updateCompanion } from "../services/userService";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    ...user.profile,
  });

  async function save() {
    try {
      const next = await updateAccount({
      name: form.name,
      profile: {
        age: form.age,
        gender: form.gender,
        heightCm: form.heightCm,
        weightKg: form.weightKg,
        activityLevel: form.activityLevel,
        goal: form.goal,
        targetWeightKg: form.targetWeightKg,
        timelineWeeks: form.timelineWeeks,
        lastPeriodDate: form.lastPeriodDate,
        cycleLength: form.cycleLength,
        periodDuration: form.periodDuration,
      },
    });
      setUser(next);
      setEditing(false);
      toast("Profile updated");
    } catch (error) {
      toast(error.message);
    }
  }

  async function setCompanion(partial) {
    try {
      const next = await updateCompanion(partial);
    setUser(next);
    if (partial.color) {
      toast(`UI Theme changed to ${labelFor(COMPANION_COLORS, partial.color)}`);
    } else if (partial.accessory) {
      toast(`Accessory changed to ${labelFor(COMPANION_ACCESSORIES, partial.accessory)}`);
      } else {
        toast("Companion updated");
      }
    } catch (error) {
      toast(error.message);
    }
  }

  const activeColor = user.companion?.color || "lavender";
  const activeAccessory = user.companion?.accessory || "none";

  return (
    <div className="profile-card">
      <div className="profile-avatar lg">{user.name[0].toUpperCase()}</div>
      <h2>{user.name}</h2>
      <p>{labelFor(FITNESS_GOALS, user.profile.goal)} · {user.profile.timelineWeeks} week focus</p>
      <div className="profile-grid">
        <div><small>Height</small><strong>{user.profile.heightCm} cm</strong></div>
        <div><small>Weight</small><strong>{user.profile.weightKg} kg</strong></div>
        <div><small>Activity</small><strong>{labelFor(ACTIVITY_LEVELS, user.profile.activityLevel)}</strong></div>
        <div><small>Goal</small><strong>{labelFor(FITNESS_GOALS, user.profile.goal)}</strong></div>
      </div>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Companion color={activeColor} accessory={activeAccessory} size="sm" />
        <h4 style={{ margin: "10px 0 0", fontSize: 18, color: "var(--purple-deep)" }}>{user.companion?.name || "FitBuddy"}</h4>
      </div>

      <label className="field">
        <span>Companion Name</span>
        <input
          type="text"
          value={user.companion?.name || "FitBuddy"}
          onChange={(e) => setCompanion({ name: e.target.value })}
          placeholder="Name your bot companion..."
        />
      </label>

      <h3>UI Theme Color</h3>
      <p className="disclaimer">Picking a color updates the app interface theme.</p>
      <div className="color-swatch-grid">
        {COMPANION_COLORS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`color-swatch-btn ${activeColor === item.id ? "active" : ""}`}
            onClick={() => setCompanion({ color: item.id })}
          >
            <span className="swatch-circle" style={{ background: item.accent }} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="customize-section">
        <h3>✨ Customize Your FitBuddy</h3>
        <p className="disclaimer">Add an accessory to make your companion unique. Only one can be active at a time.</p>
        <div className="customize-preview">
        <Companion color={activeColor} accessory={activeAccessory} size="md" />
        </div>
        <div className="accessory-grid">
          {COMPANION_ACCESSORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`accessory-option ${activeAccessory === item.id ? "active" : ""}`}
              onClick={() => setCompanion({ accessory: item.id })}
            >
              <span className="accessory-option-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!editing && <button className="secondary-btn" style={{ marginTop: 20 }} onClick={() => setEditing(true)}>Edit profile</button>}

      {editing && (
        <div style={{ marginTop: 20 }}>
          <label className="field"><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="field"><span>Age</span><input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
          <label className="field"><span>Gender</span>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              {GENDERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Height (cm)</span><input value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} /></label>
          <label className="field"><span>Weight (kg)</span><input value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} /></label>
          <label className="field"><span>Activity</span>
            <select value={form.activityLevel} onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}>
              {ACTIVITY_LEVELS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Goal</span>
            <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
              {FITNESS_GOALS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Target weight</span><input value={form.targetWeightKg || ""} onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })} /></label>
          <label className="field"><span>Timeline (weeks)</span>
            <select value={form.timelineWeeks} onChange={(e) => setForm({ ...form, timelineWeeks: e.target.value })}>
              {TIMELINE_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          {form.gender === "female" && (
            <>
              <label className="field"><span>Last period date</span><input type="date" value={form.lastPeriodDate || ""} onChange={(e) => setForm({ ...form, lastPeriodDate: e.target.value })} /></label>
              <label className="field"><span>Cycle length</span><input value={form.cycleLength || ""} onChange={(e) => setForm({ ...form, cycleLength: e.target.value })} /></label>
              <label className="field"><span>Period duration</span><input value={form.periodDuration || ""} onChange={(e) => setForm({ ...form, periodDuration: e.target.value })} /></label>
            </>
          )}
          <div className="btn-row">
            <button className="primary-btn" onClick={save}>Save</button>
            <button className="secondary-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
