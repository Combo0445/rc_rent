import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { useLanguage } from "../i18n";
import "../App.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.getMe();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [location]);

  const { language, setLanguage, t } = useLanguage();
  const isActive = (path) => location.pathname === path;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("Logout failed", err);
    }
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🚗</span>
        DriveRent
      </Link>

      <div className="navbar-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>{t("dashboard")}</Link>
        <Link to="/cars" className={isActive("/cars") ? "active" : ""}>{t("cars")}</Link>
        {isAuthenticated && (
          <Link to="/my-rentals" className={isActive("/my-rentals") ? "active" : ""}>{t("myRentals")}</Link>
        )}
        {isAdmin && (
          <span className="navbar-admin-badge">{t("admin")}</span>
        )}
      </div>

      <div className="navbar-auth">
        <button
          type="button"
          className="btn-language-toggle"
          onClick={handleLanguageToggle}
          style={{ border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", padding: "6px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}
        >
          {language === "en" ? "ไทย" : "EN"}
        </button>
        {isAuthenticated ? (
          <button
            className="btn-outline"
            onClick={handleLogout}
            style={{ cursor: "pointer", border: "1px solid", padding: "8px 16px", borderRadius: "4px", background: "transparent" }}
          >
            {t("logout")}
          </button>
        ) : (
          <>
            <Link to="/login" className="btn-outline">{t("login")}</Link>
            <Link to="/register" className="btn-filled">{t("register")}</Link>
          </>
        )}
      </div>
    </nav>
  );
}