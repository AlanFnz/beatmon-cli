import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CustomButton from '../../util/CustomButton';
import PostSnippet from '../snippet/post/PostSnippet';
import Notifications from './Notifications';
import withStyles from '@material-ui/core/styles/withStyles';
// Redux
import { connect } from 'react-redux';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const styles = (theme) => ({
  ...theme.spread,
  navbarStyles: {
    WebkitBoxPack: 'justify',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    minHeight: '64px',
  },
  buttonLogin: {
    [theme.breakpoints.up('xs')]: {
      minWidth: '40vw',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '250px',
    },
    border: '1px solid #ffad1f',
    maxWidth: '250px',
    color: '#ffad1f',
    margin: '0 5px 0 5px',
    borderRadius: '8px',
  },
  buttonSignup: {
    [theme.breakpoints.up('xs')]: {
      minWidth: '40vw',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '250px',
    },
    maxWidth: '250px',
    backgroundColor: '#ffad1f',
    margin: '0 5px 0 5px',
    borderRadius: '8px',
  },
  loginSignUpMessage: {
    fontSize: '1.2rem',
  },
  hereLink: {
    color: '#ffad1f',
  },
});

class Navbar extends Component {
  render() {
    const {
      authenticated,
      classes,
      location,
      user: {
        credentials: { handle },
      },
    } = this.props;
    return (
      <AppBar elevation={1}>
        <Toolbar className={`nav-container ${classes.navbarStyles}`}>
          {location.pathname === '/login' ? (
            <div className={classes.loginSignUpMessage}>
              Don't have an account? sign up{' '}
              <Link className={classes.hereLink} to='/signup'>
                here
              </Link>
            </div>
          ) : location.pathname === '/signup' ? (
            <div className={classes.loginSignUpMessage}>
              Already have an account? login{' '}
              <Link className={classes.hereLink} to='/login'>
                here
              </Link>
            </div>
          ) : authenticated ? (
            <Fragment>
              <PostSnippet />
              <Link to={`/users/${handle}`}>
                <CustomButton tip='Profile'>
                  <AccountCircleIcon />
                </CustomButton>
              </Link>
              <Link to='/'>
                <CustomButton tip='Home'>
                  <HomeIcon />
                </CustomButton>
              </Link>
              <Notifications />
            </Fragment>
          ) : (
            <Fragment>
              <Button
                className={classes.buttonLogin}
                color='inherit'
                component={Link}
                to='/login'
              >
                Login
              </Button>
              <Button
                className={classes.buttonSignup}
                color='inherit'
                component={Link}
                to='/signup'
              >
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Navbar)));
