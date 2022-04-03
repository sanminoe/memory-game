import React, { useEffect, useState } from "react";
import {
  Header,
  Text,
  Center,
  Box,
  Modal,
  Tabs,
  Button,
  Select,
  Group,
  Progress,
} from "@mantine/core";

import { useInterval } from "@mantine/hooks";

import Game from "./containers/Game/Game";
import sources from "./helpers/sources";
import { v4 as uuid } from "uuid";

import "./style.css";
import { formatTime } from "./helpers/formatTime";

interface Difficulty {
  [key: string]: number;
  easy: number;
  medium: number;
  hard: number;
}

interface Card {
  id: string;
  name: string;
  src: string;
  selected: boolean;
  isCompleted: boolean;
  show: boolean;
}

function App() {
  const difficulties: Difficulty = { easy: 6, medium: 9, hard: 15 };
  const [time, setTime] = useState<number>(0);

  const interval = useInterval(() => setTime((t) => t + 1), 1000);

  const [difficulty, setDifficulty] = useState<string>("easy");
  const [level, setLevel] = useState(difficulties[difficulty]);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [canSelect, setCanSelect] = useState<boolean>(true);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  // UI

  // UI States
  const [deck, setDeck] = useState<Card[]>([]);
  const [showModal, setShowModal] = useState(true);

  const handlerStartGame = () => {
    setShowModal(false);
    createDeck();
    setIsPlaying(true);
    setIsPaused(false);
    interval.start();
  };

  const handlerPauseGame = () => {
    setShowModal(true);
    setIsPaused(true);
    interval.toggle();
  };

  const handlerRestartGame = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setTime(0);
    setDifficulty("easy");
    interval.stop();
  };

  const restartDeck = (callback: Function) => {
    setDeck([]);
  };

  const handlerSelectCard = (id: string, name: string) => {
    if (canSelect === false) {
      return;
    }
    const cardIndex = deck.findIndex((c) => c.id === id && c.name === name);
    const selectedCard: string = deck[cardIndex].id;

    let cardsSelected = [...selectedCards];

    if (cardsSelected[1] === id || deck[cardIndex].isCompleted) {
      console.log("same");
      return;
    }

    let deckCards = deck.map((c) => {
      if (c.id === id) {
        c.selected = true;
        c.show = true;
      }

      return { ...c };
    });

    cardsSelected.push(selectedCard);

    if (cardsSelected.length === 2) {
      setCanSelect(false);
    }
    setSelectedCards(cardsSelected);
  };

  const createDeck = () => {
    // Get all cards and store them
    const cards = [];

    const allCards = [];
    for (let i = 0; i < level; i++) {
      const c = sources[i];
      allCards.push({
        id: uuid(),
        ...c,
        selected: false,
        isCompleted: false,
        show: false,
      });
      allCards.push({
        id: uuid(),
        ...c,
        selected: false,
        isCompleted: false,
        show: false,
      });
    }

    const deckSize = allCards.length;

    // remove card from (allCards Array) and add them to the cards array randomly
    for (let i = 0; i < deckSize; i++) {
      cards.push(allCards.splice(Math.floor(Math.random() * allCards.length), 1)[0]);
    }

    setDeck(cards);
  };
  // validate choices
  useEffect(() => {
    if (selectedCards.length !== 2) {
      return;
    }

    const firstChoice: Card = deck.filter((c) => (c.id === selectedCards[0] ? c : null))[0];
    const secondChoice: Card = deck.filter((c) => (c.id === selectedCards[1] ? c : null))[0];

    let timeOutId: number;

    let deckCards: Card[] = [];
    if (firstChoice.name === secondChoice.name && firstChoice.id !== secondChoice.id) {
      deckCards = deck.map((c) => {
        if (c.id === firstChoice.id) {
          c.isCompleted = true;
          c.show = true;
        }

        if (c.id === secondChoice.id) {
          c.isCompleted = true;
          c.show = true;
        }

        return { ...c };
      });

      setDeck(deckCards);
      setSelectedCards([]);
      setCanSelect(true);
    } else {
      // Do not match
      deckCards = deck.map((c) => {
        if (c.id === firstChoice.id) {
          c.isCompleted = false;
          c.selected = false;
          c.show = false;
        }
        if (c.id === secondChoice.id) {
          c.isCompleted = false;
          c.selected = false;
          c.show = false;
        }

        return { ...c };
      });

      // start a counter that when it finishes hides both cards
      timeOutId = setTimeout(() => {
        setDeck(deckCards);
        setSelectedCards([]);
        setCanSelect(true);
        clearTimeout(timeOutId);
      }, 1000);
    }
  }, [selectedCards]);

  // Initial setup

  useEffect(() => {
    setLevel(difficulties[difficulty]);
  }, [difficulty]);

  return (
    <div className="App">
      <Header height={60}>
        <Group align="center" position="apart">
          <Text component="h1" align="center" size="xl">
            Memory
          </Text>
          <Button onClick={handlerPauseGame}>Pause</Button>
        </Group>
      </Header>
      <Center mt="lg">
        <span>Time elapsed: {formatTime(time)}</span>
      </Center>
      <Center>
        <Modal
          opened={showModal}
          onClose={handlerStartGame}
          withCloseButton={false}
          closeOnClickOutside={false}
        >
          <Center>
            <div>
              <h2>Memorize</h2>
            </div>
          </Center>

          {!isPaused ? (
            <Center>
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={setDifficulty as React.Dispatch<React.SetStateAction<string | null>>}
                data={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ]}
              />
            </Center>
          ) : (
            <Center>
              <p>Current Time: {formatTime(time)}</p>
            </Center>
          )}

          <Center my="lg">
            <Group>
              {isPaused && (
                <Button color="red" onClick={handlerRestartGame}>
                  Restart
                </Button>
              )}
              <Button onClick={handlerStartGame}>{isPaused ? "Resume" : "Play"}</Button>
            </Group>
          </Center>
        </Modal>
        <Game deck={deck} isSelectable={canSelect} onSelectCard={handlerSelectCard} />
      </Center>
    </div>
  );
}

export default App;
