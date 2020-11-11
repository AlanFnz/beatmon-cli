import { Component } from "react";

// Don't forget to connect the component
class SnippetBase extends Component {

  playSnippet = () => {
    this.props.setPlayingSnippet(this.props.snippet.snippetId);
    // Check user authentication
    if(this.props.user.authenticated){
      // If already played this snippet, the do nothing
      if(this.props.user.plays && this.props.user.plays.find(play => play.snippetId === this.props.snippet.snippetId))
        { return } else {
        // If not, then call action
        this.props.playSnippetLogged(this.props.snippet.snippetId);
      }
    } else {
      // If not logged, check fingerprint-snippet relation. If already played, return.
      if(localStorage.getItem('fingerprint') && localStorage.getItem(this.props.snippet.snippetId) === 'yes') { return } else {
        // If not, save fingerprint and snippet id on local storage
        localStorage.setItem('fingerprint', this.props.user.fingerprint);
        localStorage.setItem(this.props.snippet.snippetId, 'yes');
        // Then call action
        this.props.playSnippetNotLogged(this.props.snippet.snippetId);
      }
    }
  };
};

export default SnippetBase;
