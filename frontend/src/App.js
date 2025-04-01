import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RefrshHandler from './RefrshHandler';
import Transactions from './pages/Transactions';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token') // ✅ Check if user is logged in
  );

  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token')); // ✅ Update authentication state
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/mon1.avif)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        height: "auto",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
