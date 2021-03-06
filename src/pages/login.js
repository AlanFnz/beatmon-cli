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
import { loginUser } from '../redux/actions/userActions';

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) {
      return { errors: nextProps.UI.errors };
    } else {
      return null;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={`${classes.form} ${classes.margin}`}>
        <Grid item sm />
        <Grid item sm className={classes.formGrid}>
          <img src={AppIcon} alt='App Icon' className={classes.image} />
          <Typography variant='h3' className={classes.pageTitle}>
            Welcome!
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id='email'
              name='email'
              type='email'
              label='Email'
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id='password'
              name='password'
              type='password'
              label='Password'
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            {loading ? (
              <div className={classes.progressContainer}>
                <CircularProgress className={classes.progress} size={30} />
              </div>
            ) : (
              <Button type='submit' className={classes.customButton}>
                Login
              </Button>
            )}
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { loginUser })(
  withStyles(styles)(login)
);
