import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import Filter from '../components/layout/Filter';
import ScrollTop from '../components/layout/ScrollTop';
// Skeleton
import SnippetSkeleton from '../util/SnippetSkeleton';
// Redux
import { connect } from 'react-redux';
// Actions
import {
  getSnippets,
  getSnippetsNav,
  getSnippetsByGenre,
  clearSnippets,
} from '../redux/actions/dataActions';

const styles = (theme) => ({
  progressSpinner: {
    marginTop: '10px auto 0px auto',
  },
  progressContainer: {
    margin: '0 auto',
  },
});

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      genre: null,
      firstLoad: true,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleClickTop = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  handleScroll() {
    const method = !this.state.genre
      ? this.props.getSnippetsNav
      : this.props.getSnippetsByGenre;
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
        method(null, this.state.genre);
      }
    } else {
      if (
        !this.props.data.loading &&
        windowBottom >= docHeight &&
        this.props.data.lastVisible._fieldsProto.createdAt.stringValue !==
          this.props.data.lastSnippet._fieldsProto.createdAt.stringValue
      ) {
        this.setState({ firstLoad: false });
        method(this.props.data.lastVisible, this.state.genre);
      }
    }
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    await this.props.clearSnippets();
    this.setState({ genre: this.props.match.params.genre });
    if (!this.state.genre) {
      await this.props.getSnippetsNav(this.props.data.lastVisible);
    } else {
      await this.props.getSnippetsByGenre(
        this.props.data.lastVisible,
        this.state.genre
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { snippets, loading } = this.props.data;
    const { classes } = this.props;
    let snippetsMap = snippets.map((snippet) => (
      <Snippet snippet={snippet} key={snippet.snippetId} />
    ));
    let circularProgress = !loading ? null : (
      <CircularProgress size={30} className={classes.progressSpinner} />
    );
    let recentSnippetsMarkup;
    if (this.state.firstLoad) {
      recentSnippetsMarkup = !loading ? snippetsMap : <SnippetSkeleton />;
    } else {
      recentSnippetsMarkup = snippetsMap;
    }

    return (
      <Container maxWidth="md">
        <div id='back-to-top-anchor' ></div>
        <Grid container spacing={1}>
          <Grid item sm={8} xs={12}>
            <Hidden smUp>
              <Filter />
            </Hidden>
            {recentSnippetsMarkup}
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
              </ScrollTop >
            </Grid>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Hidden xsDown>
              <Profile />
              <Filter />
            </Hidden>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

home.propTypes = {
  getSnippets: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, {
  getSnippets,
  getSnippetsNav,
  getSnippetsByGenre,
  clearSnippets,
})(withStyles(styles)(home));
