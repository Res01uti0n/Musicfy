import React, { useState, useContext, ReactElement } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import Error from "../Shared/Error";
import { UserContext } from "../../router/Root";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550,
  },
  textField: {
    margin: theme.spacing(1),
  },
  cancel: {
    color: "red",
    borderColor: "red",
  },
  save: {
    color: "green",
    borderColor: "green",
  },
  button: {
    margin: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  input: {
    display: "none",
  },
}));

interface Props {
  children?: ReactElement;
  track: any;
}

const UpdateTrack = ({ track }: Props):any => {
  const currentUser: any = useContext(UserContext);
  const isCurrentUser = currentUser.id === track.postedBy.id;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState<any>("");
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const [updateTrack, { error }] = useMutation(UPDATE_TRACK_MUTATION, {
    onCompleted: (data) => {
      setSubmitting(false);
      setOpen(false);
      setTitle("");
      setDescription("");
      setFile("");
    },
  });

  const handleAudioChange = (event: any) => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 10000000;

    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleAudioUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("resource_type", "raw");
      data.append("upload_preset", "Favorite-tracks");
      data.append("cloud_name", "dkgjpqfz3");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dkgjpqfz3/raw/upload",
        data
      );
      return res.data.url;
    } catch (error) {
      console.log("Error uploading file", error);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: any, updateTrack: any) => {
    event.preventDefault();
    setSubmitting(true);
    const uploadedUrl = await handleAudioUpload();
    updateTrack({
      variables: {
        trackId: track.id,
        title,
        description,
        url: uploadedUrl,
      },
    });
  };

  return (
    isCurrentUser && (
      <>
        <IconButton color="secondary" onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>

        {error && <Error error={error} />}

        <Dialog open={open} className={classes.dialog}>
          <form onSubmit={(event) => handleSubmit(event, updateTrack)}>
            <DialogTitle>Update Track</DialogTitle>

            <DialogContent>
              <DialogContentText>
                Please, add a title, description and Audio File(File size must
                be under 10mb)
              </DialogContentText>

              <FormControl fullWidth>
                <TextField
                  label="Title"
                  placeholder="Add title"
                  className={classes.textField}
                  onChange={(event) => setTitle(event.target.value)}
                  value={title}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  multiline
                  rows="3"
                  label="Description"
                  placeholder="Add description"
                  onChange={(event) => setDescription(event.target.value)}
                  className={classes.textField}
                  value={description}
                />
              </FormControl>

              <FormControl error={Boolean(fileError)}>
                <input
                  id="audio"
                  type="file"
                  className={classes.input}
                  accept="audio/mp3, audio/wav"
                  onChange={(event) => handleAudioChange(event)}
                  required
                />
                <label htmlFor="audio">
                  <Button
                    variant="outlined"
                    color={file ? "secondary" : "inherit"}
                    component="span"
                    className={classes.button}
                  >
                    Audio File
                    <LibraryMusicIcon className={classes.icon} />
                  </Button>

                  {file && file.name}

                  <FormHelperText>{fileError}</FormHelperText>
                </label>
              </FormControl>

              <DialogActions>
                <Button
                  disabled={submitting}
                  onClick={() => setOpen(false)}
                  className={classes.cancel}
                  variant="outlined"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className={classes.save}
                  disabled={
                    submitting || !title.trim() || !description.trim() || !file
                  }
                  variant="outlined"
                >
                  {submitting ? (
                    <CircularProgress className={classes.save} size={24} />
                  ) : (
                    "Update Track"
                  )}
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        </Dialog>
      </>
    )
  );
};

const UPDATE_TRACK_MUTATION = gql`
  mutation($trackId: Int!, $title: String, $description: String, $url: String) {
    updateTrack(
      trackId: $trackId
      title: $title
      description: $description
      url: $url
    ) {
      track {
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
  }
`;

export default UpdateTrack;
