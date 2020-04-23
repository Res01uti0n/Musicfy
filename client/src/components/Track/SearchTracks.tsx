import React, { useState, useRef } from "react";
import { ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Paper, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "2px 4px",
    margin: theme.spacing(1),
    display: "flex",
    alignItems: "center"
  },
}));

const SearchTracks = ({ setSearchResult }: any) => {
  const [search, setSearch] = useState("");
  const inputEl: any = useRef();
  const classes = useStyles();

  const clearSearchInput = () => {
    setSearchResult([]);
    setSearch("");
    inputEl.current.focus();
  };

  const handelSubmit = async (event: any, client: any) => {
    event.preventDefault();
    const res = await client.query({
      query: SEARCH_TRACKS,
      variables: { search },
    });
    setSearchResult(res.data.tracks);
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <form onSubmit={(event) => handelSubmit(event, client)}>
          <Paper className={classes.root} elevation={1}>
            <IconButton onClick={clearSearchInput}>
              <ClearIcon />
            </IconButton>

            <TextField
              placeholder="Search all tracks"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(event) => setSearch(event.target.value)}
              value={search}
              inputRef={inputEl}
              fullWidth
            />

            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </form>
      )}
    </ApolloConsumer>
  );
};

const SEARCH_TRACKS = gql`
  query($search: String) {
    tracks(search: $search) {
      id
      title
      description
      url
      likes {
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`;

export default SearchTracks;
