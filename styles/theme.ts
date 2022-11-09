import { createTheme } from '@material-ui/core';

export const palette = {
  primary: { main : "#00df00"},
  divider: "#43484b",
  background: {
    default: "#000",
    paper: "#212121",
  },
  text: {
    primary: "#00df00",
    secondary: "#84e030",
  },
};
export const theme = createTheme({
  palette : palette
});
