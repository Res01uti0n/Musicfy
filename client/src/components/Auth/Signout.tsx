import React from "react";
import { ApolloConsumer } from "react-apollo";
import { ApolloClient } from "apollo-boost"

import { makeStyles, Theme } from "@material-ui/core/styles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import { Typography, Button } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "#fff",
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
    },
  },
  buttonText: {
    color: "#fff",
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
    },
  },
}));

const Signout = () => {
  const classes = useStyles();
  const handleSignout = (client: ApolloClient<object>) => {
    localStorage.removeItem("authToken");
    client.writeData({ data: { isLoggedIn: false } });
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <Button
          variant="outlined"
          onClick={() => handleSignout(client)}
        >
          <Typography
            variant="body1"
            className={classes.buttonText}
            color="secondary"
          >
            Signout
          </Typography>
          <ExitToApp className={classes.buttonIcon} />
        </Button>
      )}
    </ApolloConsumer>
  );
};

export default Signout;
