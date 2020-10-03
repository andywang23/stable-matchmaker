import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container } from '../styles/styledComponents';
import styled from 'styled-components';

const RoleButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const RoleButton = styled(Button)`
  width: 155px;
`;

const HomePage = () => {
  return (
    <Container>
      <h1>Welcome to the Ultimate Matchmaker</h1>
      <h4>Select Your Role Below</h4>
      <RoleButtonContainer>
        <NavLink to="/user">
          <RoleButton>User</RoleButton>
        </NavLink>
        <NavLink to="/admin">
          <RoleButton>Matchmaker</RoleButton>
        </NavLink>
      </RoleButtonContainer>
    </Container>
  );
};

export default HomePage;
