import styled from 'styled-components';

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(238, 229, 229, 0.45);
  width: 700px;
  border-radius: 10px;
  padding-bottom: 15px;
`;

export const Form = styled.input`
  color: rgb(38, 38, 38);
  border-radius: 8px;
  padding: 9px 0px 7px 8px;
  margin-bottom: 0.4rem;
  margin-top: 0.4rem;
  border: rgb(219, 219, 219) solid 1px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 0.5em 3em;
  border: 0.16em solid #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 600;
  background-color: rgba(238, 229, 229, 0.465);
  cursor: pointer;
  color: black;
  text-align: center;
  transition: all 0.15s;

  &:hover {
    background-color: rgb(102, 10, 105);
    border-color: #ffffff;
    color: white;
  }
`;

export const CenterFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Select = styled.select`
  margin-bottom: 1em;
  padding: 0.25em;
  border: 0;
  border-bottom: 2px solid black;
  border-radius: 0;
  font-family: 'Ubuntu', sans-serif;

  &:focus,
  &:active {
    outline: 0;
  }
`;

export const LoginInput = styled(Form)`
  width: 265px;
  height: 37px;
  display: block;
`;

const LoginButton = styled.input`
  font-size: 1rem;
  font-weight: 500;
  padding: 7px;
  border-radius: 8px;
  color: black;
  width: 100%;
  font-family: 'Ubuntu', sans-serif;
  &:focus {
    outline: none;
  }
`;

export const ValidLoginButton = styled(LoginButton)`
  background-color: rgb(102, 10, 105);
  cursor: pointer;
  color: white;
`;

export const InvalidLoginButton = styled(LoginButton)`
  background-color: rgb(240, 200, 250);
`;

export const Table = styled.table`
  border-collapse: collapse;
  background: rgba(255, 255, 255, 50%);
  border-radius: 0.25em;
  padding: 0.75em;
  border-radius: 0.25em;
`;

export const TableCell = styled.td`
  padding: 0.8em;
`;

export const TableHead = styled.thead`
  background-color: grey;
  color: white;
  padding: 0.8em;
`;
