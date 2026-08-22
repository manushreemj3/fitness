import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Companion from "../components/Companion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { COMPANION_ACCESSORIES, COMPANION_COLORS, labelFor } from "../data/options";
import { getReminderSettings, saveReminderSettings } from "../services/notificationService";
import { updateCompanion } from "../services/userService";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reminders, setReminders] = useState(getReminderSettings());

  function toggle(key) {
    const next = { ...reminders, [key]: !reminders[key] };
    setReminders(next);
    saveReminderSettings(next);
    toast("Reminder preference saved");
  }

  function setBot(partial) {
    const next = updateCompanion(partial);
    setUser(next);
    if (partial.color) {
      toast(`UI Theme changed to ${labelFor(COMPANION_COLORS, partial.color)}`);
    } else if (partial.accessory) {
      toast(`Accessory changed to ${labelFor(COMPANION_ACCESSORIES, partial.accessory)}`);
    }
  }

  const activeColor = user?.companion?.color || "lavender";
  const activeAccessory = user?.companion?.accessory || "none";

  return (
    <div className="settings-card">
      <span className="eyebrow">SETTINGS</span>
      <h2>Your preferences</h2>

      <h3>FitBuddy & UI Theme</h3>
      <p className="disclaimer">Choose FitBuddy's accessory and the app color scheme.</p>
      
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <Companion color={activeColor} accessory={activeAccessory} size="sm" />
        <h4 style={{ margin: "10px 0 0", fontSize: 18, color: "var(--purple-deep)" }}>{user?.companion?.name || "FitBuddy"}</h4>
      </div>

      <label className="field">
        <span>Companion Name</span>
        <input
          type="text"
          value={user?.companion?.name || "FitBuddy"}
          onChange={(e) => setBot({ name: e.target.value })}
          placeholder="Name your bot companion..."
        />
      </label>

      <p><strong>UI Theme Color</strong></p>
      <div className="color-swatch-grid">
        {COMPANION_COLORS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`color-swatch-btn ${activeColor === item.id ? "active" : ""}`}
            onClick={() => setBot({ color: item.id })}
          >
            <span className="swatch-circle" style={{ background: item.accent }} />
            {item.label}
          </button>
        ))}
      </div>

      <p><strong>Accessory</strong></p>
      <div className="choice-grid">
        {COMPANION_ACCESSORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`choice ${activeAccessory === item.id ? "active" : ""}`}
            onClick={() => setBot({ accessory: item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h3>Notifications</h3>
      <label className="toggle-row"><span>Hydration reminder</span><input type="checkbox" checked={reminders.hydration} onChange={() => toggle("hydration")} /></label>
      <label className="toggle-row"><span>Workout reminder</span><input type="checkbox" checked={reminders.workout} onChange={() => toggle("workout")} /></label>
      <label className="toggle-row"><span>Mood check-in</span><input type="checkbox" checked={reminders.mood} onChange={() => toggle("mood")} /></label>

      <h3>Privacy</h3>
      <p className="disclaimer">This MVP stores your data in this browser only. A future backend can replace local storage without changing these screens.</p>

      <h3>Data disclaimer</h3>
      <p className="disclaimer">Nutrition estimates are approximate.</p>
      <p className="disclaimer">FitBuddy is a wellbeing support tool and is not a replacement for professional medical or mental-health care.</p>

      <button
        className="primary-btn"
        style={{ marginTop: 24 }}
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
