import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Material UI
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
// Components
import Snippet from '../components/snippet/Snippet';
import Profile from '../components/profile/Profile';
import Filter from '../components/layout/Filter'
// Skeleton
import SnippetSkeleton from '../util/SnippetSkeleton';
// Redux
import { connect } from 'react-redux';
// Actions
import { getSnippets, getSnippetsNav, getSnippetsByGenre, clearSnippets } from '../redux/actions/dataActions';

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        height: window.innerHeight,
        genre: null,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  
  
  handleScroll() {
    const method = !this.state.genre ? this.props.getSnippetsNav : this.props.getSnippetsByGenre
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (!this.props.data.lastVisible) {
      if (!this.props.data.loading && 
        windowBottom >= docHeight) {
          method(null, this.state.genre);
      } 
    } else {
      if (!this.props.data.loading && 
        windowBottom >= docHeight &&
        this.props.data.lastVisible._fieldsProto.createdAt.stringValue !== this.props.data.lastSnippet._fieldsProto.createdAt.stringValue) {
          method(this.props.data.lastVisible, this.state.genre);
      } 
    }
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    await this.props.clearSnippets();
    this.setState({ genre: this.props.match.params.genre })
    if (!this.state.genre) {
      this.props.getSnippetsNav(this.props.data.lastVisible);
    } else {
      this.props.getSnippetsByGenre(this.props.data.lastVisible, this.state.genre);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { snippets, loading } = this.props.data;
    let recentSnippetsMarkup = !loading ? (
      snippets.map((snippet) => (
        <Snippet snippet={snippet} key={snippet.snippetId} />
      ))
    ) : (
      <SnippetSkeleton />
    );
    return (
      <Container maxWidth='md'>
        <Grid container spacing={1}>
          <Grid item sm={8} xs={12}>
            {recentSnippetsMarkup}
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

export default connect(mapStateToProps, { getSnippets, getSnippetsNav, getSnippetsByGenre, clearSnippets })(home);
