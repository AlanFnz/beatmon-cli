import React from 'react';
import { Link } from 'react-router-dom';
import BeatmonLogo from '../../images/beatmon-logo.png';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  ...theme.spread,
  bottomBar: {
    top: 'auto',
    bottom: 0,
    height: '45px',
  },
  logo: {
    width: '125px',
    display: 'block',
    transform: 'translateY(-15%)',
  },
}));

const Bottombar = () => {
  const classes = styles();
  return (
    <AppBar position="fixed" color="primary" className={classes.bottomBar}>
      <Toolbar className='nav-container'>
          <Link to="/">
            <img src={BeatmonLogo} alt="Beatmon" className={classes.logo} />
          </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Bottombar;
