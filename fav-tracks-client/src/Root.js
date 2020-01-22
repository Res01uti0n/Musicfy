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

const Root = () =>(
  <Query query={ME}>
    {({data, loading, error})=> {
      if (loading) return <Loading />
      if (error) return <Error error={error}/>
      const currentUser = data.me;

      return (
        <>
          <Router>
            <Header currentUser={currentUser}/>
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/profile/:id" component={Profile} />
            </Switch>
          </Router>
        </>
      )
    }}
  </Query>
);

const ME = gql`
  {
    me {
      username
    }
  }
`

export default withRoot(Root);
