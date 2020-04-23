import React from "react";
import { Link } from "react-router-dom";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { 
  AppBar,
  Toolbar,
  Typography 
} from "@material-ui/core";
import MusicIcon from "@material-ui/icons/MusicNote";
import PersonIcon from "@material-ui/icons/Person";

import Signout from "../Auth/Signout";
import SearchTracks from "../Track/SearchTracks";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "#212121",
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
    color: "#fff",
    [theme.breakpoints.down("md")]: {
      fontSize: 20,
    },
  },
  title: {
    color: "#fff",
    fontSize: 25,
    [theme.breakpoints.down("md")]: {
      fontSize: 20,
    },
  },
  personIcon: {
    marginRight: theme.spacing(1),
    fontSize: 30,
    color: "white",
    [theme.breakpoints.down("md")]: {
      fontSize: 20,
    },
  },
  username: {
    color: "white",
    fontSize: 24,
    [theme.breakpoints.down("md")]: {
      fontSize: 12,
    },
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

interface Props {
  children?: any;
  currentUser: any;
}

const Header = ({ currentUser }: Props) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Link to="/" className={classes.grow}>
          <MusicIcon className={classes.logo} />
          <Typography
            className={classes.title}
            variant="h5"
            noWrap
          >
            Musicfy
          </Typography>
        </Link>

        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            <PersonIcon className={classes.personIcon} />
            <Typography variant="h6" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}

        <Signout />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
