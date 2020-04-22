import React, { useContext } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import { makeStyles } from "@material-ui/core/styles";

import { UserContext } from "../../Root";
import { GET_TRACKS } from "../../pages/App";

const useStyles = makeStyles(() => ({
  deleteButton: {
    color: "red",
  },
}));

const DeleteTrack = ({ track }: any):any => {
  const currentUser: any = useContext(UserContext);
  const isCurrentUser = currentUser.id === track.postedBy.id;
  const classes = useStyles();

  const handleUpdateCashe = (cashe: any, { data: { deleteTrack } }: any) => {
    const data = cashe.readQuery({ query: GET_TRACKS });
    const index = data.tracks.findIndex(
      (track: any) => Number(track.id) === deleteTrack.trackId
    );
    const tracks = [
      ...data.tracks.slice(0, index),
      ...data.tracks.slice(index + 1),
    ];
    cashe.writeQuery({ query: GET_TRACKS, data: { tracks } });
  };

  const [deleteTrack]:any = useMutation(DELETE_TRACK_MUTATION, {
    variables: { trackId: track.id },
    update: handleUpdateCashe,
  });

  return (
    isCurrentUser && (
      <IconButton className={classes.deleteButton} onClick={deleteTrack}>
        <TrashIcon />
      </IconButton>
    )
  );
};

const DELETE_TRACK_MUTATION = gql`
  mutation($trackId: Int!) {
    deleteTrack(trackId: $trackId) {
      trackId
    }
  }
`;

export default DeleteTrack;
