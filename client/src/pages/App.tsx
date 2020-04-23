import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";

import { makeStyles, Theme } from "@material-ui/core/styles";

import SerchTracks from "../components/Track/SearchTracks";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing(2),
  },
}));

const App = () => {
  const [searchResult, setSearchResult] = useState([]);
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_TRACKS);
  const tracks = searchResult.length > 0 ? searchResult : data && data.tracks;

  return (
    <div className={classes.container}>
      <SerchTracks setSearchResult={setSearchResult} />
      {loading && <Loading />}
      {error && <Error error={error} />}
      {tracks && <TrackList tracks={tracks} />}
      <CreateTrack />
    </div>
  );
};

export const GET_TRACKS = gql`
  query getTracksQuery {
    tracks {
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

export default App;
