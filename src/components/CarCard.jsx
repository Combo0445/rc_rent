import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import "../App.css";

function CarCard({ car, onRent }) {
  const { t } = useLanguage();
  return (
    <div className="car-card">
      <div className="car-card-image">🚗</div>
      <div className="car-card-body">
        <div className="car-card-header">
          <div>
            <div className="car-title">{car.brand}</div>
            <div className="car-type">{car.type}</div>
          </div>
          <span className={`badge ${car.available > 0 ? "badge-available" : "badge-unavailable"}`}>
            {car.available > 0 ? t("available") : t("unavailable")}
          </span>
        </div>

        <div className="car-meta">
          <div className="car-meta-item">
            <span className="car-meta-label">{t("stock")}</span>
            <span className="car-meta-value">{car.available} {t("units")}</span>
          </div>
          <div className="car-meta-item">
            <span className="car-meta-label">{t("type")}</span>
            <span className="car-meta-value">{car.type}</span>
          </div>
        </div>

        <div className="car-price">
          ฿{car.pricePerDay.toLocaleString()}
          <span className="car-price-unit"> / day</span>
        </div>

        {onRent ? (
          <button
            className={car.available ? "btn-success btn-full" : "btn-danger btn-full"}
            disabled={!car.available}
            onClick={() => onRent(car)}
          >
            {car.available ? t("rentNow") : t("notAvailable")}
          </button>
        ) : (
          <Link to={`/rent/${car.id}`}>
            <button
              className={car.available ? "btn-success btn-full" : "btn-danger btn-full"}
              disabled={!car.available}
            >
              {car.available ? t("rentNow") : t("notAvailable")}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default CarCard;