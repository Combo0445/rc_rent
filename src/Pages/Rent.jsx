import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n";
import { carsAPI, rentalsAPI } from "../services/api";
import "../App.css";

export default function Rent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    nationalId: "",
    days: "",
  });
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const loadCar = async () => {
      try {
        const data = await carsAPI.getAll();
        const foundCar = data.find((c) => c.id === Number(id));
        if (!foundCar) {
          setError(t("carNotFound"));
        }
        setCar(foundCar);
      } catch (err) {
        setError(err.message || t("failedToLoadCar"));
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id, t]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">{t("loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-icon">🚫</div>
            <div className="empty-state-title">{t("carNotFound")}</div>
            {error && <p style={{ marginTop: "8px" }}>⚠️ {error}</p>}
            <button className="btn-primary" style={{ marginTop: "16px" }} onClick={() => navigate("/cars")}>
              {t("backToCars")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const totalCost = form.days
    ? (Number(form.days) * car.pricePerDay).toLocaleString()
    : "—";

  const handleSubmit = async () => {
    const { name, address, phone, email, nationalId, days } = form;
    if (!name || !address || !phone || !email || !nationalId || !days) {
      setError(t("fillAllFields"));
      return;
    }
    if (isNaN(days) || Number(days) <= 0) {
      setError(t("validDaysRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await rentalsAPI.create(Number(id));
      alert(`✅ Rental confirmed!\n\nCar: ${car.brand}\nDays: ${days}\nTotal: ฿${totalCost}`);
      navigate("/my-rentals");
    } catch (err) {
      setError(err.message || t("failedToCompleteRental"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">

        <div className="page-header">
          <button
            className="btn-ghost btn-sm"
            style={{ marginBottom: "12px" }}
            onClick={() => navigate("/cars")}
          >
            {t("backToCars")}
          </button>
          <h1 className="page-title">{t("rentCarTitle")} {car.brand}</h1>
          <p className="page-subtitle">{t("rentSubtitle")}</p>
        </div>

        <div className="rent-layout">

          {/* Form */}
          <div>
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="rent-form-card">
              <h2 className="rent-section-title">Personal Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("fullName")}</label>
                  <input className="form-input" name="name" placeholder={t("placeholderName")} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("phoneNumber")}</label>
                  <input className="form-input" name="phone" placeholder={t("placeholderPhone")} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("email")}</label>
                <input className="form-input" name="email" type="email" placeholder={t("placeholderEmail")} onChange={handleChange} />
              </div>

              <div className="form-group">
                  <label className="form-label">{t("nationalId")}</label>
                <input className="form-input" name="nationalId" placeholder={t("placeholderNationalId")} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">{t("address")}</label>
                <input className="form-input" name="address" placeholder={t("placeholderAddress")} onChange={handleChange} />
              </div>

              <h2 className="rent-section-title" style={{ marginTop: "24px" }}>{t("rentalDuration")}</h2>

              <div className="form-group">
                <label className="form-label">{t("numberOfDays")}</label>
                <input
                  className="form-input"
                  name="days"
                  type="number"
                  min="1"
                  placeholder={t("placeholderDays")}
                  onChange={handleChange}
                  style={{ maxWidth: "160px" }}
                />
              </div>

              <button
                className="btn-success btn-full btn-lg"
                style={{ marginTop: "8px" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? t("processing") : t("confirmRental")}
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="rent-card">
            <div className="rent-card-image">🚗</div>
            <div className="rent-card-body">
              <div className="rent-card-title">{car.brand}</div>
              <div className="car-type">{car.type}</div>

              <div className="car-meta" style={{ marginTop: "16px" }}>
                <div className="car-meta-item">
                    <span className="car-meta-label">{t("type")}</span>
                  <span className="car-meta-value">{car.type}</span>
                </div>
                <div className="car-meta-item">
                    <span className="car-meta-label">{t("stock")}</span>
                     <span className="car-meta-value">{car.available} {t("units")}</span>
                </div>
                <div className="car-meta-item">
                    <span className="car-meta-label">{t("rate")}</span>
                  <span className="car-meta-value">฿{car.pricePerDay.toLocaleString()}/day</span>
                </div>
                <div className="car-meta-item">
                    <span className="car-meta-label">{t("duration")}</span>
                     <span className="car-meta-value">{form.days || "—"} {t("days")}</span>
                </div>
              </div>

              <div className="rent-price-display">
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{t("totalCost")}</div>
                  <div className="rent-price-big">฿{totalCost}</div>
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {t("byConfirming")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}