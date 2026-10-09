import React from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Search, PlusCircle, LogIn, LogOut, UserRound } from "lucide-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportItem from "./pages/ReportItem";
import ItemDetails from "./pages/ItemDetails";

export default function App() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("lf_user") || "null");

  function logout() {
    localStorage.removeItem("lf_token");
    localStorage.removeItem("lf_user");
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="app">
      <header className="nav">
        <Link to="/" className="brand">
          <span className="brandIcon">🔎</span>
          Lost<span>&</span>Found Application
        </Link>

        <nav>
          <NavLink to="/">Browse</NavLink>
          {user && <NavLink to="/report">Report Item</NavLink>}
          {user ? (
            <button className="navButton" onClick={logout}><LogOut size={17}/> Logout</button>
          ) : (
            <Link className="loginLink" to="/login"><LogIn size={17}/> Login</Link>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
        </Routes>
      </main>

      <footer>Lost & Found Application • Smart community recovery platform</footer>
    </div>
  );
}
