import { NavLink, Outlet } from "react-router-dom";
import ChatWidget from "./ChatWidget";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/budgets", label: "Budgets" },
  { to: "/analytics", label: "Analytics" },
  { to: "/insights", label: "Insights" },
  { to: "/notifications", label: "Notifications" },
  { to: "/reports", label: "Reports" },
  { to: "/about", label: "About" },
];

function Layout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const avatar = user?.avatar || "";
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "M";

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container app-header-inner">
          <NavLink to="/dashboard" className="app-brand">
            <img src="/fintrack-logo.png" alt="FinTrack logo" className="brand-logo" />
            <span>FinTrack</span>
          </NavLink>

          <nav className="app-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="user-menu">
            <div className="user-avatar-wrap">
              {avatar ? (
                <img
                  src={avatar}
                  alt="User avatar"
                  className="user-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="user-avatar-fallback">{initials}</span>
              )}
            </div>
            <NavLink to="/login" className="logout-link">
              Logout
            </NavLink>
          </div>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <ChatWidget />

      <footer className="app-footer">
        <div className="container app-footer-inner">
          <div className="footer-brand-block">
            <NavLink to="/dashboard" className="footer-brand">
              FinTrack
            </NavLink>
            <p>Simple tools for clearer financial decisions.</p>
            <small>© 2026 FinTrack · Made by Manish Kumar Singh</small>
          </div>

          <div className="footer-links">
            <span className="footer-links-title">Explore</span>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>

          <div className="footer-contact-block">
            <span className="footer-links-title">Built with Scanrly</span>
            <a
              href="https://scanrly.com/"
              target="_blank"
              rel="noreferrer"
              className="footer-contact-link"
            >
              Contact Scanrly <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
