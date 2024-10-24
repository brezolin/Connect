import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      {/* Outras rotas aqui */}
    </Routes>
  </Router>
);

export default AppRoutes;
