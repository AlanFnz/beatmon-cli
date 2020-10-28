import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
// Material UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Redux
import { connect } from 'react-redux';
import { submitComment, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spread,

});

class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    };

    static getDerivedStateFromProps(nextProps){
        if(nextProps.UI.errors) {
            return ({ errors: nextProps.UI.errors})
        } else {
            return null;
        }
    };

    componentDidUpdate(prevProps){
        if(prevProps.comments !== this.props.comments){
          this.setState({ open: false, body: '' })
        }
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
            errors: {}
        });
        this.props.clearErrors();
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.submitComment(this.props.snippetId, { body: this.state.body });
    }

    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={10} style={{ textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Write your comment"
                        error={errors.comment ? true : false}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField}
                        />
                        <Button type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        >Submit</Button>
                </form>
                <hr className={classes.visibleSeparator}/>
            </Grid>
        ) : null
        return commentFormMarkup
    }
};

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    snippetId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated,
    comments: state.data.snippet.comments
});

export default connect(mapStateToProps, { submitComment, clearErrors })(withStyles(styles)(CommentForm));
