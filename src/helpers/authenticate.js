import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Authenticate = (props) => {

  const currentUser = useSelector(state => state.auth.user);




  console.log("currentUser",currentUser);

  useEffect(() => {

    if(currentUser){
      console.log("currentUser",currentUser);
    }

  }, [currentUser])

  const location = useLocation()
  if (!currentUser.login){
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return props.children;
}

export default Authenticate;