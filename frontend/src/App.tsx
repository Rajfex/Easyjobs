import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { SinglePostPage } from './pages/SinglePostPage';
import NotFound from './components/404';
import { LandingPage } from './pages/LandingPage';
import { CategoriesProvider } from './context/CategoriesContext';
const App: React.FC = () => {
  return (
    <Router>
      <CategoriesProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/post/:id" element={<SinglePostPage />} />
              <Route path="/*" element={<NotFound />} />
              </Routes>
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </CategoriesProvider>
    </Router>
  );
};

export default App;