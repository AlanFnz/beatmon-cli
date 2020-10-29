import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CustomButton from '../../util/CustomButton';
import firebase from "firebase";
// import FileUploader from "react-firebase-file-uploader";
// import { v4 as uuidv4 } from 'uuid';
import FilePicker from './FilePicker';
// Material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux
import { connect } from 'react-redux';
import { postSnippet, clearErrors } from '../../redux/actions/dataActions';
import { setPlayingSnippet, setCurrentTime } from '../../redux/actions/audioActions';
// Audio
import WavesUpload from './WavesUpload';
import { isAudio, readBlobURL, download, rename } from '../../audioUtils/utils';
import WebAudio from '../../audioUtils/webaudio';
// import { encode } from '../../audioUtils/worker-client';
import { sliceAudioBuffer } from '../../audioUtils/audio-helper';
// import audioBufferToWav from '../../audioUtils/abuffer-to-wav';
// import wavToMp3 from '../../audioUtils/wav-to-mp3';
// import abufferToMp3 from '../../audioUtils/abuffer-to-mp3';

const styles = theme => ({
    submitButton: {
        marginTop: '1rem',
        marginBottom: '1rem',
        position: 'relative',
        float: 'right'
    },
    progressSpinner: {
        position: 'absolute',
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    }
});

class PostSnippet extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
    file: null,
    decoding: false,
    audioBuffer: null,
    isFileLoaded: false,
    audioFileURLOriginal: '',
    audioFileURLCutted: '',
    isUploading: false,
    currentTime: 0,
    processing: false,
  };

  static getDerivedStateFromProps(nextProps){
    if(nextProps.UI.errors) {
        return ({ errors: nextProps.UI.errors})
    } else {
        return null;
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.snippets !== this.props.snippets){
      this.setState({ open: false, errors: {}, body: '', isFileLoaded: false, audioFileURLOriginal: '', isUploading: false });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {}, body: '', isFileLoaded: false, audioFileURLOriginal: '', isUploading: false });
  };

  //TODO:
  handleFileChange = async file => {
    if (!isAudio(file)) {
      return alert('Select audio file')
    }

    console.log(file);
    const audioFileURLOriginal = URL.createObjectURL(file);
    this.setState({
      file,
      audioFileURLOriginal,
      // decoding: true,
      audioBuffer: null,
    })

    const audioBuffer = await WebAudio.decode(file)
    window.audioBuffer = audioBuffer;

    // const blobUrl = await encode(audioBuffer, 'mp3');
    // console.log(blobUrl);

    // const url = readBlobURL(blobUrl);
    // console.log(url);

    this.setState({
      // audioFileURLOriginal: url,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: audioBuffer.duration / 2,
      isFileLoaded: true,
    })
  }

  get startByte () {
    return parseInt(this.audioBuffer.length * this.state.start / this.widthDurationRatio / this.duration, 10)
  }

  get endByte () {
    return parseInt(this.audioBuffer.length * this.state.end / this.widthDurationRatio / this.duration, 10)
  }

  handleChange = (event) => {
    this.setState({ 
      [event.target.name]: event.target.value,
      errors: {}
    });
    this.props.clearErrors();
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.postSnippet({ body: this.state.body });
  }

  handleUploadStart = () => {
    this.setState({  isUploading: true })
  }

  handleUploadError = error => {
    this.setState({ isUploading: false, isFileLoaded: false });
    console.log(error);
  };

  handleUploadSuccess = async filename => {
    this.setState({ isUploading: false, isFileLoaded: true });
    await firebase
      .storage()
      .ref("audio")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ audioFileURLOriginal: url }));
  };

  //TODO:
  cutAudioFile = async (e) => {
    const { audioBuffer } = this.state;
    const { currentTime } = this.props;
    const { length, duration } = audioBuffer;
    const startTime = Math.round(currentTime);
    const endTime = startTime + 15;

    console.log(currentTime);

    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      ~~(length * startTime / duration),
      ~~(length * endTime / duration),
    )

    this.setState({
      processing: true,
    })

    // const blob = await abufferToMp3(audioSliced);

    // const audioUrl = await readBlobURL(blob);

    // await download(audioUrl);

    // console.log(blob);

    // const wavAudio = await audioBufferToWav(audioSliced);
    // console.log(wavAudio);

    // const mp3Audio = await wavToMp3(1, 256, wavAudio);
    // console.log(mp3Audio);

    // encode(audioSliced, 'mp3')
    //   .then(readBlobURL)
    //   .then(url => {
    //     download(url, rename(this.state.file.name, 'mp3'))
    //   })
    //   .catch((e) => console.error(e))
    //   .then(() => {
    //     this.setState({
    //       processing: false,
    //     })
    //   })
  }

  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading },
    } = this.props;
    // console.log(this.props.currentTime);

    let wavesUploadMarkup = this.state.isFileLoaded ? (
      <Fragment>
        <WavesUpload audio={this.state.audioFileURLOriginal}  />
        <p>Snippets have a duration of 15 seconds. Choose your starting point</p>
        <Button size="small" color="secondary" variant="contained" component="span" onClick={this.cutAudioFile}>Crop audio</Button>
      </Fragment>
    ) : ( null );

    let fileUploaderMarkup = this.state.isFileLoaded ? null : (
      // <FileUploader
      //   hidden
      //   id="upload-audio"
      //   accept=".mp3"
      //   name="audio"
      //   randomizeFilename
      //   storageRef={firebase.storage().ref("audio")}
      //   onUploadStart={this.handleUploadStart}
      //   onUploadError={this.handleUploadError}
      //   onUploadSuccess={this.handleUploadSuccess}
      //   onProgress={this.handleProgress}
      // />
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
        <CircularProgress
          size={30}
          className={classes.progressSpinner}
        />
      )}
      Submit
    </Button>
    ) : (null);

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
              <Grid container spacing={1} >
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="body"
                    type="text"
                    label="Ask for feedback"
                    multiline
                    rows="2"
                    placeholder="In a few words"
                    error={errors.body ? true : false}
                    helperText={errors.body}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label htmlFor="upload-audio"> 
                    <Grid container direction="column" alignItems="center" justify="center">
                    {fileUploaderMarkup}
                    {/* {uploadButtonMarkup} */}
                    {wavesUploadMarkup}
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
};

PostSnippet.propTypes = {
    postSnippet: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    UI: state.UI,
    snippets: state.data.snippets,
    currentTime: state.audio.currentTime
});

export default connect(mapStateToProps, { postSnippet, clearErrors, setPlayingSnippet, setCurrentTime })(withStyles(styles)(PostSnippet));
