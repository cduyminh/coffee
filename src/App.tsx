import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import styled from "styled-components";
import { ICurrentResponses } from "./interface";
import "@mantine/core/styles.css";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: row;
  justify-content: center;
`;

const App: React.FC = () => {
  const [currentResponse, setCurrentResponse] = useState<ICurrentResponses>({
    thought: "",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
    move5: "",
    response: "",
    currentOrder: [],
    done: false,
  });
  return (
    <AppContainer>
      <ChatInterface
        currentResponse={currentResponse}
        setCurrentResponse={setCurrentResponse}
      />
      {/* <MenuSidebar currentResponse={currentResponse}/> */}
    </AppContainer>
  );
};

export default App;
