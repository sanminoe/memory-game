import { useState } from "react";
import { Header, Text, Center, Box } from "@mantine/core";
import Game from "./containers/Game/Game";

function App() {
  return (
    <div className="App">
      <Header height={60}>
        <Center>
          <Box>
            <Text component="h1" align="center" size="xl">
              Memory
            </Text>
          </Box>
        </Center>
      </Header>
      <Center>
        <Game></Game>
      </Center>
    </div>
  );
}

export default App;
