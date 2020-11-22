import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
// Skeleton
import FilterSkeleton from '../../util/FilterSkeleton';
// Material UI
import Typography from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  ...theme.spread,
  profilePaper: {
    textAlign: 'center',
  },
  tagBox: {
    padding: '12px 8px',
    [theme.breakpoints.down('xs')]: {
      padding: '2px',
    },
  },
  genre: {
    marginLeft: '8px',
    display: 'inline',
    color: '#ffad1f',
    fontWeight: '700',
    [theme.breakpoints.down('xs')]: {
      fontWeight: '500',
      marginLeft: '4px',
      fontSize: '12px',
    },
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px',
      fontWeight: '400',
    },
  },
  accordion: {
    marginBottom: '8px',
  }
});

const genres = [
  'house',
  'minimalhouse',
  'deephouse',
  'techhouse',
  'techno',
  'progressive',
  'drumnbass',
  'dubstep',
  'downtempo',
  'nudisco',
  'trance',
  'breaks',
  'traphiphop',
  'reggaedub',
  'indiedance',
  'bluesrnb',
];

class Filter extends Component {
  render() {
    const { classes } = this.props;
    const { loading } = this.props.data;
    let tagsMarkup = genres.map((genre) => (
      <Typography
        component={Link}
        to={`/nav/${genre}`}
        variant="body2"
        color="primary"
        className={classes.genre}
        key={genre}
      >
        #{genre}
        <span> </span>
      </Typography>
    ));
    const filterMarkup = !loading ? (
      <Fragment>
        <Hidden xsDown>
          <Paper className={classes.paper}>
            <div className={classes.profilePaper}>
              <Typography variant="h5" align="center" className={classes.title}>
                Filter by genre
              </Typography>
              <div className={classes.tagBox}>{tagsMarkup}</div>
            </div>
          </Paper>
        </Hidden>
        <Hidden smUp>
          <Accordion className={classes.accordion }>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h5" align="center" className={classes.title}>
                Filter by genre
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.tagBox}>{tagsMarkup}</div>
            </AccordionDetails>
          </Accordion>
        </Hidden>
      </Fragment>
    ) : (
      <FilterSkeleton />
    );

    return filterMarkup;
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(withStyles(styles)(Filter));
