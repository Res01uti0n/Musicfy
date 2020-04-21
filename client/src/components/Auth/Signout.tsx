import React from "react";
import { ApolloConsumer } from "react-apollo";

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
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
    },
  },
  buttonText: {
    [theme.breakpoints.down("md")]: {
      fontSize: "10px",
    },
  },
}));

const Signout = () => {
  const classes = useStyles();
  const handleSignout = (client:any) => {
    localStorage.removeItem("authToken");
    client.writeData({ data: { isLoggedIn: false } });
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleSignout(client)}
        >
          <Typography
            variant="body1"
            className={classes.buttonText}
            color="secondary"
          >
            Signout
          </Typography>
          <ExitToApp className={classes.buttonIcon} color="secondary" />
        </Button>
      )}
    </ApolloConsumer>
  );
};

export default Signout;
