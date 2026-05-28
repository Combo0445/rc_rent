import { useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n";
import { useAuth } from "../AuthContext";
import { userAPI } from "../services/api";
import "../App.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("fillAllFields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await userAPI.changePassword(currentPassword, newPassword);
      setMessage(t("passwordUpdated"));
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || t("unableUpdatePassword"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">👤 {t("profile")}</h1>
          <p className="page-subtitle">{t("profileSubtitle")}</p>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <h2>{t("accountInfo")}</h2>
            <div className="profile-row">
              <div className="profile-label">{t("username")}</div>
              <div>{user?.username || "—"}</div>
            </div>
            <div className="profile-row">
              <div className="profile-label">{t("role")}</div>
              <div>{user?.role === "admin" ? t("admin") : t("user")}</div>
            </div>
          </div>

          <div className="profile-card">
            <h2>{t("changePassword")}</h2>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {message && <div className="alert alert-success">✅ {message}</div>}

            <div className="form-group">
              <label className="form-label">{t("currentPassword")}</label>
              <input
                className="form-input"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("newPassword")}</label>
              <input
                className="form-input"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("confirmPassword")}</label>
              <input
                className="form-input"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button className="btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
              {loading ? t("processing") : t("updatePasswordButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
