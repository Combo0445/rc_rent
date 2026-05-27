import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { useLanguage } from "../i18n";
import "../App.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    const { username, email, phone, password, confirmPassword } = form;
    if (!username || !email || !phone || !password || !confirmPassword) {
      setError(t("fillAllFields"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await authAPI.register(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || t("registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="form-wrapper" style={{ maxWidth: "500px" }}>
        <div className="form-header">
          <div className="form-icon">🚀</div>
          <h1 className="form-title">{t("createAccount")}</h1>
          <p className="form-subtitle">{t("joinDriveRent")}</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t("username")}</label>
            <input
              className="form-input"
              name="username"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t("phone")}</label>
            <input
              className="form-input"
              name="phone"
              placeholder="08x-xxx-xxxx"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t("email")}</label>
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t("password")}</label>
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
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
        </div>

        <button
          className="btn-primary btn-full"
          style={{ marginTop: "8px" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("loading") : t("createAccountButton")}
        </button>

        <p className="form-footer" style={{ marginTop: "20px" }}>
          {t("dontHaveAccount")} {" "}
          <Link to="/login">{t("signIn")}</Link>
        </p>
      </div>
    </div>
  );
}