import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n";
import { useAuth } from "../AuthContext";
import "../App.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    const { username, password, confirmPassword } = form;
    if (!username || !password || !confirmPassword) {
      setError(t("fillAllFields"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await register(username, password);
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
          {t("alreadyHaveAccount")} {" "}
          <Link to="/login">{t("signIn")}</Link>
        </p>
      </div>
    </div>
  );
}