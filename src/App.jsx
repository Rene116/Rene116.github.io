import { useState } from 'react';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Startups } from './pages/Startups';
import { Technologies } from './pages/Technologies';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const correctUsername = 'admin';
  const correctPassword = 'password123';

  const handleLogin = () => {
    if (
      credentials.username === correctUsername &&
      credentials.password === correctPassword
    ) {
      setIsAuthenticated(true);
      setShowAuthDialog(false);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <Router>
      {showAuthDialog && (
        <div className="auth-dialog">
          <div>
            <h2>Autenticación</h2>
            <form action="submit" className="auth-box">
              <input
                type="text"
                placeholder="Usuario"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="border p-2"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="border p-2"
              />
              <button
                onClick={handleLogin}
                type="submit"
                className="button success"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          <nav className="navbar">
            <img className="logo" src="public/logo.jpg" alt="" />
            <Link to="/startups" className="link">
              Startups
            </Link>
            <Link to="/technologies" className="link">
              Technologies
            </Link>
          </nav>
          <Routes>
            <Route path="/startups" element={<Startups />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="*" element={<Navigate to="/startups" />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
