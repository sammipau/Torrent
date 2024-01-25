import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./Navigation/Navbar.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import All from "./pages/all";
import Tags from "./pages/tags";
import Categories from "./pages/categories";
import Login from './pages/login';
import User from './pages/user';
import Cookies from 'js-cookie';
import Projection from './pages/projection';
import Stats from './pages/stats';

// TODO: implement isAuth logic in backend for a user.
const isAuth = !!Cookies.get('uid');



function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/all" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/all" element={<All />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/user" element={isAuth ? < User/> : <Navigate to="/login" />} />
        <Route path="/projection" element={<Projection />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  )
}

export default App;