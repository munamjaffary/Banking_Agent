import React from 'react';
import { useNavigate } from 'react-router-dom';
import PagenotFoundImg from "../assets/icons/error.png";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className='pagenotfound'>
      <img src={PagenotFoundImg} alt="Page Not Found" />
      <h2>Oops! Page Not Found</h2>
      <button 
        onClick={() => navigate('/')}
        className="pagenotfound-btn " 
   
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default PageNotFound;
