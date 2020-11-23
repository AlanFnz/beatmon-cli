import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
// Material UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Link';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spread,
  emoji: {
    margin: '0px auto 15px auto',
    display: 'block',
  },
  errorPaper: {
    padding: '20px',
  },
  message: {
    display: 'block',
    margin: 'auto',
  },
});

class error extends Component {
  state = { message: '' };

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ message: this.props.location.state.message });
    } else {
      this.setState({ message: 'Something went wrong! :(' });
    }
  }

  render() {
    const message = this.state.message;
    const { classes } = this.props;
    return (
      <Grid container>
        <Container maxWidth="xs">
          <Paper className={classes.errorPaper}>
            <Grid item xs={12}>
              <Typography variant="h1" align="center" className={classes.emoji}>
                <span role="img" aria-label="sad">
                  😔
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                align="center"
                className={classes.message}
              >
                {message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
            <hr className={classes.visibleSeparator} />
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/"
                >
                  Home
                </Button>
              </div>
            </Grid>
          </Paper>
        </Container>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(error));
