import React, { Component } from "react";
import PropTypes from "prop-types";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

class Waves extends Component {
  state = {
    playing: false,
    pos: 0,
  };

  render() {
    const { audio } = this.props;
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
        />
      </div>
    );
  }
}

Waves.propTypes = {
  audio: PropTypes.string.isRequired
};

export default Waves;
