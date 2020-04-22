import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
  Button,
  CircularProgress,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import Error from "../Shared/Error";
import { GET_TRACKS } from "../../pages/App";

const useStyles = makeStyles((theme: Theme) => ({
  /*container: {
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
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: "white",
    zIndex: "200",
  },*/
}));

const CreateTrack = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<any>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileError, setFileError] = useState("");
  const classes = useStyles()

  const handleUpdateCashe = (cashe: any, { data: { createTrack } }: any) => {
    const data = cashe.readQuery({ query: GET_TRACKS });
    const tracks = data.tracks.concat(createTrack.track);
    cashe.writeQuery({ query: GET_TRACKS, data: { tracks } });
  };

  const [createTrack, { error }] = useMutation(CREATE_TRACK_MUTATION, {
    onCompleted: (data) => {
      setSubmitting(false);
      setOpen(false);
      setTitle("");
      setDescription("");
      setFile("");
    },
    update: handleUpdateCashe,
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

  const handleSubmit = async (event: any, createTrack: any) => {
    event.preventDefault();
    setSubmitting(true);
    const uploadedUrl = await handleAudioUpload();
    createTrack({
      variables: {
        title,
        description,
        url: uploadedUrl,
      },
    });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <Fab
        color="secondary"
        onClick={() => setOpen(true)}
      >
        {open ? <ClearIcon /> : <AddIcon />}
      </Fab>

      <Dialog open={open}>
        <form onSubmit={(event) => handleSubmit(event, createTrack)}>
          <DialogTitle>Create Track</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Please, add a title, description and Audio File(File size must be
              under 10mb)
            </DialogContentText>

            <FormControl fullWidth>
              <TextField
                label="Title"
                placeholder="Add title"
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
                value={description}
              />
            </FormControl>

            <FormControl error={Boolean(fileError)}>
              <input
                id="audio"
                type="file"
                accept="audio/mp3, audio/wav"
                onChange={(event) => handleAudioChange(event)}
                required
              />

              <label htmlFor="audio">
                <Button
                  variant="outlined"
                  color={file ? "secondary" : "inherit"}
                  component="span"
                >
                  Audio File
                  <LibraryMusicIcon />
                </Button>

                {file && file.name}

                <FormHelperText>{fileError}</FormHelperText>
              </label>
            </FormControl>

            <DialogActions>
              <Button
                disabled={submitting}
                onClick={() => setOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  submitting || !title.trim() || !description.trim() || !file
                }
                variant="outlined"
              >
                {submitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Add Track"
                )}
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
      );
    </>
  );
};

const CREATE_TRACK_MUTATION = gql`
  mutation($title: String!, $description: String!, $url: String!) {
    createTrack(title: $title, description: $description, url: $url) {
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

export default CreateTrack;
