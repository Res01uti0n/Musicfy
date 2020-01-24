import React, { useContext } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { UserContext, ME} from "../../Root";

const LikeTrack = ({ classes, trackId, likeCount }) => {
  const currentUser = useContext(UserContext)

  const handleDisableTrack = () => {
    const userLikes = currentUser.likeSet
    const isTrackLiked = userLikes.findIndex(({track})=> track.id === trackId) > -1
    return isTrackLiked
  }

  return (
    <Mutation
      mutation={CREATE_LIKE_MUTATION}
      variables={{trackId}}
      onCompleted={
        data=> console.log({data})
      }
      refetchQueries={()=>[{query: ME}]}
    >
      {createLike=>(
        <IconButton 
          onClick={event=> {
            event.stopPropagation()
            createLike()
          }
          }
          className={classes.iconButton}
          disabled={handleDisableTrack()}
        >
          {likeCount}
          <ThumbUpIcon className={classes.icon} />
        </IconButton>
      )}
    </Mutation>
  );
};

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
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing.unit / 2
  }
});

export default withStyles(styles)(LikeTrack);
