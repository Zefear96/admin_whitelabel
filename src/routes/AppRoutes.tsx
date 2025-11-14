import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/dashboard/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import { mapSectionsToMenuItems } from "../utils/mapSectionsToMenu";
import { useEffect, useState } from "react";
import { fetchMenuSections } from "../services/fetchMenuSections";
import { filterEnabledSections } from "../utils/filterEnabledSections";
import type { SectionMenuType } from "../types/sections";
import { mapSectionsToRoutes } from "../utils/mapSectionsToRoutes";
import Loader from "../components/dataDisplay/loader/Loader";
import ServiceDeskClientsPage from "../pages/service-desk/clients/ServiceDeskClientsPage";
import ServiceDeskRequestsPage from "../pages/service-desk/ServiceDeskRequestsPage";
import ServiceDeskTransactionsPage from "../pages/service-desk/transactionHistory/ServiceDeskTransactionsPage";
import ServiceDeskDisputesPage from "../pages/service-desk/ServiceDeskDisputesPage";
import ClientDetails from "../pages/service-desk/clients/ClientDetails";

export default function AppRoutes() {
  const [sections, setSections] = useState<SectionMenuType[]>([]);
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
      {/* Защищённая главная страница */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      >
        {/* {mapSectionsToRoutes(sections)} */}
        <Route path="/service-desk/clients" element={<ServiceDeskClientsPage/>}/>
        <Route path="/service-desk/requests" element={<ServiceDeskRequestsPage/>}/>
        <Route path="/service-desk/transactions" element={<ServiceDeskTransactionsPage />}/>
        <Route path="/service-desk/disputes" element={<ServiceDeskDisputesPage/>}/>
        <Route path="/service-desk/clients/details/:id" element={<ClientDetails/>} />
        {/* <Route path="/service-desk/clients" element={<ServiceDeskPage/>}/>
        <Route path="/service-desk/clients" element={<ServiceDeskPage/>}/>
        <Route path="/service-desk/clients" element={<ServiceDeskPage/>}/>
        <Route path="/service-desk/clients" element={<ServiceDeskPage/>}/>
        <Route path="/service-desk/clients" element={<ServiceDeskPage/>}/> */}

      </Route>

      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* Редирект всех неизвестных путей на главную страницу */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}