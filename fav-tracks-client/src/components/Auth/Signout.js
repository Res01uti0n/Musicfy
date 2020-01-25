import React from "react";
import { ApolloConsumer } from "react-apollo";

import withStyles from "@material-ui/core/styles/withStyles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const Signout = ({ classes }) => {

  const handleSignout = (client) => {
    localStorage.removeItem("authToken")
    client.writeData( { data: { isLoggedIn: false} })
  }

  return (
    <ApolloConsumer>
      {client => (
        <Button variant="outlined" color="secondary" onClick={() => handleSignout(client)}>
          <Typography variant="body1" className={classes.buttonText} color="secondary">
            Signout
          </Typography>
          <ExitToApp className={classes.buttonIcon} color="secondary"/>
        </Button>
      )}
    </ApolloConsumer>
  )
}

const styles = theme => ({
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px",
    [theme.breakpoints.down("md")]: {
      fontSize: "10px"
    }
  },
  buttonText: {
    [theme.breakpoints.down("md")]: {
      fontSize: "10px"
    }
  }
})

export default withStyles(styles)(Signout)
