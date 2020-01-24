import React, { useState, useContext } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios"
import Error from "../Shared/Error";
import { UserContext } from "../../Root";

const UpdateTrack = ({ classes, track }) => {
  const currentUser = useContext(UserContext)
  const isCurrentUser = currentUser.id === track.postedBy.id
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleAudioChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileSizeLimit = 10000000;
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setFileError(`${selectedFile.name}: File size too large`);
    } else {
      setFile(selectedFile);
      setFileError('');
    }
  }

  const handleAudioUpload = async () => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('resource_type', 'raw');
      data.append('upload_preset', 'Favorite-tracks');
      data.append('cloud_name', 'dkgjpqfz3')
      const res = await axios.post('https://api.cloudinary.com/v1_1/dkgjpqfz3/raw/upload', data);
      return res.data.url
    } catch (error) {
      console.log("Error uploading file", error);
      setSubmitting(false);
    }
  }

  const handleSubmit = async (event, updateTrack) => {
    event.preventDefault();
    setSubmitting(true);
    const uploadedUrl = await handleAudioUpload();
    updateTrack({variables: {trackId: track.id, title, description, url: uploadedUrl }});
  }

  return (
    isCurrentUser && (
    <>
      <IconButton onClick={()=> setOpen(true)}>
        <EditIcon />
      </IconButton>

      <Mutation 
        mutation = {UPDATE_TRACK_MUTATION} 
        onCompleted={
          (data)=>{ 
            console.log({data});
            setSubmitting(false); 
            setOpen(false);
            setTitle("");
            setDescription("");
            setFile("")
          }
        }
        
        >

        {(updateTrack, {loading, error})=>{
        
        if (error) {return <Error error={error} />}
        
        return (
          <Dialog open={open} className={classes.dialog}>
          <form onSubmit={(event) => handleSubmit(event, updateTrack)}>
            <DialogTitle>Update Track</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please, add a title, description and Audio File(File size must be under 10mb)
              </DialogContentText>
              <FormControl fullWidth>
                <TextField 
                  label="Title"
                  placeholder="Add title"
                  className={classes.textField}
                  onChange={(event)=> setTitle(event.target.value)}
                  value={title}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField 
                  multiline
                  rows="3"
                  label="Description"
                  placeholder="Add description"
                  onChange={(event)=> setDescription(event.target.value)}
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
                  onChange={(event)=> handleAudioChange(event)}
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
                  <FormHelperText>
                    {fileError}
                  </FormHelperText>
                </label>
              </FormControl>
              <DialogActions>
                <Button disabled={submitting} onClick={()=> setOpen(false)} className={classes.cancel}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className={classes.save}
                  disabled = {
                    submitting ||
                    !title.trim() ||
                    !description.trim() ||
                    !file 
                  }
                >
                  {
                    submitting ? <CircularProgress className={classes.save} size={24} /> : "Update Track"
                  }
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        </Dialog>
        )}}
      </Mutation>
    </>)
  );
};

const UPDATE_TRACK_MUTATION = gql`
  mutation ($trackId: Int!, $title: String, $description: String, $url: String){
    updateTrack(trackId: $trackId, title: $title, description: $description, url: $url) {
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
`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing(1)
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing(2)
  },
  icon: {
    marginLeft: theme.spacing(1)
  },
  input: {
    display: "none"
  }
});

export default withStyles(styles)(UpdateTrack);
