export const formatTime = (seconds: number): string => {
  let date = new Date(0);
  date.setSeconds(seconds);
  let mins = date.getMinutes();
  let secs = date.getSeconds();

  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
};
