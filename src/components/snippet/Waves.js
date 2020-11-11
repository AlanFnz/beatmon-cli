import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
//Redux
import { connect } from 'react-redux';

class Waves extends Component {
  constructor(props){
    super(props);
    this.player = createRef();
  }

  componentDidUpdate(){
    if(this.props.audioRedux.playingSnippet !== this.props.snippetId) { 
      this.player.current.audio.current.pause() 
      this.player.current.audio.current.currentTime = 0; 
    }
  }

  render() {
    const { audio, onPlay } = this.props;
    return (
      <div style={{ margin: '3px 0px 3px 5px'}}>
        <AudioPlayer
          ref={this.player}
          autoPlayAfterSrcChange={false}
          style={{ width: "180px" }}
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

const mapStateToProps = (state) => ({
  audioRedux: state.audio,
});

export default connect(mapStateToProps)(Waves);
