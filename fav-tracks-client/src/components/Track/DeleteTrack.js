import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";
import { UserContext } from "../../Root";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { GET_TRACKS } from "../../pages/App";

const DeleteTrack = ({track}) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === track.postedBy.id
  
  const handleUpdateCashe = (cashe, {data:{deleteTrack}}) => {
    const data = cashe.readQuery({query:GET_TRACKS})
    const index = data.tracks.findIndex(
      track => Number(track.id) === deleteTrack.trackId
    )
    const tracks = [...data.tracks.slice(0, index), ...data.tracks.slice(index + 1)]
    cashe.writeQuery({query:GET_TRACKS, data: {tracks}})

  }

  return isCurrentUser && (
    <Mutation 
      mutation={DELETE_TRACK_MUTATION}
      variables={{trackId: track.id}}
      onCompleted={data=>{
          console.log(data)
        }
      }
      update={handleUpdateCashe}
    >
      { deleteTrack => (
        <IconButton onClick={deleteTrack}>
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

export default DeleteTrack;
