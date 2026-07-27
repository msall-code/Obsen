import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './vues/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import EquipmentView from './vues/Equipements/EquipmentView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : Login */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées (nécessitent d'être connecté) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'user']} />}>
          <Route path="/" element={<EquipmentView />} />
          {/* Tes autres pages protégées... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;