import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Dashboard />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Welcome />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/automod"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Automoderación</h1>
                <p className="text-muted-foreground">En construcción...</p>
              </div>
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Gestión de Roles</h1>
                <p className="text-muted-foreground">En construcción...</p>
              </div>
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Formularios</h1>
                <p className="text-muted-foreground">En construcción...</p>
              </div>
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderation"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Moderación</h1>
                <p className="text-muted-foreground">En construcción...</p>
              </div>
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">Envíos de Formularios</h1>
                <p className="text-muted-foreground">En construcción...</p>
              </div>
            </>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
