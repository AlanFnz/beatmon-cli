import React from 'react';
// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';

const styles = (theme) => ({
  ...theme.spread,
  toTop: {
    position: 'fixed',
    bottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      right: '30%',
    },
    [theme.breakpoints.down('sm')]: {
      right: '25%',
    },
    [theme.breakpoints.down('xs')]: {
      right: '10%',
    },
  },
});

function ScrollTop(props) {
  const { children, classes, handleClickTop } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <div onClick={handleClickTop} role="presentation" className={classes.toTop}>
        {children}
      </div>
    </Zoom>
  );
}

export default withStyles(styles)(ScrollTop);
