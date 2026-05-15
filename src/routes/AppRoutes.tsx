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
// Access Control
import AccessControlPageRoles from "../pages/backoffice/access-control/AccessControlPageRoles";
import AccessControlPagePrivileges from "../pages/backoffice/access-control/AccessControlPagePrivileges";
import AccessControlPageProfiles from "../pages/backoffice/access-control/AccessControlPageProfiles";
// Compliance
import CompliancePageClients from "../pages/compliance/CompliancePageClients";
import CompliancePageOperations from "../pages/compliance/CompliancePageOperations";
import CompliancePageBlacklist from "../pages/compliance/CompliancePageBlacklist";
import CompliancePageAntifraud from "../pages/compliance/CompliancePageAntifraud";
// Analytics
import AnalyticsPageReportsClients from "../pages/analytics/reports/clients/AnalyticsPageReportsClients";
import AnalyticsPageReportsTransactions from "../pages/analytics/reports/transactions/AnalyticsPageReportsTransactions";
import AnalyticsPageActs from "../pages/analytics/acts/AnalyticsPageActs";
import AnalyticsPageDisputs from "../pages/analytics/disputs/AnalyticsPageDisputs";
import AnalyticsPageMonitoring from "../pages/analytics/monitoring/AnalyticsPageMonitoring";
// Administration
import AdministrationPageProductsAccounts from "../pages/administration/products/AdministrationPageProductsAccounts";
import AdministrationPageProductsCards from "../pages/administration/products/AdministrationPageProductsCards";
import AdministrationPageProductsMudaraba from "../pages/administration/products/AdministrationPageProductsMudaraba";
import AdministrationPageProductsMurabaha from "../pages/administration/products/AdministrationPageProductsMurabaha";
import AdministrationPageProductsSafe from "../pages/administration/products/AdministrationPageProductsSafe";
import AdministrationPageNotifications from "../pages/administration/notifications/AdministrationPageNotifications";
import AdministrationPageServices from "../pages/administration/AdministrationPageServices";
import AdministrationPageTariffs from "../pages/administration/AdministrationPageTariffs";
import AdministrationPageLimitsCorporate from "../pages/administration/limits/AdministrationPageLimitsCorporate";
import AdministrationPageLimitsPe from "../pages/administration/limits/AdministrationPageLimitsPe";
import AdministrationPageLimitsRetail from "../pages/administration/limits/AdministrationPageLimitsRetail";
import AdministrationPageLimitsOnline from "../pages/administration/limits/AdministrationPageLimitsOnline";
// Marketing
import MarketingPagePromotions from "../pages/marketing/MarketingPagePromotions";
import MarketingPageBanners from "../pages/marketing/MarketingPageBanners";
import MarketingPageNews from "../pages/marketing/MarketingPageNews";
import DetailsTransactionsBank from "../pages/analytics/reports/transactions/DetailsTransactionsBank";
import DictionaryAccountPage from "../pages/administration/dictionary/accounts/DictionaryAccountPage";
import DictionarySwiftPage from "../pages/administration/dictionary/swift/DictionarySwiftPage";
import DictionaryCountryPage from "../pages/administration/dictionary/countries/DictionaryCountryPage";
import DictionaryCurrenciesPage from "../pages/administration/dictionary/currencies/DictionaryCurrenciesPage";
import DictionaryTransactionTypesPage from "../pages/administration/dictionary/transactionTypes/DictionaryTransactionTypesPage";
import AdministrationPageAgents from "../pages/administration/agents/AdministrationPageAgents";
import AgentDetailsPage from "../pages/administration/agents/AgentDetailsPage";
import LogoutPage from "../pages/logout/LogoutPage";
import AdministrationPageLimitsAgent from "../pages/administration/limits/AdministrationPageLimitsAgent";

export default function AppRoutes() {
  const [sections, setSections] = useState<SectionMenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    fetchMenuSections().then(data => {
      setSections(filterEnabledSections(data));
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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
        {/* Access Control */}
        <Route path="/access-control/roles" element={<AccessControlPageRoles/>}/>
        <Route path="/access-control/privileges" element={<AccessControlPagePrivileges/>}/>
        <Route path="/access-control/profiles" element={<AccessControlPageProfiles/>}/>
        
        {/* Compliance */}
        <Route path="/compliance/clients" element={<CompliancePageClients/>}/>
        <Route path="/compliance/operations" element={<CompliancePageOperations/>}/>
        <Route path="/compliance/blacklist" element={<CompliancePageBlacklist/>}/>
        <Route path="/compliance/antifraud" element={<CompliancePageAntifraud/>}/>
        
        {/* Analytics */}
        <Route path="/analytics/reports/clients" element={<AnalyticsPageReportsClients/>}/>
        <Route path="/analytics/reports/transactions" element={<AnalyticsPageReportsTransactions/>}/>
        <Route path="/analytics/reports/transactions/:code" element={<DetailsTransactionsBank/>}/>
        <Route path="/analytics/acts" element={<AnalyticsPageActs/>}/>
        <Route path="/analytics/disputes" element={<AnalyticsPageDisputs/>}/>
        <Route path="/analytics/monitoring" element={<AnalyticsPageMonitoring/>}/>
        
        {/* Service Desk */}
        <Route path="/service-desk/clients" element={<ServiceDeskClientsPage/>}/>
        <Route path="/service-desk/requests" element={<ServiceDeskRequestsPage/>}/>
        <Route path="/service-desk/transactions" element={<ServiceDeskTransactionsPage />}/>
        <Route path="/service-desk/disputes" element={<ServiceDeskDisputesPage/>}/>
        <Route path="/service-desk/clients/details/:id" element={<ClientDetails/>} />
        
        {/* Administration */}
        <Route path="/administration/products/accounts" element={<AdministrationPageProductsAccounts/>}/>
        <Route path="/administration/products/cards" element={<AdministrationPageProductsCards/>}/>
        <Route path="/administration/products/mudaraba" element={<AdministrationPageProductsMudaraba/>}/>
        <Route path="/administration/products/murabaha" element={<AdministrationPageProductsMurabaha/>}/>
        <Route path="/administration/products/safe" element={<AdministrationPageProductsSafe/>}/>
        <Route path="/administration/notifications" element={<AdministrationPageNotifications/>}/>
        <Route path="/administration/services" element={<AdministrationPageServices/>}/>
        <Route path="/administration/tariffs" element={<AdministrationPageTariffs/>}/>
        <Route path="/administration/limits/agents" element={<AdministrationPageLimitsAgent/>}/>
        <Route path="/administration/limits/corporate" element={<AdministrationPageLimitsCorporate/>}/>
        <Route path="/administration/limits/pe" element={<AdministrationPageLimitsPe/>}/>
        <Route path="/administration/limits/retail" element={<AdministrationPageLimitsRetail/>}/>
        <Route path="/administration/limits/online" element={<AdministrationPageLimitsOnline/>}/>
        <Route path="/administration/dictionary/accounts" element={<DictionaryAccountPage/>}/>
        <Route path="/administration/dictionary/swift" element={<DictionarySwiftPage/>}/>
        <Route path="/administration/dictionary/countries" element={<DictionaryCountryPage/>}/>
        <Route path="/administration/dictionary/currencies" element={<DictionaryCurrenciesPage/>}/>
        <Route path="/administration/dictionary/transaction-types" element={<DictionaryTransactionTypesPage/>}/>
        <Route path="/administration/agents" element={<AdministrationPageAgents/>}/>
        <Route path="/administration/agents/:agent" element={<AgentDetailsPage />}/>

        {/* Marketing */}
        <Route path="/marketing/promotions" element={<MarketingPagePromotions/>}/>
        <Route path="/marketing/banners" element={<MarketingPageBanners/>}/>
        <Route path="/marketing/news" element={<MarketingPageNews/>}/>

      </Route>

      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route path="/logout" element={<LogoutPage />} />
      {/* Редирект всех неизвестных путей на главную страницу */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}