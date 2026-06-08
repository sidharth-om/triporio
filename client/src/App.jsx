import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/layout/Layout';
import AdminLayout from './pages/admin/AdminLayout';

// Auth Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TripPlanPage from './pages/TripPlanPage';
import TripCartPage from './pages/TripCartPage';
import DashboardPage from './pages/DashboardPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManageEvents from './pages/admin/ManageEvents';
import ManageTrips from './pages/admin/ManageTrips';

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/destinations" element={<Layout><DestinationsPage /></Layout>} />
        <Route path="/destinations/:id" element={<Layout><DestinationDetailsPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

        {/* Protected User Routes */}
        <Route path="/trip-plan" element={<ProtectedRoute><Layout><TripPlanPage /></Layout></ProtectedRoute>} />
        <Route path="/trip-cart" element={<ProtectedRoute><Layout><TripCartPage /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="destinations" element={<ManageDestinations />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="trips" element={<ManageTrips />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
