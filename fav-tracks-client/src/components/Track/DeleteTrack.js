import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import withStyles from "@material-ui/core/styles/withStyles";

import { UserContext } from "../../Root";
import { GET_TRACKS } from "../../pages/App";

const DeleteTrack = ({ track, classes }) => {

  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === track.postedBy.id
  
  const handleUpdateCashe = (cashe, { data: { deleteTrack } }) => {
    const data = cashe.readQuery({ query: GET_TRACKS })
    const index = data.tracks.findIndex(
      track => Number(track.id) === deleteTrack.trackId
    )
    const tracks = [...data.tracks.slice(0, index), ...data.tracks.slice(index + 1)]
    cashe.writeQuery({ query: GET_TRACKS, data: { tracks } })
  }

  return isCurrentUser && (
    <Mutation 
      mutation={ DELETE_TRACK_MUTATION }
      variables={{ trackId: track.id }}
      update={ handleUpdateCashe }
    >
      { deleteTrack => (
        <IconButton className={classes.deleteButton} onClick={ deleteTrack }>
          <TrashIcon />
        </IconButton>
      )}
    </Mutation>
  );
};

const DELETE_TRACK_MUTATION = gql`
  mutation($trackId: Int!) {
    deleteTrack(trackId: $trackId) {
      trackId
    }
  }
`

const styles = {
  deleteButton: {
    color: "red"
  }
}

export default withStyles(styles)(DeleteTrack)
