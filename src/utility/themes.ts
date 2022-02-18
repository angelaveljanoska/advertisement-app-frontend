import {
  Button,
  createTheme,
  styled,
  ThemeOptions,
  Typography,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    type?: string;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#b50b35",
      light: "#c73e60",
      dark: "#830728",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ab7ce",
      light: "#3eccde",
      dark: "#0a8d9e",
      contrastText: "rgba(0,0,0,0.87)",
    },
    error: {
      main: "#ff1000",
      light: "#ff4236",
      dark: "#af0c00",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      contrastText: "rgba(0,0,0,0.87)",
    },
    success: {
      main: "#4cb150",
      contrastText: "rgba(0,0,0,0.87)",
    },
  },
};
const customTheme = createTheme(themeOptions);

export const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  margin: "5px",
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
  },
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));

export default customTheme;
