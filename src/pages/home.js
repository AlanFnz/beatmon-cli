import React, { Component } from "react";
import PropTypes from "prop-types";
// Material UI
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Container from '@material-ui/core/Container';
// Components
import Snippet from "../components/snippet/Snippet";
import Profile from "../components/profile/Profile";
// Skeleton
import SnippetSkeleton from "../util/SnippetSkeleton";
// Redux
import { connect } from "react-redux";
// Actions
import { getSnippets, getSnippetsNav } from "../redux/actions/dataActions";

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        height: window.innerHeight,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  
  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (!this.props.data.lastVisible) {
      if (!this.props.data.loading && 
        windowBottom >= docHeight) {
          this.props.getSnippetsNav();
      } 
    } else {
      if (!this.props.data.loading && 
        windowBottom >= docHeight &&
        this.props.data.lastVisible._fieldsProto.createdAt.stringValue !== this.props.data.lastSnippet._fieldsProto.createdAt.stringValue) {
          this.props.getSnippetsNav(this.props.data.lastVisible);
      } 
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.props.getSnippetsNav(this.props.data.lastVisible);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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

export default connect(mapStateToProps, { getSnippets, getSnippetsNav })(home);
