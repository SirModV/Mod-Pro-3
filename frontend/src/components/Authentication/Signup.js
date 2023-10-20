import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signup, clearErrors } from '../../actions/userAction';
import { toast } from "react-toastify";

import { Skills, autoComplete } from "../../Skills";

import { RxCross2 } from "react-icons/rx";

import ProfileImg from '../../images/profile.jpg';
import './Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [seekingSkillValues, setSeekingSkillValues] = useState([]);
  const [offeringSkillValues, setOfferingSkillValues] = useState([]);
  const [avatar, setAvatar] = useState("");

  const tp = () => {
    navigate('/login');
  };

  const resetSeekingTemplate = () => {
    document.getElementById('seeking__skill__template__title').value = "";
    document.getElementById('seeking__skill__template__experience').value = "0";
    document.getElementById('seeking__skill__template__workLevel').value = "0";
  };

  const resetOfferingTemplate = () => {
    document.getElementById('offering__skill__template__title').value = "";
    document.getElementById('offering__skill__template__experience').value = "0";
    document.getElementById('offering__skill__template__workLevel').value = "0";
  };

  const addSkillTemplate = (e, type) => {
    if (type === 'seeking') {
      document.getElementById('auth__signup__seeking__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__seeking__skill__template').classList.toggle('hidden');
      autoComplete(document.getElementById('seeking__skill__template__title'), [...Skills], seekingSkillValues);
    } else if (type === 'offering') {
      document.getElementById('auth__signup__offering__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__offering__skill__template').classList.toggle('hidden');
      autoComplete(document.getElementById('offering__skill__template__title'), [...Skills], offeringSkillValues);
    }
  };

  const cancelSkillTemplate = (e, type) => {
    if (type === 'seeking') {
      resetSeekingTemplate();
      document.getElementById('auth__signup__seeking__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__seeking__skill__template').classList.toggle('hidden');
    } else if (type === 'offering') {
      resetOfferingTemplate();

      document.getElementById('auth__signup__offering__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__offering__skill__template').classList.toggle('hidden');
    }
  };

  const addSkill = (e, type) => {
    if (type === 'seeking') {
      if (document.getElementById('seeking__skill__template__title').value === "" || document.getElementById('seeking__skill__template__experience').value === "0" || document.getElementById('seeking__skill__template__workLevel').value === "0") {
        return toast('Please Fill all the Skill Fields');
      } else if (!Skills.includes(document.getElementById('seeking__skill__template__title').value)) {
        return toast('Please Select a Valid Skill');
      }
      setSeekingSkillValues([...seekingSkillValues, {
        title: document.getElementById('seeking__skill__template__title').value,
        experience: document.getElementById('seeking__skill__template__experience').value,
        workLevel: document.getElementById('seeking__skill__template__workLevel').value,
      }]);
      resetSeekingTemplate();
      document.getElementById('auth__signup__seeking__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__seeking__skill__template').classList.toggle('hidden');
    } else if (type === 'offering') {
      if (document.getElementById('offering__skill__template__title').value === "" || document.getElementById('offering__skill__template__experience').value === "0" || document.getElementById('offering__skill__template__workLevel').value === "0") {
        return toast('Please Fill all the Skill Fields');
      } else if (!Skills.includes(document.getElementById('offering__skill__template__title').value)) {
        return toast('Please Select a Valid Skill');
      }
      setOfferingSkillValues([...offeringSkillValues, {
        title: document.getElementById('offering__skill__template__title').value,
        experience: document.getElementById('offering__skill__template__experience').value,
        workLevel: document.getElementById('offering__skill__template__workLevel').value,
      }]);
      resetOfferingTemplate();
      document.getElementById('auth__signup__offering__add__template').classList.toggle('hidden');
      document.getElementById('auth__signup__offering__skill__template').classList.toggle('hidden');
    }
  };

  const cancelSkill = (e, type) => {
    if (type === 'seeking') {
      const index = seekingSkillValues.findIndex(
        (elem) => elem.title === e.target.parentElement.getAttribute('data-title')
      );
      if (index > -1) {
        const arr = [...seekingSkillValues];
        arr.splice(index, 1);
        setSeekingSkillValues(arr);
      }
    } else if (type === 'offering') {
      const index = offeringSkillValues.findIndex(
        (elem) => elem.title === e.target.parentElement.getAttribute('data-title')
      );
      if (index > -1) {
        const arr = [...offeringSkillValues];
        arr.splice(index, 1);
        setOfferingSkillValues(arr);
      }
    }
  };

  const Submit = (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn');
    btn.classList.toggle('disabled');
    btn.disbled = true;
    btn.innerHTML = 'Please Wait...';

    const password = document.getElementById('password').value;

    dispatch(signup({
      username: e.target[0].value,
      email: e.target[1].value,
      description: e.target[2].value,
      seekingSkills: seekingSkillValues,
      offeringSkills: offeringSkillValues,
      avatar: avatar,
      password,
    }));

    setTimeout(() => {
      btn.classList.toggle('disabled');
      btn.disbled = false;
      btn.innerHTML = 'Sign Up';
    
    }, 3000);
  };

  useEffect(() => {
    async function pic() {
      let data = await fetch(`${window.location.protocol}://${window.location.host}/${ProfileImg}`);
      const blob = await data.blob();
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    }

    pic();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, navigate, error, isAuthenticated]);

  return (
    <div className="auth__signup">
      <div className="auth__signup__header">
        <div className="auth__signup__title">ModShare</div>
        <div className="auth__signup__desc">Create your Account</div>
      </div>

      <div className="auth__signup__body">
        <form autoComplete="off" className="auth__signup__form" onSubmit={Submit}>
          <div className="auth__signup__input">
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Enter your username" required />
          </div>
          
          <div className="auth__signup__input">
            <label htmlFor="email">Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="auth__signup__input">
            <label htmlFor="description">Description</label>
            <textarea placeholder="Please share with us your Skills and what you consider to be your strongest areas of expertise." required minLength="50" maxLength="2000" />
          </div>

          <div className="auth__signup__input">
            <div className="auth__signup__input__info">
              <label htmlFor="email">Skills You are Seeking</label>

              <div className="auth__signup__add" id="auth__signup__seeking__add__template" onClick={(e) => addSkillTemplate(e, "seeking")}>Add New</div>
            </div>
            
            <input readOnly className="hidden" required value={seekingSkillValues} />
            <div className="auth__signup__skill__value">
              {(seekingSkillValues.length !== 0) ? seekingSkillValues.map((skill, index) => (
                  <div className="auth__signup__skill__value__item" key={index}>
                    <div className="auth__signup__skill__value__item__title" data-title={skill.title}>
                      {skill.title}
                      <RxCross2 data-title={skill.title} onClick={(e) => cancelSkill(e, 'seeking')} className="auth__signup__skill__value__item__icon"/>
                    </div>
                  </div>
                  )
                ) : (
                  <div className="auth__signup__skill__empty">
                    Please Enter atleast 3 Skills that you are Seeking
                  </div>
                )
              }
            </div>

            <div className="auth__signup__skill__template hidden" id="auth__signup__seeking__skill__template">
              <input type="text" id="seeking__skill__template__title" placeholder="Add Skill (e.g. Web Developer)" className="auth__signup__skill__template__value" />

              <select id="seeking__skill__template__experience" defaultValue="0" className="auth__signup__skill__template__value">
                <option disabled hidden value="0">Experience Level</option>
                <option value="1 years">1 years</option>
                <option value="2 years">2 years</option>
                <option value="3 years">3 years</option>
              </select>

              <select id="seeking__skill__template__workLevel" defaultValue="0" className="auth__signup__skill__template__value">
                <option disabled hidden value="0">Work Level</option>
                <option value="Beginner-Level">Beginner-Level</option>
                <option value="Intermediate-Level">Intermediate-Level</option>
                <option value="Expert-Level">Expert-Level</option>
              </select>

              <div className="auth__signup__template__actions">
                <div className="auth__signup__template__btn" onClick={(e) => cancelSkillTemplate(e, "seeking")}>Cancel</div>
                <div className="auth__signup__template__btn" onClick={(e) => addSkill(e, "seeking")} data-btn="add">Add</div>
              </div>
            </div>
          </div>

          <div className="auth__signup__input">
            <div className="auth__signup__input__info">
              <label htmlFor="email">Skills You can Offer</label>

              <div className="auth__signup__add" id="auth__signup__offering__add__template" onClick={(e) => addSkillTemplate(e, "offering")}>Add New</div>
            </div>
            
            <input readOnly className="hidden" required value={offeringSkillValues} />
            <div className="auth__signup__skill__value">
              {(offeringSkillValues.length !== 0) ? offeringSkillValues.map((skill, index) => (
                  <div className="auth__signup__skill__value__item" key={index}>
                    <div className="auth__signup__skill__value__item__title" data-title={skill.title}>
                      {skill.title}
                      <RxCross2 data-title={skill.title} onClick={(e) => cancelSkill(e, 'offering')} className="auth__signup__skill__value__item__icon" />
                    </div>
                  </div>
                  )
                ) : (
                  <div className="auth__signup__skill__empty">
                    Please Enter atleast 3 Skills that you are Offering
                  </div>
                )
              }
            </div>

            <div className="auth__signup__skill__template hidden" id="auth__signup__offering__skill__template">
              <input type="text" id="offering__skill__template__title" placeholder="Add Skill (e.g. Web Developer)" className="auth__signup__skill__template__value" />

              <select id="offering__skill__template__experience" defaultValue="0" className="auth__signup__skill__template__value">
                <option disabled hidden value="0">Experience Level</option>
                <option value="1 years">1 years</option>
                <option value="2 years">2 years</option>
                <option value="3 years">3 years</option>
              </select>

              <select id="offering__skill__template__workLevel" defaultValue="0" className="auth__signup__skill__template__value">
                <option disabled hidden value="0">Work Level</option>
                <option value="Beginner-Level">Beginner-Level</option>
                <option value="Intermediate-Level">Intermediate-Level</option>
                <option value="Expert-Level">Expert-Level</option>
              </select>

              <div className="auth__signup__template__actions">
                <div className="auth__signup__template__btn" onClick={(e) => cancelSkillTemplate(e, "offering")}>Cancel</div>
                <div className="auth__signup__template__btn" onClick={(e) => addSkill(e, "offering")} data-btn="add">Add</div>
              </div>
            </div>
          </div>

          <div className="auth__signup__input">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required minLength="8" />
          </div>

          <div className="auth__signup__btn">
            <button id="btn" type="submit">Sign Up</button>
          </div>
        </form>

        <div className="auth__signup__tp">
          Already a Member ?
          <div className="auth__signup__link" onClick={tp}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;