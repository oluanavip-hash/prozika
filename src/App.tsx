import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyOrders from './pages/MyOrders';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import DashboardOverview from './pages/dashboard/Overview';
import DashboardOrders from './pages/dashboard/Orders';
import DashboardCustomers from './pages/dashboard/Customers';
import DashboardReports from './pages/dashboard/Reports';
import DashboardSettings from './pages/dashboard/Settings';
import DashboardSupport from './pages/dashboard/Support';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route 
          path="meus-pedidos" 
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="pedidos" element={<DashboardOrders />} />
          <Route path="clientes" element={<DashboardCustomers />} />
          <Route path="relatorios" element={<DashboardReports />} />
          <Route path="configuracoes" element={<DashboardSettings />} />
          <Route path="suporte" element={<DashboardSupport />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
