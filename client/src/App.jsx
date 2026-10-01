import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import CalendarPage from './pages/CalendarPage';
import MyEventsPage from './pages/MyEventsPage';
import RemindersPage from './pages/RemindersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a global loader if needed, but ProtectedRoute handles most

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
