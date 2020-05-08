import React, { ReactNode } from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { format, parseISO } from "date-fns";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  Avatar,
  Paper,
  Typography,
  Divider,
  Grid,
} from "@material-ui/core";
import { FavoriteTwoTone } from "@material-ui/icons";
import AudiotrackIcon from "@material-ui/icons/AudiotrackTwoTone";

import Loading from "../Shared/Loading";
import Error from "../Shared/Error";
import AudioPlayer from "../Shared/AudioPlayer";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      width: 650,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  avatar: {
    backgroundColor: "#03a9f4",
  },
  card: {
    display: "flex",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  audioIcon: {
    color: "purple",
    fontSize: 30,
    marginRight: theme.spacing(1),
  },
  thumbIcon: {
    color: "green",
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

type TParams = {
  params: {
    id: number;
  };
};

interface Props {
  children?: ReactNode;
  match: TParams;
}

interface Track {
  id: number;
  title: string;
  url: string;
  likes: [number];
  postedBy: {
    id: number;
    username: string;
  };
}

interface LikeSet {
  id: number;
  track: [Track];
}

interface UserRequest {
  user: {
    id: number;
    username: string;
    dateJoined: string;
    likeSet: [LikeSet];
    trackSet: [Track];
  };
}

const Profile = ({ match }: Props) => {
  const id = match.params.id;
  const classes = useStyles();
  const { data, loading, error } = useQuery<UserRequest>(PROFILE_QUERY, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <Grid container>
      <Grid item xs={1}></Grid>

      <Grid item xs={2} justify="center" alignItems="center">
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                {data.user.username[0]}
              </Avatar>
            }
            title={data.user.username}
            subheader={`Joined ${format(
              parseISO(data.user.dateJoined),
              "MMM Do, yyyy"
            )}`}
          />
        </Card>
      </Grid>

      <Grid item xs={9} justify="center" alignItems="center">
        <Paper elevation={1} className={classes.paper}>
          <Typography variant="h4" className={classes.title}>
            <AudiotrackIcon className={classes.audioIcon} />
            Created Tracks
          </Typography>

          {data.user.trackSet.map((track: Track) => (
            <div key={track.id}>
              <Typography>
                {track.title} & {track.likes.length} Likes
              </Typography>

              <AudioPlayer url={track.url} />
              <Divider className={classes.divider} />
            </div>
          ))}
        </Paper>

        <Paper elevation={1} className={classes.paper}>
          <Typography variant="h4" className={classes.title}>
            <FavoriteTwoTone className={classes.thumbIcon} />
            Liked Tracks
          </Typography>

          {data.user.likeSet.map(({ track }: any) => (
            <div key={track.id}>
              <Typography>
                {track.title} & {track.likes.length} Likes &{" "}
                {track.postedBy.username}
              </Typography>

              <AudioPlayer url={track.url} />
              <Divider className={classes.divider} />
            </div>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

const PROFILE_QUERY = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      dateJoined
      likeSet {
        id
        track {
          id
          title
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
      trackSet {
        id
        title
        url
        likes {
          id
        }
      }
    }
  }
`;

export default Profile;
