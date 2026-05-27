import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { rentalsAPI, carsAPI, authAPI } from "../services/api";
import { useLanguage } from "../i18n";
import "../App.css";

export default function MyRentals() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [carsMap, setCarsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await authAPI.getMe();
      } catch {
        navigate("/login");
        return;
      }
      try {
        const [rentalsData, carsData] = await Promise.all([
          rentalsAPI.getMyRentals(),
          carsAPI.getAll(),
        ]);

        setRentals(rentalsData);

        const carMap = {};
        carsData.forEach((car) => {
          carMap[car.id] = car;
        });
        setCarsMap(carMap);
      } catch (err) {
        setError(err.message || t("failedToLoadRentals"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, t]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">📦 {t("myRentals")}</h1>
          <p className="page-subtitle">{t("trackRentalsSubtitle")}</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">{t("loadingRentals")}</div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <div className="empty-state-title">{t("noRentalsYet")}</div>
            <div className="empty-state-desc">{t("rentalHistory")}</div>
            <Link to="/cars">
              <button className="btn-primary" style={{ marginTop: "20px" }}>
                {t("browseCars")}
              </button>
            </Link>
          </div>
        ) : (
          <div className="rental-list">
            {rentals.map((rental) => {
              const car = carsMap[rental.carId];
              return (
                <div key={rental.id} className="rental-item">
                  <div className="rental-icon">🚗</div>
                  <div className="rental-info">
                    <div className="rental-name">{car?.brand || t("unknownCar")}</div>
                    <div className="rental-meta">
                      {car?.type || t("notApplicable")} · {t("rentalId")} {rental.id}
                    </div>
                  </div>
                  <div className={`rental-status status-${rental.status}`}>
                    {rental.status === "active"
                      ? t("statusActive")
                      : rental.status === "pending"
                      ? t("statusPending")
                      : t("statusCompleted")}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                    ฿{car?.pricePerDay?.toLocaleString() || "—"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
