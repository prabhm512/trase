import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    column: {
        flexBasis: '33.33%',
    },
}));

export default function EngAccordion(props) {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <div className={classes.column}>
                        <Typography className={classes.heading}>{props.name}</Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>Task No</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {props.tasks.map((task, idx) => {
                            return <li key={idx}>{task}</li>
                        })}
                    </ul>
                </AccordionDetails>
            </Accordion>
        </div>
        );
    }
    
    // props.name.split('_')[1]