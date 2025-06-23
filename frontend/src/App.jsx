import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup"
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'

import { useAuthStore } from './stores/useAuthStore';
import Navbar from './components/Navbar'
import { useEffect } from 'react';

const App = () => {

  const { user, checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path='/profile' element={user ? <Profile /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
