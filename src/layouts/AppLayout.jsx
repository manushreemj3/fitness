import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { greetingForName } from "../services/userService";

const TITLES = {
  "/home": ["", "Here’s your personalized plan for today"],
  "/physical": ["Physical Mode", "Your workout, food and hydration in one place."],
  "/nutrition": ["Nutrition Mode", "Meals, hydration and calories for today."],
  "/mental": ["Mental Mode", "A calmer space to check in with yourself."],
  "/profile": ["Your Profile", "Your personal fitness and wellbeing details."],
  "/settings": ["Settings", "Manage your FitBuddy preferences."],
  "/progress": ["Progress", "See your recent fitness and wellbeing trends."],
};

export default function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const meta = TITLES[location.pathname] || ["FitBuddy", ""];
  const title = location.pathname === "/home"
    ? `${greetingForName(user.name)} `
    : meta[0];

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
          <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>⌂</span>Home</NavLink>
          <NavLink to="/physical" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>◈</span>Physical</NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>🍎</span>Nutrition</NavLink>
          <NavLink to="/mental" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>☯</span>Mental</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>♙</span>Profile</NavLink>
          <NavLink to="/progress" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>📈</span>Progress</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>⚙</span>Settings</NavLink>
        </nav>
      </aside>
      <main className="main">
        {location.pathname !== "/mental" && (
          <header className="topbar">
            <div>
              <h1>{title}</h1>
              <p>{meta[1]}</p>
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
