import React, { useEffect, useState } from "react";

import { Grid } from "@mantine/core";

import { v4 as uuid } from "uuid";
import CardComponent from "../../components/CardComponent";
const cardTypes = [
  {
    name: "castle",
    src: "castle.png",
  },
  {
    name: "campfire",
    src: "campfire.png",
  },
  {
    name: "cactus",
    src: "cactus.png",
  },
  {
    name: "bush",
    src: "bush.png",
  },
  {
    name: "bridge",
    src: "bridge.png",
  },
  {
    name: "banner",
    src: "banner.png",
  },
];

interface Card {
  id: string;
  name: string;
  src: string;
  selected: boolean;
  isCompleted: boolean;
}

const Game = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [deck, setDeck] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handlerSelectCard = (id: string, name: string) => {
    const cardIndex = deck.findIndex((c) => c.id === id && c.name === name);
    const selectedCard: string = deck[cardIndex].id;

    let cardsSelected = [...selectedCards];

    if (cardsSelected[1] === id || deck[cardIndex].isCompleted) {
      console.log("same");
      return;
    }

    let deckCards = deck.map((c) => {
      if (c.id === id) c.selected = true;

      return { ...c };
    });

    console.log(selectedCards);
    cardsSelected.push(selectedCard);

    // setDeck(deckCards);
    setSelectedCards(cardsSelected);
  };

  useEffect(() => {
    if (selectedCards.length !== 2) {
      return;
    }

    const firstChoice: Card = deck.filter((c) => (c.id === selectedCards[0] ? c : null))[0];
    const secondChoice: Card = deck.filter((c) => (c.id === selectedCards[1] ? c : null))[0];

    let deckCards: Card[] = [];
    if (firstChoice.name === secondChoice.name && firstChoice.id !== secondChoice.id) {
      deckCards = deck.map((c) => {
        if (c.id === firstChoice.id) c.isCompleted = true;
        if (c.id === secondChoice.id) c.isCompleted = true;

        return { ...c };
      });
    } else {
      deckCards = deck.map((c) => {
        if (c.id === firstChoice.id) {
          c.isCompleted = false;
          c.selected = false;
        }
        if (c.id === secondChoice.id) {
          c.isCompleted = false;
          c.selected = false;
        }

        return { ...c };
      });
    }
    setDeck(deckCards);
    setSelectedCards([]);
  }, [selectedCards]);

  useEffect(() => {
    const cards = [];

    // Get all cards and store them
    const allCards = [];
    for (let i = 0; i < cardTypes.length; i++) {
      const c = cardTypes[i];
      allCards.push({
        id: uuid(),
        ...c,
        selected: false,
        isCompleted: false,
      });
      allCards.push({
        id: uuid(),
        ...c,
        selected: false,
        isCompleted: false,
      });
    }

    const deckSize = allCards.length;

    // remove card from (allCards Array) and add them to the cards array randomly
    for (let i = 0; i < deckSize; i++) {
      cards.push(allCards.splice(Math.floor(Math.random() * allCards.length), 1)[0]);
    }

    setDeck(cards);
  }, []);

  return (
    <Grid mt="md">
      {deck.map((c) => (
        <CardComponent
          key={c.id}
          id={c.id}
          src={c.src}
          name={c.name}
          selected={c.selected}
          isCompleted={c.isCompleted}
          onSelect={handlerSelectCard}
        />
      ))}
    </Grid>
  );
};

export default Game;
