import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CustomButton from '../../util/CustomButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
// Material UI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSnippet, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spread,
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    closeButton: {
        position: 'absolute',
        left: '86%',
        top: '1rem'
    },
    profileImage: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: '20px'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: '40px',
        marginBottom: '40px'
    },
    snippetBody: {
        marginLeft: 5
    },
    expandButton: {
        position: 'absolute',
        right: '6px'
    }
});

class SnippetDialog extends Component{
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    };

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen();
        };
    };

    handleOpen = () => {
        let oldPath = window.location.pathname;

        const { userHandle, snippetId } = this.props;
        const newPath = `/users/${userHandle}/snippet/${snippetId}`;

        if (oldPath === newPath) oldPath = `/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.setState({ open: true });
        this.props.getSnippet(this.props.snippetId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.props.clearErrors();
        this.setState({ open: false });
    };

    render(){
        const { 
            classes, 
            snippet: { 
                snippetId, 
                body, 
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle,
                comments
            }, 
            UI: { loading }
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={75} thickness={2}/>
            </div>
        ) : (
            <Grid container >
                <Grid item sm={4}>
                    <img src={userImage} alt="Profile" className={classes.profileImage}/>
                </Grid>
                <Grid item sm={8}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/users/${userHandle}`}
                        >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, DD MM YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton snippetId={snippetId} />
                    <span>{likeCount} Likes</span>
                    <CustomButton tip="Comments">
                        <ChatIcon color="primary" />
                    </CustomButton>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={classes.visibleSeparator} />
                <CommentForm snippetId={snippetId} />
                <Comments comments={comments} />
            </Grid>
        )

        return ( 
            <Fragment>
                <CustomButton onClick={this.handleOpen} tip="Expand Snippet" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </CustomButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <CustomButton
                        tip="Close"
                        onClick={this.handleClose}
                        tipClassName={classes.closeButton}
                    >
                        <CloseIcon />
                    </CustomButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

};

SnippetDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getSnippet: PropTypes.func.isRequired,
    snippetId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    snippet: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    snippet: state.data.snippet,
    UI: state.UI
});

const mapActionsToProps = {
    getSnippet,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SnippetDialog));