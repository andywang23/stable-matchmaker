import React from 'react';

const App = (props) => {
  return (
    <div className="main-container">
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <h4>Select Your Role Below</h4>
      <div className="role-btn-container">
        <button>User</button>
        <button>Admin</button>
      </div>
    </div>
  );
};

export default App;
