import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../axios';
// Material UI
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
// Components
import Snippet from '../components/snippet/Snippet';
import Profile from '../components/profile/Profile';
import StaticProfile from '../components/profile/StaticProfile';
import ScrollTop from '../components/layout/ScrollTop';
// Skeletons
import SnippetSkeleton from '../util/SnippetSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';
// Redux
import { connect } from 'react-redux';
import {
  getUserData,
  getMoreUserSnippetsNav,
  clearSnippets,
  clearErrors,
} from '../redux/actions/dataActions';

const styles = (theme) => ({
  progressSpinner: {
    marginTop: '10px auto 0px auto',
  },
  progressContainer: {
    margin: '0 auto',
  },
});

class user extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      profile: null,
      snippetIdParam: null,
      userHandle: null,
      firstLoad: true,
      noSnippets: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleClickTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor'
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  handleScroll() {
    if (this.state.noSnippets === true) return
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (!this.props.data.lastVisible) {
      if (!this.props.data.loading && windowBottom >= docHeight) {
        this.props.getMoreUserSnippetsNav(null, this.props.match.params.handle);
      }
    } else {
      if (
        !this.props.data.loading &&
        windowBottom >= docHeight &&
        this.props.data.lastVisible._fieldsProto.createdAt.stringValue !==
          this.props.data.lastUserSnippet._fieldsProto.createdAt.stringValue
      ) {
        this.setState({ firstLoad: false });
        this.props.getMoreUserSnippetsNav(
          this.props.data.lastVisible,
          this.props.match.params.handle
        );
      }
    }
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    await this.props.clearSnippets();
    const userHandle = this.props.match.params.handle;
    const snippetId = this.props.match.params.snippetId;

    if (snippetId) this.setState({ snippetIdParam: snippetId });
    if (userHandle) this.setState({ userHandle: userHandle });

    // Get user details and snippets
    await this.props.getUserData(userHandle);
    if (this.props.data.snippets.length === 0) {
      this.setState({ noSnippets: true });
    }
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        this.setState({
          profile: res.data.userData.user,
        });
      })
      .catch((err) => console.log(err));
  }

  async componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    await this.props.clearErrors();
  }

  render() {
    const { snippets } = this.props.data;
    const { loading } = this.props.data;
    const { snippetIdParam } = this.state;
    const {
      credentials: { handle },
      authenticated,
    } = this.props.user;
    const { classes } = this.props;
    const isLoggedUser = handle === this.state.userHandle ? true : false;

    let circularProgress = !loading ? null : (
      <CircularProgress size={30} className={classes.progressSpinner} />
    );

    let snippetsMap = !snippets ? (
      <p>No snippets from this user</p>
    ) : !snippetIdParam ? (
      snippets.map((snippet) => (
        <Snippet key={snippet.snippetId} snippet={snippet} />
      ))
    ) : (
      snippets.map((snippet) => {
        if (snippet.snippetId !== snippetIdParam)
          return <Snippet key={snippet.snippetId} snippet={snippet} />;
        else
          return (
            <Snippet key={snippet.snippetId} snippet={snippet} openDialog />
          );
      })
    );

    let snippetsMarkup;
    if (this.state.firstLoad) {
      snippetsMarkup = loading ? <SnippetSkeleton /> : snippetsMap;
    } else {
      snippetsMarkup = snippetsMap;
    }

    return (
      <Container maxWidth="md">
        <div id="back-to-top-anchor"></div>
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
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              {circularProgress}
              <ScrollTop window={window} handleClickTop={this.handleClickTop}>
                <Fab
                  color="secondary"
                  size="small"
                  aria-label="scroll back to top"
                >
                  <KeyboardArrowUpIcon />
                </Fab>
              </ScrollTop>
            </Grid>
          </Grid>
          <Hidden only="xs">
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

export default connect(mapStateToProps, {
  getUserData,
  getMoreUserSnippetsNav,
  clearSnippets,
  clearErrors,
})(withStyles(styles)(user));
