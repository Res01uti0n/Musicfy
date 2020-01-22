import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MusicIcon from "@material-ui/icons/MusicNote";
import PersonIcon from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Signout from "../Auth/Signout";

const Header = ({ classes, currentUser }) => {
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Link to="/" className={classes.grow}>
          <MusicIcon className={classes.logo} color="secondary"/>
          <Typography variant="h4" color="secondary" noWrap>
            Favorite tracks
          </Typography>
        </Link>
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className={classes.grow}>
            <PersonIcon className={classes.personIcon}/>
            <Typography variant="h4" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}
        <Signout />
      </Toolbar>
    </AppBar>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  logo: {
    marginRight: theme.spacing(1),
    fontSize: 45
  },
  personIcon: {
    marginRight: theme.spacing(1),
    fontSize: 30,
    color: "white"
  },
  username: {
    color: "white",
    fontSize: 30
  }
});

export default withStyles(styles)(Header);
