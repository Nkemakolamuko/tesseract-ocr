import { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";
import ImageCropper from "./components/ImageCropper";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import PlateRecognition from "./components/PlateRecognition";
import WelcomePage from "./components/WelcomePage";
import Nav from "./components/Nav";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  const location = useLocation();

  // Define the paths where the Header should be hidden
  const hideHeaderPaths = ["/login", "/register"];

  return (
    <div className="App">
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/add-new" element={<PlateRecognition />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
