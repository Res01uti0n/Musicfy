import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: Grey[500],
      main: Grey[700],
      dark: Grey[900]
    },
    secondary: {
      light: lightBlue[300],
      main: lightBlue[500],
      dark: lightBlue[700]
    }
  },
  typography: {
    useNextVariants: true
  }
});

function withRoot(Component) {
  
  function WithRoot(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
