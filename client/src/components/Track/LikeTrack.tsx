import React, { useContext, ReactNode } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";

import { makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { Favorite } from "@material-ui/icons";

import { UserContext, ME } from "../../router/Root";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    color: "red",
  },
}));

interface Props {
  children?: ReactNode;
  trackId: number
  likeCount: number
}

const LikeTrack = ({ trackId, likeCount }: Props) => {
  const currentUser: any = useContext(UserContext);
  const classes = useStyles();
  const [createLike] = useMutation(CREATE_LIKE_MUTATION, {
    variables: { trackId },
    refetchQueries: () => [{ query: ME }],
  });

  const handleDisableTrack = () => {
    const userLikes = currentUser.likeSet;
    const isTrackLiked =
      userLikes.findIndex(({ track }: any) => track.id === trackId) > -1;
    return isTrackLiked;
  };

  return (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        createLike();
      }}
      className={classes.iconButton}
      disabled={handleDisableTrack()}
    >
      {likeCount}
      <Favorite className={classes.icon} />
    </IconButton>
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
`;

export default LikeTrack;
