import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { styles } from './login-signup.styles';
// Material UI Stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            errors: {}
        };
    };

    static getDerivedStateFromProps(nextProps){
        if(nextProps.UI.errors) {
            return ({ errors: nextProps.UI.errors})
        } else {
            return null;
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        this.props.signupUser(newUserData, this.props.history);
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { classes, UI : {loading} } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img 
                    src={AppIcon} 
                    alt="App Icon" 
                    className={classes.image}
                    />
                    <Typography variant="h2" className={classes.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField}
                            helperText={errors.email}
                            error={errors.email ? true : false} 
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField} 
                            helperText={errors.password}
                            error={errors.password ? true : false} 
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            label="Confirm Password" 
                            className={classes.textField} 
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false} 
                            value={this.state.confirmPassword}
                            onChange={this.handleChange}
                            fullWidth />
                        <TextField 
                            id="handle" 
                            name="handle" 
                            type="handle" 
                            label="Handle" 
                            className={classes.textField} 
                            helperText={errors.handle}
                            error={errors.handle ? true : false} 
                            value={this.state.handle}
                            onChange={this.handleChange}
                            fullWidth />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        {loading ? 
                        <CircularProgress 
                        className={classes.progress}
                        size={30}
                        /> 
                        :
                        <Button 
                        type="submit"
                        className={classes.customButton}
                        >
                        Signup
                        </Button>}
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user,
    UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup));