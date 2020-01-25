import React from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MusicIcon from "@material-ui/icons/MusicNote";
import PersonIcon from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";

import Signout from "../Auth/Signout";

const Header = ({ classes, currentUser }) => {
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>

        <Link to="/" className={classes.grow}>
          <MusicIcon className={classes.logo} color="secondary"/>
          <Typography className={classes.title} variant="h5" color="secondary" noWrap>
            Favorite Tracks
          </Typography>
        </Link>

        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            <PersonIcon className={classes.personIcon}/>
            <Typography variant="h6" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}

        <Signout />
      </Toolbar>
    </AppBar>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "#212121"
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logo: {
    marginRight: theme.spacing(1),
    fontSize: 45,
    [theme.breakpoints.down("md")]: {
      fontSize: 20
    },
  },
  title: {
    fontSize: 25,
    [theme.breakpoints.down("md")]: {
      fontSize: 20
    }
  },
  personIcon: {
    marginRight: theme.spacing(1),
    fontSize: 30,
    color: "white",
    [theme.breakpoints.down("md")]: {
      fontSize: 20
    }
  },
  username: {
    color: "white",
    fontSize: 24,
    [theme.breakpoints.down("md")]: {
      fontSize: 12
    },
    "&:hover": {
      textDecoration: "underline",
    }
  }
})

export default withStyles(styles)(Header)
