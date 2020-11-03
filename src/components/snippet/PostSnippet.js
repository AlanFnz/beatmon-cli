import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CustomButton from "../../util/CustomButton";
import firebase from "firebase";
// import FileUploader from "react-firebase-file-uploader";
import { v4 as uuidv4 } from "uuid";
import FilePicker from "./FilePicker";
// Material UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
// Icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
// Redux
import { connect } from "react-redux";
import { postSnippet, clearErrors } from "../../redux/actions/dataActions";
import { encodeAudioFile } from "../../redux/actions/audioActions";
import {
  setPlayingSnippet,
  setCurrentTime,
} from "../../redux/actions/audioActions";
// Audio
import WavesUpload from "./WavesUpload";
import { isAudio } from "../../audioUtils/utils";
import WebAudio from "../../audioUtils/webaudio";
import { sliceAudioBuffer } from "../../audioUtils/audio-helper";
import encoder from "../../audioUtils/encoder";

const styles = (theme) => ({
  submitButton: {
    marginTop: "1rem",
    marginBottom: "1rem",
    position: "relative",
    float: "right",
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
});

class PostSnippet extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
    audioBuffer: null,
    isFileLoaded: false,
    isFileProcessed: false,
    audioFile: "",
    isProcessing: false,
    currentTime: 0,
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) {
      return { errors: nextProps.UI.errors };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.snippets !== this.props.snippets) {
      this.setState({
        open: false,
        errors: {},
        body: "",
        isFileLoaded: false,
        audioFile: "",
        isProcessing: false,
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.clearErrors();
    this.setState({
      open: false,
      errors: {},
      body: "",
      isFileLoaded: false,
      audioFile: "",
      isFileProcessed: false,
    });
  };

  //TODO:
  handleFileChange = async (file) => {
    if (!isAudio(file)) {
      return alert("Select audio file");
    }

    const audioFile = URL.createObjectURL(file);
    this.setState({
      audioFile,
      audioBuffer: null,
    });

    const audioBuffer = await WebAudio.decode(file);
    window.audioBuffer = audioBuffer;

    this.setState({
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      isFileLoaded: true,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: {},
    });
    this.props.clearErrors();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postSnippet({
      body: this.state.body,
      audio: this.state.audioFile,
    });
  };

  //TODO:
  cutAudioFile = async (e) => {
    const { audioBuffer } = this.state;
    const { currentTime } = this.props;
    const { length, duration } = audioBuffer;
    const startTime = Math.round(currentTime);
    const endTime = startTime + 15;

    // Slice audio
    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      ~~((length * startTime) / duration),
      ~~((length * endTime) / duration)
    );

    // Set processing state
    this.setState({
      isProcessing: true,
    });

    // Encode audio
    const audioFinal = await encoder(audioSliced);

    // Setting file name
    const randomId = uuidv4();
    const fileName = `${
      this.props.user.credentials.userId
    }-${Date.now()}-${randomId}`;

    // Uploading file
    await firebase.storage().ref(`audio/${fileName}.mp3`).put(audioFinal);

    // Getting and setting URL to player input
    await firebase
      .storage()
      .ref("audio")
      .child(`${fileName}.mp3`)
      .getDownloadURL()
      .then((url) => this.setState({ audioFile: url }));

    // Set process state
    this.setState({
      isFileProcessed: true,
      isProcessing: false,
    });
  };

  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading },
    } = this.props;
    // console.log(this.props.currentTime);

    let wavesUploadMarkup = this.state.isFileLoaded ? (
      <WavesUpload audio={this.state.audioFile} />
    ) : null;

    let cropButtonMarkup;
    if (
      this.state.isFileLoaded === true &&
      this.state.isFileProcessed === false
    ) {
      cropButtonMarkup = (
        <Fragment>
          <p>
            Snippets have a duration of 15 seconds. Choose your starting point
          </p>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            component="span"
            onClick={this.cutAudioFile}
          >
            Crop audio
          </Button>
        </Fragment>
      );
    } else {
      cropButtonMarkup = null;
    }

    let fileUploaderMarkup = this.state.isFileLoaded ? null : (
      <FilePicker id="upload-audio" onChange={this.handleFileChange}>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          component="span"
        >
          Select audio
        </Button>
      </FilePicker>
    );

    let submitButtonMarkup = this.state.isFileLoaded ? (
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submitButton}
        disabled={loading}
      >
        {loading && (
          <CircularProgress size={30} className={classes.progressSpinner} />
        )}
        Submit
      </Button>
    ) : null;

    return (
      <Fragment>
        <CustomButton onClick={this.handleOpen} tip="Post a Snippet!">
          <AddIcon />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </CustomButton>
          <DialogTitle>Post a new Snippet</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="body"
                    type="text"
                    label="Ask for feedback"
                    multiline
                    rows="2"
                    placeholder="In a few words"
                    error={errors.error ? true : false}
                    helperText={errors.error}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="upload-audio">
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justify="center"
                    >
                      {fileUploaderMarkup}
                      {/* {uploadButtonMarkup} */}
                      {wavesUploadMarkup}
                      {cropButtonMarkup}
                      {/* {loadedFileMarkup} */}
                    </Grid>
                  </label>
                </Grid>
              </Grid>
              {submitButtonMarkup}
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostSnippet.propTypes = {
  postSnippet: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  snippets: state.data.snippets,
  currentTime: state.audio.currentTime,
  user: state.user,
});

export default connect(mapStateToProps, {
  postSnippet,
  clearErrors,
  setPlayingSnippet,
  setCurrentTime,
  encodeAudioFile,
})(withStyles(styles)(PostSnippet));
