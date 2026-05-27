import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { carsAPI, rentalsAPI, authAPI } from "../services/api";
import { useLanguage } from "../i18n";
import "../App.css";

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData = await carsAPI.getAll();
        setCars(carsData);

        // Fetch rentals if user is authenticated
        try {
          await authAPI.getMe();
          const rentalsData = await rentalsAPI.getMyRentals();
          setRentals(rentalsData);
        } catch (err) {
          // Ignore rental fetch error for dashboard
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { t } = useLanguage();
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.available > 0).length;
  const types = [...new Set(cars.map((c) => c.type))].length;
  const activeRentals = rentals.filter(r => r.status === "active").length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {loading ? (
          <div className="empty-state" style={{ marginTop: "60px" }}>
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">{t("loading")}</div>
          </div>
        ) : (
          <>
            <div className="dashboard-hero">
              <div className="hero-eyebrow">{t("carRentalPlatform")}</div>
              <h1 className="hero-title">{t("Welcome to Car Rental")}</h1>
              <p className="hero-desc">{t("rentYourCar")}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link to="/cars">
                  <button className="btn-accent btn-lg">{t("browseCars")}</button>
                </Link>
                <Link to="/my-rentals">
                  <button
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "13px 24px",
                      borderRadius: "16px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {t("myRentals")}
                  </button>
                </Link>
              </div>
              <div className="hero-stats" style={{ marginTop: "36px" }}>
                <div>
                  <div className="hero-stat-value">{totalCars}</div>
                  <div className="hero-stat-label">{t("totalCars")}</div>
                </div>
                <div>
                  <div className="hero-stat-value">{availableCars}</div>
                  <div className="hero-stat-label">{t("availableNow")}</div>
                </div>
                <div>
                  <div className="hero-stat-value">{types}</div>
                  <div className="hero-stat-label">{t("vehicleTypes")}</div>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon">🚘</div>
                <div className="stat-card-value">{availableCars}</div>
                <div className="stat-card-label">{t("carsAvailable")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">📦</div>
                <div className="stat-card-value">{activeRentals}</div>
                <div className="stat-card-label">{t("activeRentals")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">✅</div>
                <div className="stat-card-value">0</div>
                <div className="stat-card-label">{t("completed")}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">⭐</div>
                <div className="stat-card-value">4.9</div>
                <div className="stat-card-label">{t("avgRating")}</div>
              </div>
            </div>

            <div className="section-header">
              <h2 className="section-title">{t("featuredCars")}</h2>
              <Link to="/cars" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>
                {t("viewAll")}
              </Link>
            </div>

            <div className="car-grid">
              {cars.slice(0, 3).map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-card-image">🚗</div>
                  <div className="car-card-body">
                    <div className="car-card-header">
                      <div>
                        <div className="car-title">{car.brand}</div>
                        <div className="car-type">{car.type}</div>
                      </div>
                      <span className={`badge ${car.available > 0 ? "badge-available" : "badge-unavailable"}`}>
                        {car.available > 0 ? t("available") : t("soldOut")}
                      </span>
                    </div>
                    <div className="car-price">
                      {car.pricePerDay.toLocaleString()}
                      <span className="car-price-unit"> ฿/day</span>
                    </div>
                    <Link to={`/rent/${car.id}`}>
                      <button
                        className={car.available ? "btn-success btn-full" : "btn-danger btn-full"}
                        disabled={!car.available}
                      >
                        {car.available ? t("rentNow") : t("unavailable")}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}