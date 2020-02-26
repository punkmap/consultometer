import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import TodayIcon from '@material-ui/icons/Today';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    padding: theme.spacing(2),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },

}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root} key={'card'+props.keyIndex}>
      <Paper>
        <CardHeader
            key={'cardHeader'+props.keyIndex}
            avatar={
            <Avatar>
                <TodayIcon />
            </Avatar>
            }
            action={
            <IconButton aria-label="settings">
                <MoreVertIcon />
            </IconButton>
            }
            title={props.cardValue.project}
            subheader={moment(props.cardValue.dateTime).format("MM-DD-YY HH:mm")}
        />
        
        
        <CardContent key={'cardContent'+props.keyIndex}>
            <ListItem key={'li'+props.keyIndex}>
                <Grid item >
                    <Typography variant="body2">{props.cardValue.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{props.cardValue.purpose}</Typography>
                    {/* {props.timeControls} */}
                </Grid>
                
                <ListItemSecondaryAction>
                    <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => props.editMeeting(props.meetings[props.keyIndex])}
                    >
                        <EditIcon fontSize="small"/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </CardContent>
        <CardActions disableSpacing key={'cardActions'+props.keyIndex}>
            <IconButton onClick={(event) => props.startMeeting(event, props.meetings[props.keyIndex])}>
                <PlayArrowIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => props.pauseMeeting(event, props.meetings[props.keyIndex])}>
                <PauseIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => props.stopMeeting(event, props.meetings[props.keyIndex])}>
                <StopIcon fontSize="small"/>
            </IconButton>
            <IconButton onClick={(event) => props.refreshMeeting(event, props.meetings[props.keyIndex])}>
                <RefreshIcon fontSize="small"/>
            </IconButton>
            <IconButton
            className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            >
            <ExpandMoreIcon />
            </IconButton>
        </CardActions>
        <Collapse key={'collapse'+props.keyIndex} in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
            </Typography>
            <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
            </Typography>
            <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
            </CardContent>
        </Collapse>
      </Paper>
    </Card>
  );
}