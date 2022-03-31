import { Center, Grid, Image } from "@mantine/core";

interface PropsCard {
  id: string;
  name: string;
  selected: boolean;
  src: string;
  onSelect: Function;
  isCompleted: boolean;
}

const CardComponent = (props: PropsCard) => {
  return (
    <Grid.Col span={4} onClick={() => props.onSelect(props.id, props.name)}>
      <Center style={{ width: 60 }} mx="auto">
        {props.selected || props.isCompleted ? (
          <Image src={"/src/assets/cards/" + props.src} />
        ) : (
          <div style={{ width: "100%", height: 60, backgroundColor: "red" }}></div>
        )}
      </Center>
    </Grid.Col>
  );
};

export default CardComponent;
