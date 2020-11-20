import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import DeleteComment from './DeleteComment';
// Material UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  ...theme.spread,
  commentImage: {
    maxWidth: '100%',
    height: 60,
    objectFit: 'cover',
    borderRadius: '50%',
    marginLeft: 15,
    [theme.breakpoints.down('sm')]: {
      marginRight: 5,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
    },
  },
  commentData: {
    // [theme.breakpoints.up('lg')]: {
    //   marginLeft: 50,
    // },
    [theme.breakpoints.down('md')]: {
      marginLeft: 30,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 25,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
    },
  },
});

class Comments extends Component {
  state = {
    comments: this.props.snippet.comments,
  };
  render() {
    const { classes, comments } = this.props;
    const {
      authenticated,
      credentials: { handle },
    } = this.props.user;

    function searchHandle(userHandle, array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].userHandle === userHandle) {
          return true;
        }
      }
    }

    // const deleteButton =
    //   authenticated && searchHandle(handle, comments) ? (
    //     <DeleteComment />
    //   ) : null;

    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, userImage, userHandle } = comment;
          const snippetOwnerHandle = this.props.snippet.userHandle;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={10}>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt='comment'
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        to={`/users/${userHandle}`}
                        variant='h5'
                        component={Link}
                        color='primary'
                      >
                        {userHandle}
                      </Typography>
                      {authenticated && comment.commentId && searchHandle(handle, comments) ? (
                        <DeleteComment commentId={comment.commentId} />
                      ) : authenticated && snippetOwnerHandle === handle ? ( <DeleteComment commentId={comment.commentId} /> ) : null }
                      <Typography variant='body2' color='textSecondary'>
                        {dayjs(createdAt).format('h:mm a, DD MMMM YYYY')}
                      </Typography>
                      <hr className={classes.invisibleSeparator} />
                      <Typography variant='body1'>{body}</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visibleSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  snippet: state.data.snippet,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));
