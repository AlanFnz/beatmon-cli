import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "../axios";
// Material UI
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Container from '@material-ui/core/Container';
// Components
import Snippet from "../components/snippet/Snippet";
import Profile from "../components/profile/Profile";
import StaticProfile from "../components/profile/StaticProfile";
// Skeletons
import SnippetSkeleton from "../util/SnippetSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";
// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

class user extends Component {
  state = {
    profile: null,
    snippetIdParam: null,
    userHandle: null,
  };

  componentDidMount() {
    const userHandle = this.props.match.params.handle;
    const snippetId = this.props.match.params.snippetId;

    if (snippetId) this.setState({ snippetIdParam: snippetId });
    if (userHandle) this.setState({ userHandle: userHandle });

    // Get user detail
    this.props.getUserData(userHandle);
    // Get user snippets
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        this.setState({
          profile: res.data.userData.user,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { loading, snippets } = this.props.data;
    const { snippetIdParam } = this.state;
    const {
      credentials: { handle },
      authenticated,
    } = this.props.user;
    const isLoggedUser = handle === this.state.userHandle ? true : false;

    const snippetsMarkup = loading ? (
      <SnippetSkeleton />
    ) : snippets === null ? (
      <p>No snippets from this user</p>
    ) : !snippetIdParam ? (
      snippets.map((snippet) => (
        <Snippet key={snippet.snippetId} snippet={snippet} />
      ))
    ) : (
      snippets.map((snippet) => {
        if (snippet.snippetId !== snippetIdParam)
          return <p>That snippet doesn't exist!</p>;
        else
          return (
            <Snippet key={snippet.snippetId} snippet={snippet} openDialog />
          );
      })
    );

    return (
      <Container maxWidth='md'>
        <Grid container spacing={1}>
          <Hidden smUp>
            <Grid item sm={4} xs={12}>
              {this.state.profile === null ? (
                <ProfileSkeleton />
              ) : authenticated && isLoggedUser ? (
                <Profile />
              ) : (
                <StaticProfile profile={this.state.profile} />
              )}
            </Grid>
          </Hidden>
          <Grid item sm={8} xs={12}>
            {snippetsMarkup}
          </Grid>
          <Hidden only='xs'>
            <Grid item sm={4} xs={12}>
              {this.state.profile === null ? (
                <ProfileSkeleton />
              ) : authenticated && isLoggedUser ? (
                <Profile />
              ) : (
                <StaticProfile profile={this.state.profile} />
              )}
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

export default connect(mapStateToProps, { getUserData })(user);
