import React from 'react';
import { Link } from 'react-router-dom';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  ...theme.spread,
  bottomBar: {
    top: 'auto',
    bottom: 0,
  },
}));

const Bottombar = () => {
  const classes = styles();
  return (
    <AppBar position='fixed' color='primary' className={classes.bottomBar}>
      <Toolbar>
        <Link to='/'>
          BEATMON
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Bottombar;
