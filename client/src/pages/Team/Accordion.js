import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

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
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                {props.tasks.map((task, idx) => {
                                    console.log(task[0]);
                                    <div>{task[0]}</div>
                                })}
                            </View>
                            {/* <View style={styles.section}>
                                <Text>Section #2</Text>
                            </View> */}
                        </Page>
                    </Document>
                </AccordionDetails>
            </Accordion>
        </div>
        );
    }
    
    // props.name.split('_')[1]