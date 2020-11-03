import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NoImg from "../images/no-img.png";
// Material UI
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';


const styles = (theme) => ({
  ...theme.spread,
  handle: {
    height: 20,
    backgroundColor: "rgba(0, 188, 212, 0.4)",
    width: 60,
    margin: "0 auto 7px auto",
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0, 0.15)",
    width: "100%",
    marginBottom: 10,
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0, 0.15)",
    width: "50%",
    margin: "0 auto 5px auto",
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
    // <Container maxWidth='md'>
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={NoImg} alt="profile" className="profile-image" />
          </div>
          <hr />
          <div className="profile-details">
            <div className={classes.handle} />
            <hr />
            <div className={classes.fullLine} />
            <div className={classes.fullLine} />
            <hr />
            <div className={classes.halfLine} />
            <hr />
            <div className={classes.halfLine} />
            <hr />
            <div className={classes.halfLine} />
          </div>
        </div>
      </Paper>
    // </Container>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
