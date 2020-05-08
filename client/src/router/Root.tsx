import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import App from "../components/Shared/App";
import Profile from "../components/Profile/Profile";
import Header from "../components/Shared/Header";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import withRoot from "../utils/withRoot";

interface AuthMe {
  me: {
    id: number;
    username: string;
    email: string;
    likeSet: {
      track: {
        id: number;
      };
    };
  };
}

interface Me {
  id: number;
  username: string;
  email: string;
  likeSet: {
    track: {
      id: number;
    };
  };
}

export const UserContext = React.createContext<Me | null>(null);

const Root = () => {
  const { data, loading, error } = useQuery<AuthMe>(ME);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const currentUser: Me = data.me;

  return (
    <UserContext.Provider value={currentUser}>
      <Router>
        <Header currentUser={currentUser} />

        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/profile/:id" component={Profile} />
        </Switch>
      </Router>
    </UserContext.Provider>
  );
};

export const ME = gql`
  {
    me {
      id
      username
      email
      likeSet {
        track {
          id
        }
      }
    }
  }
`;

export default withRoot(Root);
