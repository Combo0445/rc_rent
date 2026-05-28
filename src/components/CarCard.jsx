import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import "../App.css";

function CarCard({ car, onRent, children }) {
  const { t } = useLanguage();
  const available = Number(car.available || 0);
  const price = Number(car.pricePerDay || 0);
  return (
    <div className="car-card">
      <div className="car-card-image">🚗</div>
      <div className="car-card-body">
        <div className="car-card-header">
          <div>
            <div className="car-title">{car.brand}</div>
            <div className="car-type">{car.type}</div>
          </div>
          <span className={`badge ${available > 0 ? "badge-available" : "badge-unavailable"}`}>
            {available > 0 ? t("available") : t("unavailable")}
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
          ฿{price.toLocaleString()}
          <span className="car-price-unit"> / day</span>
        </div>

        {onRent ? (
          <button
            type="button"
            className={available ? "btn-success btn-full" : "btn-danger btn-full"}
            disabled={!available}
            onClick={() => onRent(car)}
          >
            {available ? t("rentNow") : t("notAvailable")}
          </button>
        ) : (
          available > 0 ? (
            <Link to={`/rent/${car.id}`}>
              <button type="button" className="btn-success btn-full">
                {t("rentNow")}
              </button>
            </Link>
          ) : (
            <button type="button" className="btn-danger btn-full" disabled>
              {t("notAvailable")}
            </button>
          )
        )}

        {children}
      </div>
    </div>
  );
}

export default CarCard;