import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import CustomButton from '../../util/CustomButton';
import BeatmonLogo from '../../images/beatmon-logo.png';
// Skeleton
import ProfileSkeleton from '../../util/ProfileSkeleton';
// Material UI
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({
  ...theme.spread,
  bio: { 
    overflowWrap: 'break-word',
  },
  logo: {
    maxWidth: '200px',
    display: 'block',
    transform: 'translateY(-15%)',
    margin: '10px auto 0px auto'
  },
  description: {
    margin: '0px auto 5px auto',
    display: 'block',
  },
});

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  truncateString = (string, number) => {
    return (string.length > number) ? `${string.substring(0, number-1)}...` : string;
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        authenticated,
        loading,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className='image-wrapper'>
              <img src={imageUrl} className='profile-image' alt='profile' />
              <input
                type='file'
                id='imageInput'
                hidden='hidden'
                accept='image/x-png,image/jpeg'
                onChange={this.handleImageChange}
              />
              <CustomButton tip='Edit profile picture' onClick={this.handleEditPicture} btnClassName='button'>
                <EditIcon color='primary' />
              </CustomButton>
            </div>
            <hr />
            <div className='profile-details'>
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color='primary'
                variant='h6'
              >
                @{this.truncateString(handle, 20)}
              </MuiLink>
              <hr />
              {bio && <Typography variant='body2' className={classes.bio}>{bio}</Typography>}
              <hr />
              {location && (
                <Fragment>
                  <LocationOn color='primary' /> <span>{this.truncateString(location, 29)}</span>
                </Fragment>
              )}
              <hr />
              {website && (
                <Fragment>
                  <LinkIcon color='primary' />
                  <a href={website} target='_blank' rel='noopener noreferrer'>
                    {' '}
                    {this.truncateString(website, 26)}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday color='primary' />{' '}
              <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
            </div>
            <CustomButton tip='Logout' onClick={this.handleLogout}>
                <KeyboardReturn color='primary' />
              </CustomButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
            <img src={BeatmonLogo} alt="Beatmon" className={classes.logo} />
          <Typography variant='subtitle2' align='center' className={classes.description}>
            Beatmon is a social networking service designed for music producers. A place where you can share short snippets of your stuff, give and receive feedback from other producers. Feel free to join us and start improving!.
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              to='/login'
            >
              Login
            </Button>
            <Button
              variant='contained'
              color='secondary'
              component={Link}
              to='/signup'
            >
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
