import React from 'react';
import { useNavigate } from 'react-router-dom';

import './SkillCard.css';

const SkillCard = ({ user }) => {
  const navigate = useNavigate();

  const tp = () => {
    navigate(`/user/${user._id}`);
  };
  
  return (
    <div className="skill__card" onClick={tp}>
      {user.username}
    </div>
  );
};

export default SkillCard;