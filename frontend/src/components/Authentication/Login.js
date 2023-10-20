import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearErrors } from '../../actions/userAction';

import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const tp = () => {
    navigate('/signup');
  }

  const forgotPassword = () => {
    navigate('/password/forgot');
  };

  const Submit = (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn');
    btn.classList.toggle('disabled');
    btn.disabled = true;
    btn.innerHTML = 'Please Wait...';
    
    dispatch(login(e.target[0].value, e.target[1].value));

    setTimeout(() => {
      btn.classList.toggle('disabled');
      btn.disabled = false;
      btn.innerHTML = 'Login';
    }, 3000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, navigate, error, isAuthenticated]);
  
  return (
    <div className="auth__login">
      <div className="auth__login__header">
        <div className="auth__login__title">ModShare</div>
        <div className="auth__login__desc">Log in to your Account</div>
      </div>

      <div className="auth__login__body">
        <form onSubmit={Submit} className="auth__login__form">
          <div className="auth__login__input">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          
          <div className="auth__login__input">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>

          <div className="auth__login__forgotPass" onClick={forgotPassword}>
            Forgot Password ?
          </div>

          <div className="auth__login__btn">
            <button id='btn' type="submit">Login</button>
          </div>
        </form>

        <div className="auth__login__tp">
          Not a Member ?
          <div className="auth__login__link" onClick={tp}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;