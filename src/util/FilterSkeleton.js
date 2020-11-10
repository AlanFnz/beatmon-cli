import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
// Material UI
import Paper from "@material-ui/core/Paper";

const styles = (theme) => ({
  ...theme.spread,
  fullLine: {
    height: 15,
    backgroundColor: "rgba(252,187,109, 0.6)",
    width: "85%",
    margin: "0 auto 10px auto",
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0, 0.15)",
    width: "50%",
    margin: "5px auto 15px auto",
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="profile-details">
            <div className={classes.halfLine} />
            <hr />
            <div className={classes.fullLine} />
            <hr />
            <div className={classes.fullLine} />
            <hr />
            <div className={classes.fullLine} />
            <hr />
            <div className={classes.fullLine} />
          </div>
        </div>
      </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
