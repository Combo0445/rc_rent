import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useAuth } from "../AuthContext";
import "../App.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  const handleLogout = async () => {
    await logout();
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
          <>
            <Link to="/my-rentals" className={isActive("/my-rentals") ? "active" : ""}>{t("myRentals")}</Link>
            <Link to="/profile" className={isActive("/profile") ? "active" : ""}>{t("profile")}</Link>
          </>
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