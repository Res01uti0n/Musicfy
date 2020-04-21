import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  FormControl,
  Paper,
  InputLabel,
  Input,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import MenuBookIcon from "@material-ui/icons/MenuBookRounded";
import VerifiedUser from "@material-ui/icons/VerifiedUserOutlined";

import Error from "../Shared/Error";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.dark,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    color: "white",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green",
  },
  button: {
    marignTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

const Transition = (props: any) => <Slide direction="down" {...props} />;

interface Props {
  children?: any;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register = ({ setNewUser }: Props) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [createUser, { error, loading }] = useMutation(REGISTER_MUTATION, {
    variables: { username, password, email },
    onCompleted: (data) => setOpen(true),
  });

  const handleSubmit = (event: any, createUser: any) => {
    event.preventDefault();
    createUser();
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MenuBookIcon />
        </Avatar>

        <Typography variant="h4" className={classes.title}>
          Register
        </Typography>

        <form
          onSubmit={(event) => handleSubmit(event, createUser)}
          className={classes.form}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="usename">Username</InputLabel>
            <Input
              id="user"
              onChange={(event) => setUserName(event.target.value)}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              type="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>

          <Button
            className={classes.submit}
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={
              loading || !username.trim() || !email.trim() || !password.trim()
            }
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => setNewUser(false)}
            fullWidth
          >
            Log in
          </Button>

          {error && <Error error={error} />}
        </form>
      </Paper>

      <Dialog
        open={open}
        disableBackdropClick={true}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <VerifiedUser className={classes.icon} />
          Created New Account
        </DialogTitle>

        <DialogContent>
          <DialogContentText>User successfully created!</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setNewUser(false)}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
      }
    }
  }
`;

export default Register;
