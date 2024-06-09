import { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";
import ImageCropper from "./components/ImageCropper";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlateRecognition from "./components/PlateRecognition";
import WelcomePage from "./components/WelcomePage";
import Nav from "./components/Nav";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Header />
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
    </BrowserRouter>
  );
}

export default App;
