import React, { useEffect, useState } from "react";
import { useToggle } from "@mantine/hooks";

import { Grid, Modal, Tabs } from "@mantine/core";

import CardComponent from "../../components/CardComponent";
import sources from "../../helpers/sources";

interface Card {
  id: string;
  name: string;
  src: string;
  selected: boolean;
  isCompleted: boolean;
  show: boolean;
}

interface PropsGame {
  deck: Card[];
  isSelectable: boolean;
  onSelectCard: Function;
}

const Game = ({ deck, isSelectable, onSelectCard }: PropsGame) => {
  return (
    <>
      <Grid mt="md" gutter="xs">
        {deck.map((c) => (
          <CardComponent
            key={c.id}
            id={c.id}
            src={c.src}
            name={c.name}
            onSelect={onSelectCard}
            show={c.show}
          />
        ))}
      </Grid>
    </>
  );
};

export default Game;
