import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from '../../../util/CustomButton';
import FirstInstanceDialog from './FirstInstanceDialog';
import SecondInstanceDialog from './SecondInstanceDialog';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import FilePicker from '../FilePicker';
// Material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux
import { connect } from 'react-redux';
import { postSnippet, setError, clearErrors } from '../../../redux/actions/dataActions';
// Audio
import WavesUpload from '../WavesUpload';
import { isAudio, readBlobURL } from '../../../audioUtils/utils';
import WebAudio from '../../../audioUtils/webaudio';
import { sliceAudioBuffer } from '../../../audioUtils/audio-helper';
import encoder from '../../../audioUtils/encoder';

const styles = (theme) => ({
  submitButton: {
    marginTop: '1rem',
    marginBottom: '1rem',
    position: 'relative',
    float: 'right',
  },
  progressSpinner: {
    position: 'absolute',
    marginTop: '90px',
  },
  closeButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
  },
  cropButton: {
    marginTop: '5px',
    marginBottom: '20px',
  },
  selectButton: {
    marginTop: '35px'
  },
  textField: {
    marginBottom: '15px',
  }
});

class PostSnippet extends Component {
  init = {
    open: false,
    body: '',
    genre: '',
    errors: {},
    audioBuffer: null,
    isFileLoaded: false,
    isFileProcessed: false,
    audioFile: '',
    audioFileName: '',
    audioBlob: null,
    isLoading: false,
    isProcessing: false,
    currentTime: 0,
    isOnSecondInstance: false, // Testing, change to false!
    width: window.innerWidth,
  };

  state = this.init;

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) {
      return { errors: nextProps.UI.errors };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.snippets !== this.props.snippets) {
      this.setState(this.init);
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.clearErrors();
    this.setState(this.init);
  };

  handleFileChange = async (file) => {
    if (!isAudio(file)) {
      return alert('Select audio file');
    }

    const audioFile = URL.createObjectURL(file);
    this.setState({
      isLoading: true,
      audioFile,
      audioBuffer: null,
    });

    const audioBuffer = await WebAudio.decode(file);
    window.audioBuffer = audioBuffer;

    this.setState({
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      isLoading: false,
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

  handleSubmit = async (event) => {
    event.preventDefault();

    // Setting file name
    const randomId = uuidv4();
    const fileName = `${
      this.props.user.credentials.userId
    }-${Date.now()}-${randomId}`;
    this.setState({ audioFileName: fileName });

    // Uploading file
    await firebase.storage().ref(`audio/${fileName}.mp3`).put(this.state.audioBlob);

    // Getting and setting URL to player input
    await firebase
      .storage()
      .ref('audio')
      .child(`${fileName}.mp3`)
      .getDownloadURL()
      .then((url) => this.setState({ audioFile: url }))

    this.props.postSnippet({
      body: this.state.body,
      audio: this.state.audioFile,
      audioFileName: this.state.audioFileName,
      genre: this.state.genre,
    });
  };

  handleNext = () => {
    if(!this.state.body) {
      this.props.setError({ error: 'Please, write a short message' });
      return
    }
    this.setState({ isOnSecondInstance: true });
  };

  handleGenreSelection = (event) => {
    this.setState({ genre: event.target.value })
  };

  cutAudioFile = async (event) => {
    const { audioBuffer } = this.state;
    const { currentTime } = this.props;
    const { length, duration } = audioBuffer;
    const startTime = Math.round(currentTime);
    const endTime = startTime + 15;

    // Set processing state
    this.setState({
      isProcessing: true,
    });

    // Slice audio
    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      ~~((length * startTime) / duration),
      ~~((length * endTime) / duration)
    );

    // Encode audio
    const audioFinal = await encoder(audioSliced);

    const blobUrl = readBlobURL(audioFinal);
    this.setState({ 
      audioFile: blobUrl,
      audioBlob: audioFinal,
    });

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

    // Declaring markups
    let wavesUploadMarkup,
      cropButtonMarkup,
      fileUploaderMarkup,
      submitButtonMarkup,
      nextButtonMarkup,
      textFieldMarkup,
      firstInstanceMarkup,
      secondInstanceMarkup;

    /////// Player conditions and markup
    if (
      this.state.isOnSecondInstance === false &&
      this.state.isFileLoaded === true
    ) {
      wavesUploadMarkup =
      this.state.isProcessing ? (
        <CircularProgress size={30} className={classes.progressSpinner} />
      ) : (
        <WavesUpload audio={this.state.audioFile} />
      )
    } else { wavesUploadMarkup = null };

    /////// Crop button conditions and markup
    if (
      this.state.isFileLoaded &&
      this.state.isFileProcessed === false &&
      this.state.isProcessing === false
    ) {
      cropButtonMarkup =
        <Fragment>
          <p>
            Snippets have a duration of 15 seconds. Choose your starting point
          </p>
          <Button
            size='small'
            color='secondary'
            variant='contained'
            component='span'
            className={classes.cropButton}
            onClick={this.cutAudioFile}
          >
            Crop audio
          </Button>
        </Fragment>
    } else { cropButtonMarkup = null };

    /////// Upload button conditions and markup
    if (
      this.state.isOnSecondInstance === false &&
      this.state.isFileLoaded === false
    ) {
      fileUploaderMarkup =  this.state.isLoading ? <CircularProgress size={30} className={classes.progressSpinner} /> : (
            <FilePicker id='upload-audio' onChange={this.handleFileChange}>
              <Button
                size='small'
                color='secondary'
                variant='contained'
                component='span'
                className={classes.selectButton}
              >
                Select audio
              </Button>
            </FilePicker>
          ) 
    } else { fileUploaderMarkup = null };

    /////// Submit button conditions and markup
    if ( 
      this.state.isOnSecondInstance &&
      this.state.isFileProcessed 
    ) {
      submitButtonMarkup =
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={classes.submitButton}
          disabled={loading}
          onClick={this.handleSubmit}
        >
          {loading && (
            <CircularProgress size={30} className={classes.progressSpinner} />
          )}
          Submit
        </Button>
    } else { submitButtonMarkup = null };

    /////// Next button conditions and markup
    if ( 
      this.state.isOnSecondInstance === false &&
      this.state.isFileProcessed
      ) {
      nextButtonMarkup = 
       <Button
          size='small'
          color='secondary'
          variant='contained'
          component='span'
          className={classes.submitButton}
          onClick={this.handleNext}
        >
          Next
        </Button>
    }

    /////// Text field conditions and markup
    if (this.state.isOnSecondInstance === false) {
      textFieldMarkup =
      <TextField
      name='body'
      type='text'
      label='Ask for feedback'
      multiline
      rows='2'
      placeholder='In a few words'
      error={errors.error ? true : false}
      helperText={errors.error}
      className={classes.textField}
      onChange={this.handleChange}
      fullWidth
      inputProps={{ maxLength: 50 }}
    />
    } else { textFieldMarkup = null }

    /////// First instance dialog conditions and markup
    if (!this.state.isOnSecondInstance) {
      firstInstanceMarkup =
        <FirstInstanceDialog
          textField={textFieldMarkup}
          uploadButton={fileUploaderMarkup}
          waves={wavesUploadMarkup}
          cropButton={cropButtonMarkup}
          submitButton={submitButtonMarkup}
          nextButton={nextButtonMarkup}
        />
    } else { firstInstanceMarkup = null }

    /////// Second instance dialog conditions and markups
    if (this.state.isOnSecondInstance) {
      secondInstanceMarkup =
      <SecondInstanceDialog 
        submitButton={submitButtonMarkup}
        // handleSubmit={this.handleSubmit}
        handleGenreSelection={this.handleGenreSelection}
        errors={errors}
      />
    } else { secondInstanceMarkup = null }

    return (
      <Fragment>
        <CustomButton onClick={this.handleOpen} tip='Post a Beat!'>
          <AddIcon />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          PaperProps={{style: {
            minHeight: '270px',
            maxWidth: '350px',
            overflowX: 'hidden',
          }}}
        >
          <CustomButton
            tip='Close'
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </CustomButton>
          <DialogTitle>Post a new Beat</DialogTitle>
          {firstInstanceMarkup}
          {secondInstanceMarkup}
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
  setError
})(withStyles(styles)(PostSnippet));
