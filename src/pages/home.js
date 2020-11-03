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
import { getSnippets } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getSnippets();
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

export default connect(mapStateToProps, { getSnippets })(home);
