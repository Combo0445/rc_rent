import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useAuth } from "../AuthContext";
import "../App.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError(t("fillAllFields") || "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || t("loginFailed") || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="form-wrapper">
        <div className="form-header">
          <div className="form-icon">🔑</div>
          <h1 className="form-title">{t("welcomeBack")}</h1>
          <p className="form-subtitle">{t("signInSubtitle")}</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div className="form-group">
          <label className="form-label">{t("username")}</label>
          <input
            className="form-input"
            name="username"
            placeholder={t("enterYourUsername")}
            value={form.username}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t("password")}</label>
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder={t("enterYourPassword")}
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          className="btn-primary btn-full"
          style={{ marginTop: "8px" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("loading") : t("signInButton")}
        </button>

        <p className="form-footer" style={{ marginTop: "20px" }}>
          {t("dontHaveAccount")} {" "}
          <Link to="/register">{t("createOne")}</Link>
        </p>
      </div>
    </div>
  );
}