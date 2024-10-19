import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      {/* Outras rotas aqui */}
    </Routes>
  </Router>
);

export default AppRoutes;
