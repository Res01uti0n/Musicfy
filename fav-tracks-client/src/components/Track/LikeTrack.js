import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { UserContext, ME } from "../../Root";

const LikeTrack = ({ classes, trackId, likeCount }) => {

  const currentUser = useContext(UserContext)

  const handleDisableTrack = () => {
    const userLikes = currentUser.likeSet
    const isTrackLiked = userLikes.findIndex(({ track })=> track.id === trackId) > -1
    return isTrackLiked
  }

  return (
    <Mutation
      mutation={ CREATE_LIKE_MUTATION }
      variables={{trackId}}
      refetchQueries={() => [{ query: ME }]}
    >
      { createLike => (
        <IconButton 
          onClick={ event => {
            event.stopPropagation()
            createLike()
          }}
          className={classes.iconButton}
          disabled={handleDisableTrack()}
        >
          {likeCount}
          <ThumbUpIcon className={classes.icon} />
        </IconButton>
      )}
    </Mutation>
  )
}

const CREATE_LIKE_MUTATION = gql`
  mutation($trackId: Int!) {
    createLike(trackId: $trackId) {
      track {
        id
        likes {
          id
        }
      }
    }
  }
`

const styles = theme => ({
  icon: {
    marginLeft: theme.spacing(1)
  },
  iconButton: {
    color: "green"
  }
});

export default withStyles(styles)(LikeTrack)
