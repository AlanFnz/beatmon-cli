import React, { Component } from "react";
import { connect } from 'react-redux';
import { setCurrentTime } from '../../redux/actions/audioActions';
// import PropTypes from "prop-types";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

class WavesUpload extends Component {

  state = {
    playing: false,
    pos: 0,
  };

  onTimeChange = e => {
    this.props.setCurrentTime(e.target.currentTime);
  };

  render() {
    const { audio } = this.props;
    // const { updateCurrentTime } = this.props
    return (
      <div>
        <AudioPlayer
          style={{ width: "200px" }}
          src={audio}
          showJumpControls={false}
          customAdditionalControls={[]}
          customProgressBarSection={[
            RHAP_UI.CURRENT_TIME,
            RHAP_UI.PROGRESS_BAR,
          ]}
          customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME]}
          customVolumeControls={[]}
          preload='none'
          onListen={this.onTimeChange}
        />
      </div>
    );
  }
}

// WavesUpload.propTypes = {
//   audio: PropTypes.string.isRequired
// };

const mapStateToProps = state => ({
  currentTime: state.audio.currentTime
});

const mapActionsToProps = { setCurrentTime };

export default connect(mapStateToProps, mapActionsToProps)(WavesUpload);
