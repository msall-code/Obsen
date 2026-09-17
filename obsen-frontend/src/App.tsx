import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProfileCard } from './features/identity/components/ProfileCard';
import { UserManagementTable } from './features/identity/components/UserManagementTable';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfileCard />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <div>
                  <h2>Espace Administrateur Obsen</h2>
                  <UserManagementTable />
                </div>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<h2>404 - Page non trouvée</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;