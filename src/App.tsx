import React from 'react';
import ChatInterface from './components/ChatInterface';
import MenuSidebar from './components/MenuSidebar';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <ChatInterface />
      <MenuSidebar />
    </AppContainer>
  );
};

export default App;
