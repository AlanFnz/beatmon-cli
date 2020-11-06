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
    const { audio, onPlay } = this.props;
    return (
      <div>
        <AudioPlayer
          autoPlayAfterSrcChange={false}
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
          onPlay={onPlay}
        />
      </div>
    );
  }
}

Waves.propTypes = {
  audio: PropTypes.string.isRequired
};

export default Waves;
