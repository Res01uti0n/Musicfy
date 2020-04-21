import React, { useState } from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Snackbar } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  snackbar: {
    margin: theme.spacing(1),
  },
}));

interface Props {
  children?: any;
  error: any;
}

const Error = ({ error }: Props) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  return (
    <Snackbar
      className={classes.snackbar}
      message={error.message}
      open={open}
      action={
        <Button color="secondary" size="small" onClick={() => setOpen(false)}>
          Close
        </Button>
      }
    />
  );
};

export default Error;
