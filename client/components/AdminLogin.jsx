import React from 'react';

import { useState } from 'react';
import AdminMain from './AdminMain';

const AdminLogin = (props) => {
  const [registrationFormToggle, setRegistrationFormToggle] = useState(false);

  const [userName, setUserName] = useState('Andy');
  const [userLoggedIn, setUserLoggedIn] = useState(true);

  return (
    <div>
      <h1>Admin Page</h1>
      <h4>Please either sign in or log in</h4>

      <div className="login-form"></div>

      {userLoggedIn && <AdminMain userName={userName} />}
    </div>
  );
};

export default AdminLogin;
