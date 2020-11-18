import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import CustomButton from '../../util/CustomButton';
// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// Icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';
// Redux
import { connect } from 'react-redux';
import { deleteSnippet } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        right: '6px',
        top: '10px'
    }
};

class DeleteSnippet extends Component {
    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    deleteSnippet = () => {
        this.props.deleteSnippet(this.props.snippetId);
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <CustomButton 
                    tip='Delete snippet'
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color='secondary' />     
                </CustomButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                    >
                        <DialogTitle>
                            Are you sure you want to delete this snippet?
                        </DialogTitle>
                        <DialogContent>
                            This can't be undone
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color='primary'>
                                Cancel
                            </Button>
                            <Button onClick={this.deleteSnippet} color='secondary'>
                                Delete
                            </Button>
                        </DialogActions>
                </Dialog> 
            </Fragment>
        )
    }
};

DeleteSnippet.propTypes = {
    deleteSnippet: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    snippetId: PropTypes.string.isRequired
};

export default connect(null, { deleteSnippet })(withStyles(styles)(DeleteSnippet));
