import CarCard from "./CarCard";
import "../App.css";
function CarList({ cars, onRent }) {
  return (
    <div className="car-grid">
      {cars.length === 0 ? (
        <p className="empty">ไม่มีรถในระบบ</p>
      ) : (
        cars.map((car) => (
          <CarCard key={car.id} car={car} onRent={onRent} />
        ))
      )}
    </div>
  );
}

export default CarList;