import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, useQuery } from "react-apollo";
import ApolloClient, { gql } from "apollo-boost";

import * as serviceWorker from "./serviceWorker";
import Auth from "./components/Auth/";
import Root from "./Root";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
  fetchOptions: {
    credentials: "include",
  },
  request: (operation) => {
    const token = localStorage.getItem("authToken") || "";
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  },
  clientState: {
    defaults: {
      isLoggedIn: !!localStorage.getItem("authToken"),
    },
  },
});

const IS_LOGGED_IN = gql`
  query {
    isLoggedIn @client
  }
`;

const Main = () => {
  const { data } = useQuery(IS_LOGGED_IN);

  return (
    <ApolloProvider client={client}>
      {data.isLoggedIn ? <Root /> : <Auth />}
    </ApolloProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));

serviceWorker.unregister();
