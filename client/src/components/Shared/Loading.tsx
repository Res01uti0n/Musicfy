import React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100vw",
    textAlign: "center",
  },
  progress: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.dark,
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

export default Loading;
