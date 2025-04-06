import { Navigate, Route, Routes } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup"
import Login from './pages/Login'

const App = () => {

  let user = false
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path='/' element={ <Signup />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />

      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
