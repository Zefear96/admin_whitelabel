import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/dashboard/HomePage";
import TestKeycloakPage from "../pages/auth/TestKeycloakPage";
import ProtectedRoute from "./ProtectedRoute";
import { mapSectionsToMenuItems } from "../utils/mapSectionsToMenu";
import { useEffect, useState } from "react";
import { fetchMenuSections } from "../services/fetchMenuSections";
import { filterEnabledSections } from "../utils/filterEnabledSections";
import type { Section } from "../types/sections";
import { mapSectionsToRoutes } from "../utils/mapSectionsToRoutes";
import Loader from "../components/dataDisplay/loader/Loader";

export default function AppRoutes() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchMenuSections().then(data => {
      setSections(filterEnabledSections(data));
    });
  }, []);

  useEffect(() => {
    if(location.pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000)
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false)
    }
  }, [location.pathname]);

  if(loading) {
    return <Loader/>;
  }

  return (
    <Routes>
      {/* <Route path="/test-keycloak" element={<TestKeycloakPage />} /> */}

      {/* Защищённая главная страница */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      >
        {mapSectionsToRoutes(sections)}
      </Route>

      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* Редирект всех неизвестных путей на главную страницу */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}