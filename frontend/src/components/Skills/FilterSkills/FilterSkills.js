import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFilteredUsers, clearErrors } from '../../../actions/skillAction';
import { toast } from 'react-toastify';

import SkillCard from '../SkillCard';
import Loader from '../../Layout/Loader/Loader';

import './FilterSkills.css';

const FilterSkills = () => {
  const dispatch = useDispatch();
  const {
    users,
    usersCount,
    resultPerPage,
    filteredUsersCount,
    error,
  } = useSelector(state => state.filterUsers);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState([]);
  const [experience, setExperience] = useState(' ');
  const [workLevel, setWorkLevel] = useState(' ');

  const keywordHandler = () => {
    let arr = [];
    document.getElementById('keyword').value.split(',').forEach((item) => {
      if (!arr.includes(item)) {
        arr.push(item.trim());
      };
    });
    
    setKeyword(arr);
  };

  const experienceHandler = () => {
    setExperience(document.getElementById('experience').value);
  };

  const workLevelHandler = () => {
    setWorkLevel(document.getElementById('workLevel').value);
  };

    const handelInfiniteScroll = () => {
    let box = document.getElementById("box");
      
    try {
      if (window.innerHeight + box.scrollTop + 25 >= box.scrollHeight) {
        if (page <= (Math.round(filteredUsersCount / 12) || 1)) {
           setPage(page + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error) {
      toast(error);
      dispatch(clearErrors());
    }

    dispatch(getFilteredUsers(page, keyword, experience, workLevel));
  }, [dispatch, toast, error, page, keyword, experience, workLevel]);
  
  return (
    <div className="filter__skills">
      <div className="filter__header">
        <div className="filter__title">
          Filter Skills
        </div>
        <div className="filter__desc">
          Filter and Find Skills from {usersCount} Skills
        </div>
      </div>

      <div className="filter__body">
        <div className="filter__body__header">
          Skills unite us, knowledge elevates us - welcome to the exchange of mastery.
        </div>

        <div className="filter__body__input">
          <lable className="filter__body__input__label">Search by Keywords, Separated by Commas (,)</lable>
          <input type="text" id="keyword" placeholder="Enter Keywords" onChange={keywordHandler} />
        </div>

        <div className="filter__body__input">
          <lable className="filter__body__input__label">Experience Level</lable>
          <select id="experience" onChange={experienceHandler} defaultValue=" ">
            <option disabled hidden value=" ">Enter Experience Level</option>
            <option value="1 years">1 years</option>
            <option value="2 years">2 years</option>
            <option value="3 years">3 years</option>
          </select>
        </div>

        <div className="filter__body__input">
          <lable className="filter__body__input__label">Work Level</lable>
          <select id="workLevel" onChange={workLevelHandler} defaultValue=" ">
            <option disabled hidden value=" ">Enter Work Level</option>
            <option value="Beginner-Level">Beginner-Level</option>
            <option value="Intermediate-Level">Intermediate-Level</option>
            <option value="Expert-Level">Expert-Level</option>
          </select>
        </div>

        <div className="filter__body__users" id="box" onScroll={handelInfiniteScroll}>
          <div className="filter__body__users__con">
            {(!users?.length && filteredUsersCount !== 0) ? (
              <Loader />
            ) : (
              filteredUsersCount === 0 ? (
                <div className="filter__body__users__con__notFound">No Users Found</div>
              ) : (
                <div className="filter__body__users__con__users">
                {
                  users.map((user) => ( <SkillCard key={user._id} user={user} /> ))
                }
              </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSkills;