import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cars from "./Pages/Cars";
import Rent from "./Pages/Rent";
import MyRentals from "./Pages/MyRentals";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/rent/:id" element={<Rent />} />
          <Route path="/my-rentals" element={<MyRentals />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}