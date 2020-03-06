import React, { PureComponent }from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { FixedSizeList } from 'react-window';
import ProjectCard from '../ProjectCard';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
  searchbar: {
    width: '100%'
  },
  scroll: {
    maxHeight: '60vh',
    overflow: 'auto'
  },
}));



export default function ProjectListPast(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
    <Grid item >
        {/* <FixedSizeList height={400} width={345} itemSize={props.meetings.length} itemCount={props.meetings.length} itemData={props.meetings}>
        {ItemRenderer}
      </FixedSizeList> */}
      <div className={classes.root}>
      <List dense={true}>
        {props.projects.map((value,index) => {
          return <ProjectCard 
            key={index}
            keyIndex={index}
            cardValue={value}
            // meetings={this.props.data}
            // infoOnly={true}
          />
        })}
      </List>
      
    </div>
          </Grid>
        </Grid>
  );
}