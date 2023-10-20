import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import { loadUser } from './actions/userAction';

import Home from './components/Home/Home';
import Header from './components/Layout/Header/Header';

import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

import Account from './components/User/Account';

import FilterSkills from './components/Skills/FilterSkills/FilterSkills';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {isAuthenticated && <Route path="/account" element={<Account />} />}

        <Route path="/skills" element={<FilterSkills />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
      />
    </Router>
  );
}

export default App;