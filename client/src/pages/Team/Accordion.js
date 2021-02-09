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
                    <Typography className={classes.heading}>{props.name.split('_')[1]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>
        </div>
        );
    }
    