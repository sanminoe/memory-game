import { Center, Grid, Image } from "@mantine/core";

import classes from "./CardComponent.module.css";

interface PropsCard {
  id: string;
  name: string;
  src: string;
  onSelect: Function;
  show: boolean;
}

const CardComponent = (props: PropsCard) => {
  return (
    <Grid.Col
      sm={2}
      span={4}
      onClick={() => props.onSelect(props.id, props.name)}
      className={classes.card}
    >
      <Center mx="auto" style={{ width: 90, height: 90, position: "relative", cursor: "pointer" }}>
        <img
          src={"/src/assets/cards/" + props.src}
          className={`${classes.front} ${classes.item} ${
            !props.show ? classes.hidden : classes.show
          }`}
          draggable="false"
        />

        <div
          style={{ width: "100%", height: "100%", backgroundColor: "red" }}
          className={`${classes.item} ${props.show ? classes.hidden : classes.show}`}
        ></div>
      </Center>
    </Grid.Col>
  );
};

export default CardComponent;
