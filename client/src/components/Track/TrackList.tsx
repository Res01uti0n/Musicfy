import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import AudioPlayer from "../Shared/AudioPlayer";
import LikeTrack from "../Track/LikeTrack";
import UpdateTrack from "../Track/UpdateTrack";
import DeleteTrack from "../Track/DeleteTrack";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  details: {
    alignItems: "center",
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "#03a9f4",
    },
  },
}));

const TrackList = ({ tracks }: any) => {
  const classes = useStyles();

  return (
    <List>
      {tracks.map((track:any) => (
        <ExpansionPanel key={track.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <ListItem className={classes.root}>
              <LikeTrack trackId={track.id} likeCount={track.likes.length} />

              <ListItemText
                primaryTypographyProps={{
                  variant: "h6",
                  color: "primary",
                }}
                primary={track.title}
                secondary={
                  <Link
                    className={classes.link}
                    to={`/profile/${track.postedBy.id}`}
                  >
                    {track.postedBy.username}
                  </Link>
                }
              ></ListItemText>

              <AudioPlayer url={track.url} />
            </ListItem>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails className={classes.details}>
            <Typography variant="body1">{track.description}</Typography>
          </ExpansionPanelDetails>

          <ExpansionPanelActions>
            <UpdateTrack track={track} />
            <DeleteTrack track={track} />
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </List>
  );
};

export default TrackList;
