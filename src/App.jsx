import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { setLoadingBridge } from './api/loadingBridge';
import LoadingOverlay from './components/LoadingOverlay';
import LoginPage from './pages/LoginPage';
import QuestionsPage from './pages/QuestionsPage';
import ExamPage from './pages/ExamPage';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { authenticated } = React.useContext(AuthContext);
  return authenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { setIsLoading } = useLoading();

  // Initialize the bridge between React context and Axios interceptors
  React.useEffect(() => {
    setLoadingBridge(setIsLoading);
  }, [setIsLoading]);

  return (
    <>
      <LoadingOverlay />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/questions"
              element={<PrivateRoute><QuestionsPage /></PrivateRoute>}
            />
            <Route
              path="/exam"
              element={<PrivateRoute><ExamPage /></PrivateRoute>}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
