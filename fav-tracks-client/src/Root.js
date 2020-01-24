import React from "react";
import withRoot from "./withRoot";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import App from "./pages/App";
import Profile from "./pages/Profile";
import Header from "./components/Shared/Header";
import Loading from "./components/Shared/Loading";
import Error from "./components/Shared/Error";

export const UserContext = React.createContext();

const Root = () =>(
  <Query query={ME} fetchPolicy="cache-and-network">
    {({data, loading, error})=> {
      if (loading) return <Loading />
      if (error) return <Error error={error}/>
      const currentUser = data.me;

      return (
        <UserContext.Provider value={currentUser}>
          <Router>
            <Header currentUser={currentUser}/>
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/profile/:id" component={Profile} />
            </Switch>
          </Router>
        </UserContext.Provider>
      )
    }}
  </Query>
);

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
`

export default withRoot(Root);
