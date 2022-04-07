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
  Container,
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
  const [attemps, setAttemps] = useState(difficulties.easy + 3);
  const [time, setTime] = useState<number>(0);
  const [trials, setTrials] = useState(0);

  const interval = useInterval(() => setTime((t) => t + 1), 1000);

  const [difficulty, setDifficulty] = useState<string>("easy");
  const [level, setLevel] = useState(difficulties[difficulty]);
  const [hasWon, setHasWon] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [canSelect, setCanSelect] = useState<boolean>(true);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  // UI

  // UI States
  const [deck, setDeck] = useState<Card[]>([]);
  const [showModal, setShowModal] = useState(true);

  const [timeoutid, setTimeoutId] = useState(0);

  const handlerStartGame = () => {
    setShowModal(false);
    if (!isPaused) {
      createDeck();
    }
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
    setTrials(0);
    setDifficulty("easy");
    setHasWon(false);
    interval.stop();
  };

  const restartDeck = (callback: Function) => {
    setDeck([]);
  };

  const validateSelections = (firstChoice: Card, secondChoice: Card) => {
    if (firstChoice && secondChoice) {
      setCanSelect(false);

      let timerId: number = timeoutid;
      let deckCard: Card[] = [];
      console.log(firstChoice, secondChoice);
      if (firstChoice.name === secondChoice.name && firstChoice.id !== secondChoice.id) {
        deckCard = deck.map((c) => {
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

        let isCompleted = deck.every((card, index) => {
          if (card.isCompleted) {
            return card;
          }
        });
        console.log(isCompleted);

        if (isCompleted) {
          handlerWinning();
        }

        setDeck(deckCard);
        setSelectedCards([]);
        setCanSelect(true);
      } else {
        // Do not match
        deckCard = deck.map((c) => {
          if (c.isCompleted === false && c.id === firstChoice.id) {
            c.isCompleted = false;
            c.selected = false;
            c.show = false;
          }
          if (c.isCompleted === false && c.id === secondChoice.id) {
            c.isCompleted = false;
            c.selected = false;
            c.show = false;
          }

          return { ...c };
        });
        // start a counter that when it finishes hides both cards
        if (firstChoice.id !== secondChoice.id) {
          setTrials((t) => t + 1);
        }

        timerId = setTimeout(() => {
          setSelectedCards([]);
          console.log("HIDE CARDS");
          setDeck(deckCard);
          setCanSelect(true);
        }, 600);
      }
    }
  };

  const handlerSelectCard = (id: string, name: string) => {
    if (canSelect === false) {
      return;
    }
    const cardIndex = deck.findIndex((c) => c.id === id && c.name === name);
    const selectedCard: Card = deck[cardIndex];

    let cardsSelected = [...selectedCards];

    if (
      (selectedCard.isCompleted === true && cardsSelected.every((v) => v.isCompleted)) ||
      selectedCard.isCompleted
    ) {
      console.log("same");
      return;
    }

    cardsSelected.push(selectedCard);

    if (cardsSelected.length === 2 && cardsSelected[1].isCompleted) {
      console.log("SAME 2");
      return;
    }
    console.log(cardsSelected);
    let deckCards = deck.map((c) => {
      if (c.id === id) {
        c.selected = true;
        c.show = true;
      }

      return { ...c };
    });
    setDeck(deckCards);
    setSelectedCards(cardsSelected);
    validateSelections(cardsSelected[0], cardsSelected[1]);
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

  const handlerWinning = () => {
    setHasWon(true);
    setShowModal(true);
    setIsPaused(false);
    interval.toggle();
  };

  // validate choices
  useEffect(() => {
    if (selectedCards.length !== 2) {
      return;
    } else {
      setCanSelect(false);
    }
  }, [deck]);

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
        <Container>
          <p>Time elapsed: {formatTime(time)}</p>
        </Container>
        <Container>
          <p>Tries: {trials}</p>
        </Container>
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
          {hasWon && (
            <Center>
              <p>You've Won!</p>
            </Center>
          )}

          {!isPaused && !hasWon ? (
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
              <p>
                {hasWon ? "You finished in:" : "Current Time:"} {formatTime(time)}
              </p>
              <p>{"tries: " + trials}</p>
            </Center>
          )}

          <Center my="lg">
            <Group>
              {(isPaused || hasWon) && (
                <Button color="red" onClick={handlerRestartGame}>
                  Restart
                </Button>
              )}
              {!hasWon && (
                <Button onClick={handlerStartGame}>{isPaused ? "Resume" : "Play"}</Button>
              )}
            </Group>
          </Center>
        </Modal>
        <Game deck={deck} isSelectable={canSelect} onSelectCard={handlerSelectCard} />
      </Center>
    </div>
  );
}

export default App;
