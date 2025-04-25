import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Game from './components/Game';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <Game />
    </AppContainer>
  );
};

export default App;
