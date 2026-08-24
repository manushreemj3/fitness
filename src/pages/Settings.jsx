import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Companion from "../components/Companion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { COMPANION_ACCESSORIES, COMPANION_COLORS, labelFor } from "../data/options";
import { getReminderSettings, saveReminderSettings } from "../services/notificationService";
import { updateCompanion } from "../services/userService";
import { useLanguage } from "../context/LanguageContext";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reminders, setReminders] = useState(getReminderSettings());

  function toggle(key) {
    const next = { ...reminders, [key]: !reminders[key] };
    setReminders(next);
    saveReminderSettings(next);
    toast(t("reminderSaved"));
  }

  async function setBot(partial) {
    try {
      const next = await updateCompanion(partial);
      setUser(next);
    if (partial.color) {
      toast(`UI Theme changed to ${labelFor(COMPANION_COLORS, partial.color)}`);
      } else if (partial.accessory) {
        toast(`Accessory changed to ${labelFor(COMPANION_ACCESSORIES, partial.accessory)}`);
      }
    } catch (error) {
      toast(error.message);
    }
  }

  const activeColor = user?.companion?.color || "lavender";
  const activeAccessory = user?.companion?.accessory || "none";

  return (
    <div className="settings-card">
      <span className="eyebrow">{t("settings")}</span>
      <h2>{t("settingsTitle")}</h2>

      <h3>{t("uiTheme")}</h3>
      <p className="disclaimer">{language === "en" ? "Choose FitBuddy's accessory and the app color scheme." : language === "kn" ? "FitBuddy ಆಕ್ಸೆಸರಿ ಮತ್ತು ಆ್ಯಪ್ ಬಣ್ಣದ ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ." : "FitBuddy की एक्सेसरी और ऐप कलर थीम चुनें।"}</p>
      
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <Companion color={activeColor} accessory={activeAccessory} size="sm" />
        <h4 style={{ margin: "10px 0 0", fontSize: 18, color: "var(--purple-deep)" }}>{user?.companion?.name || "FitBuddy"}</h4>
      </div>

      <label className="field">
        <span>{t("companionName")}</span>
        <input
          type="text"
          value={user?.companion?.name || "FitBuddy"}
          onChange={(e) => setBot({ name: e.target.value })}
          placeholder={t("companionName")}
        />
      </label>

      <p><strong>{t("uiThemeColor")}</strong></p>
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

      <p><strong>{t("accessory")}</strong></p>
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

      <h3>{t("language")}</h3>
      <p className="disclaimer">{t("chooseLanguage")}</p>
      <div className="language-options">
        {languages.map((item) => (
          <button key={item.id} type="button" className={`language-option ${language === item.id ? "active" : ""}`} onClick={() => { setLanguage(item.id); toast(t("languageSaved")); }}>
            <span className="language-flag">{item.flag}</span>
            <strong>{item.native}</strong>
            <small>{item.label}</small>
          </button>
        ))}
      </div>

      <h3>{t("notifications")}</h3>
      <label className="toggle-row"><span>{t("hydrationReminder")}</span><input type="checkbox" checked={reminders.hydration} onChange={() => toggle("hydration")} /></label>
      <label className="toggle-row"><span>{t("workoutReminder")}</span><input type="checkbox" checked={reminders.workout} onChange={() => toggle("workout")} /></label>
      <label className="toggle-row"><span>{t("moodCheckIn")}</span><input type="checkbox" checked={reminders.mood} onChange={() => toggle("mood")} /></label>

      <h3>{t("privacy")}</h3>
      <p className="disclaimer">This MVP keeps a local cache for fast UI updates and syncs account/profile changes through the FitBuddy backend when it is configured.</p>

      <h3>{t("dataDisclaimer")}</h3>
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
