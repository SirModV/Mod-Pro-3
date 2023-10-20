import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import { RxCross2 } from "react-icons/rx";
import { FaBars } from "react-icons/fa";

import { AiFillInstagram } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";

import "./Navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  const click = (e) => {
    e.preventDefault();

    document.getElementById('menu').classList.toggle('dropdown-is-active');
  };


  const tp = (e) => {
    document.getElementById('menu').classList.toggle('dropdown-is-active');

    let text = e.target.innerText
    
    if (text === 'Home' || text === 'ModShare')
      navigate('/');
    else if (text === 'Account')
      navigate('/account');
    else if (text === 'Login')
      navigate('/login');
    else if (text === 'Sign Up')
      navigate('/signup');
    else if (text === 'Find Skills to Exchange')
      navigate('/skills');
    else
      navigate(`/${text}`);
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo" onClick={tp}>
          ModShare
        </div>
      </div>

      <ul className="cd-dropdown" id="menu">
        <li className="nav__header">
          <div className="nav__title">ModShare</div>
          
          <RxCross2 onClick={click} className="back"/>
        </li>
        
        <li className="nav__item">
          <div className="nav__link" onClick={tp}>Home</div>
        </li>
        
        {isAuthenticated && <li className="nav__item">
          <div className="nav__link" onClick={tp}>Account</div>
        </li>}
        
        <li className="nav__item">
          <div className="nav__link" onClick={tp}>Find Skills to Exchange</div>
        </li>

        <li className="nav__item">
          <div className="nav__link" onClick={tp}>Skill Exchange Requests</div>
        </li>

        <li className="nav__item">
          <div className="nav__link" onClick={tp}>Exchanging Skills</div>
        </li>

        <li className="nav__footer">
          {!isAuthenticated && (<div className="nav__auth">
            <button className="nav__signup" onClick={tp}>Sign Up</button>
            <button className="nav__login" onClick={tp}>Login</button>
          </div>)}

          {/*Enter your Email and social media below*/}
          
          <div className="nav__contact">
            Get in Touch
            <div>
              contact@modshare.com
            </div>
          </div>

          <div className="nav__social">
            <a href="/">
              <AiFillInstagram className="nav__social-icon"/>
            </a>

            <a href="/">
              <BiLogoFacebook className="nav__social-icon"/>
            </a>

            <a href="/">
              <BsTwitter className="nav__social-icon"/>
            </a>
          </div>
        </li>
      </ul>

      <div className="nav__btn">
        <FaBars className="nav__bars" onClick={click} />
      </div>
    </nav>
  );
};
    
export default Navbar;