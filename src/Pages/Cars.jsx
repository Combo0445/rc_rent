import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { carsAPI, authAPI } from "../services/api";
import { useLanguage } from "../i18n";
import "../App.css";

const initialCarForm = {
  brand: "",
  type: "",
  pricePerDay: "",
  available: "",
};

export default function Cars() {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState(initialCarForm);
  const { t } = useLanguage(); // This line is already present in the original file

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carsAPI.getAll();
        setCars(data);
      } catch (err) {
        setError(err.message || t("failedToLoadCars"));
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.getMe();
        setIsAdmin(data.user?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };
    fetchUser();
  }, []);

  const types = ["All", ...new Set(cars.map((c) => c.type))];

  const filtered = cars.filter((car) => {
    const matchType = activeType === "All" || car.type === activeType;
    const matchSearch = car.brand.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCarForm({ ...carForm, [name]: value });
    setAdminError("");
    setAdminSuccess("");
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setCarForm({
      brand: car.brand,
      type: car.type,
      pricePerDay: car.pricePerDay.toString(),
      available: car.available.toString(),
    });
    setAdminError("");
    setAdminSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
    setCarForm(initialCarForm);
    setAdminError("");
    setAdminSuccess("");
  };

  const refreshCars = async () => {
    try {
      const data = await carsAPI.getAll();
      setCars(data);
    } catch (err) {
      setError(err.message || "Failed to refresh cars");
    }
  };

  const handleSaveCar = async () => {
    const { brand, type, pricePerDay, available } = carForm;
    if (!brand || !type || !pricePerDay || !available) {
      setAdminError(t("fillAllFields"));
      return;
    }

    try {
      const carPayload = {
        brand,
        type,
        pricePerDay: Number(pricePerDay),
        available: Number(available),
      };

      if (editingCar) {
        await carsAPI.update(editingCar.id, carPayload);
        setAdminSuccess(t("carUpdated"));
      } else {
        await carsAPI.create(carPayload);
        setAdminSuccess(t("carAdded"));
      }

      setCarForm(initialCarForm);
      setEditingCar(null);
      await refreshCars();
    } catch (err) {
      setAdminError(err.message || t("unableSaveCar"));
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm(t("deleteCarConfirm"))) {
      return;
    }

    try {
      await carsAPI.remove(carId);
      setAdminSuccess(t("carDeleted"));
      await refreshCars();
    } catch (err) {
      setAdminError(err.message || t("unableDeleteCar"));
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">

        <div className="page-header">
          <h1 className="page-title">🚘 {t("ourFleet")}</h1>
          <p className="page-subtitle">{loading ? t("loading") : `${filtered.length} ${t("vehiclesAvailable")}`}</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>{editingCar ? t("editCar") : t("addNewCar")}</h2>
              {editingCar && (
                <button className="btn-ghost" onClick={handleCancelEdit}>{t("cancel")}</button>
              )}
            </div>

            <div className="admin-form-grid">
              <label className="form-label">
                {t("brand")}
                <input
                  className="form-input"
                  name="brand"
                  value={carForm.brand}
                  onChange={handleFormChange}
                />
              </label>

              <label className="form-label">
                {t("type")}
                <input
                  className="form-input"
                  name="type"
                  value={carForm.type}
                  onChange={handleFormChange}
                />
              </label>

              <label className="form-label">
                {t("pricePerDay")}
                <input
                  className="form-input"
                  name="pricePerDay"
                  type="number"
                  min="0"
                  value={carForm.pricePerDay}
                  onChange={handleFormChange}
                />
              </label>

              <label className="form-label">
                {t("availableUnits")}
                <input
                  className="form-input"
                  name="available"
                  type="number"
                  min="0"
                  value={carForm.available}
                  onChange={handleFormChange}
                />
              </label>
            </div>

            {adminError && <div className="alert alert-error">⚠️ {adminError}</div>}
            {adminSuccess && <div className="alert alert-success">✅ {adminSuccess}</div>}

            <button className="btn-primary btn-full" onClick={handleSaveCar}>
              {editingCar ? t("saveChanges") : t("addCar")}
            </button>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">{t("loadingCars")}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <input
                className="form-input"
                placeholder={t("searchByBrand")}
                style={{ maxWidth: "240px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="cars-filters">
              {types.map((type) => (
                <button
                  key={type}
                  className={`filter-pill ${activeType === type ? "active" : ""}`}
                  onClick={() => setActiveType(type)}
                >
                  {type === "All" ? t("all") : type}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">{t("noCarsFound")}</div>
                <div className="empty-state-desc">{t("tryAdjustSearch")}</div>
              </div>
            ) : (
              <div className="car-grid">
                {filtered.map((car) => (
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

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                        <Link to={`/rent/${car.id}`}>
                          <button
                            className={car.available ? "btn-success btn-full" : "btn-danger btn-full"}
                            disabled={!car.available}
                          >
                            {car.available ? "Rent this car →" : "Not Available"}
                          </button>
                        </Link>
                        {isAdmin && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: "100%" }}>
                            <button className="btn-secondary" onClick={() => handleEdit(car)}>
                                {t("edit")}
                            </button>
                            <button className="btn-danger" onClick={() => handleDelete(car.id)}>
                                {t("delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}