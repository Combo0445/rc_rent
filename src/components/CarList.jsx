import CarCard from "./CarCard";
import "../App.css";
import { useLanguage } from "../i18n";

function CarList({ cars, onRent, isAdmin, onEdit, onDelete }) {
  const { t } = useLanguage();
  return (
    <div className="car-grid">
      {cars.length === 0 ? (
        <p className="empty">ไม่มีรถในระบบ</p>
      ) : (
        cars.map((car) => (
          <CarCard key={car.id} car={car} onRent={onRent}>
            {isAdmin && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: "100%", marginTop: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => onEdit && onEdit(car)}>
                  {t("edit")}
                </button>
                <button type="button" className="btn-danger" onClick={() => onDelete && onDelete(car.id)}>
                  {t("delete")}
                </button>
              </div>
            )}
          </CarCard>
        ))
      )}
    </div>
  );
}

export default CarList;