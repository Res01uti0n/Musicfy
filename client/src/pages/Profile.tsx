import React from "react";
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
} from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUpTwoTone";
import AudiotrackIcon from "@material-ui/icons/AudiotrackTwoTone";

import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import AudioPlayer from "../components/Shared/AudioPlayer";

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

interface Props {
  children?: any;
  match: any;
}

interface Track {
  id: number;
  title: string;
  url: string;
  likes: any;
  postedBy: any;
}

const Profile = ({ match }: Props) => {
  const id = match.params.id;
  const classes = useStyles();
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: { id },
  });

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>{data.user.username[0]}</Avatar>
          }
          title={data.user.username}
          subheader={`Joined ${format(
            parseISO(data.user.dateJoined),
            "MMM Do, yyyy"
          )}`}
        />
      </Card>

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
          <ThumbUpIcon className={classes.thumbIcon} />
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
    </div>
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
