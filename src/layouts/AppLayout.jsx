import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { greetingForName } from "../services/userService";
import { useLanguage } from "../context/LanguageContext";

const TITLE_KEYS = {
  "/home": ["", "homeSubtitle"],
  "/physical": ["physicalTitle", "physicalSubtitle"],
  "/nutrition": ["nutritionTitle", "nutritionSubtitle"],
  "/mental": ["mentalTitle", "mentalSubtitle"],
  "/profile": ["profileTitle", "profileSubtitle"],
  "/settings": ["settingsTitle", "settingsSubtitle"],
  "/exercises": ["exerciseLibrary", "exerciseLibrarySubtitle"],
};

export default function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();
  const meta = TITLE_KEYS[location.pathname] || ["", ""];
  const title = location.pathname === "/home" ? `${greetingForName(user.name)} ` : t(meta[0], "FitBuddy");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">♥</div>
          <div>
            <div className="brand-name">FitBuddy</div>
            <div className="brand-sub">AI Companion</div>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>⌂</span>{t("home")}</NavLink>
          <NavLink to="/physical" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>◈</span>{t("physical")}</NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>🍎</span>{t("nutrition")}</NavLink>
          <NavLink to="/mental" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>☯</span>{t("mental")}</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>♙</span>{t("profile")}</NavLink>
          <NavLink to="/exercises" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>🏋</span>{t("exercises")}</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>⚙</span>{t("settings")}</NavLink>
        </nav>
      </aside>
      <main className="main">
        {location.pathname !== "/mental" && (
          <header className="topbar">
            <div>
              <h1>{title}</h1>
              <p>{t(meta[1], "")}</p>
            </div>
            <div className="top-actions">
              <NavLink to="/profile" className="avatar">{user.name[0].toUpperCase()}</NavLink>
            </div>
          </header>
        )}
        <Outlet />
      </main>
    </div>
  );
}
