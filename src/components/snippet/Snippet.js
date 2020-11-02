import React from "react";
import SnippetBase from './SnippetBase';
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import CustomButton from "../../util/CustomButton";
import DeleteSnippet from "./DeleteSnippet";
import SnippetDialog from "./SnippetDialog";
import LikeButton from "./LikeButton";
//Redux
import { connect } from "react-redux";
import { playSnippetLogged, playSnippetNotLogged } from '../../redux/actions/dataActions';
// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
// Icons
import ChatIcon from "@material-ui/icons/Chat";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
// Audio
import Waves from './Waves';

const styles = (theme) => ({
  card: {
    position: "relative",
    display: "flex",
    marginBottom: "20px",
    minWidth: "260px",
  },
  image: {
    [theme.breakpoints.up("xs")]: {
      minWidth: "84px",
      height: "84px",
      borderRadius: "58px",
    },
    [theme.breakpoints.up("md")]: {
      width: "108px",
      height: "108px",
      borderRadius: "110px",
    },
    objectFit: "cover",
    margin: "0px",
    boxSizing: "border-box",
    position: "relative",
    marginLeft: "12px",
    marginTop: "12px",
    float: "left",
    clear: "both",
  },
  content: {
    padding: "12px 6px",
    objectFit: "cover",
  },
  TypoMargin: {
    marginLeft: "6px",
  },
});

class Snippet extends SnippetBase {
  
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      snippet: {
        body,
        audio,
        playCount,
        createdAt,
        userImage,
        userHandle,
        likeCount,
        commentCount,
        snippetId,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteSnippet snippetId={snippetId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h6"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
            className={classes.TypoMargin}
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.TypoMargin}
          >
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1" className={classes.TypoMargin}>
            {body}
          </Typography>
          <Waves audio={audio} onPlay={this.playSnippet}/>
          <LikeButton snippetId={snippetId} />
          <span>{likeCount} </span>
          <CustomButton tip="Comments">
            <ChatIcon color="primary" />
          </CustomButton>
          <span>{commentCount} </span>
          <CustomButton tip="Reproductions">
            <PlayCircleFilledIcon color="primary" />
          </CustomButton>
          <span>{playCount} </span>
          <SnippetDialog
            snippetId={snippetId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
        </CardContent>
      </Card>
    );
  }
}

Snippet.propTypes = {
  user: PropTypes.object.isRequired,
  snippet: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { playSnippetLogged, playSnippetNotLogged })(withStyles(styles)(Snippet));
