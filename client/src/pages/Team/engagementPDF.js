import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Times-Roman',
        marginTop: 20,
        marginBottom: 10,
        fontStyle: 'italic'
    },
    section: {
        fontSize: 18,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey'
    },
    date: {
        fontSize: 16,
        fontFamily: 'Times-Roman',
        marginTop: 10,
        textAlign: 'right',
        marginBottom: 7
    },
    heading: {
        fontSize: 16,
        fontWeight: 'ultrabold',
        alignSelf: 'flex-start',
        marginBottom: 10
    }
});

// Create Document Component
function MyDocument(props) {

    const [tasks, setTasks] = useState([]);

    let totalHours=0.00;
    let totalCost=0.00;

    useEffect(() => {
        const tempTasksArr = [];
        for (let key in props.tasks) {
            let cost = 0.00;
            let time = 0.00;

            for (let empsKey in props.tasks[key].employees) {
                cost += parseFloat(props.tasks[key].employees[empsKey].cost);
                time += parseFloat(props.tasks[key].employees[empsKey].overallTime);

            }
            if (cost !== 0.00) {
                tempTasksArr.push({ taskTime: time, taskCost: cost, content: props.tasks[key].content })
            }
        }
        setTasks(tempTasksArr);
    }, [props.tasks]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.date} wrap={false}>{props.weekStart + ' - ' + props.weekEnd}</Text>
                <Text style={styles.title}>{props.name}</Text>
                <View style={styles.section}>
                    <Text style={[styles.heading]}>Task</Text>
                    <Text style={[styles.heading, {paddingLeft: 285}]}>Hours</Text>
                    <Text style={[styles.heading, {paddingLeft: 92}]}>Cost</Text>
                </View>
                {tasks.map((el, idx) => {
                    totalCost += parseFloat(el.taskCost);
                    totalHours += parseFloat(el.taskTime);
                    
                    return <View key={idx} style={{flexDirection: 'row', borderBottom: 1, paddingTop: 8, paddingBottom: 8, fontSize: 14}}>
                        <Text>{idx+1 + "."}</Text>
                        <Text style={{paddingLeft: 10, width: 300}}>{el.content}</Text>
                        <Text style={{paddingLeft: 15, width: 40}}>{el.taskTime}</Text>
                        <Text style={{paddingLeft: 97}}>{'$ ' + el.taskCost}</Text>
                    </View>
                })}
                <View style={{flexDirection: 'row'}}>
                    <View style={{paddingLeft: 324}}>
                        <Text style={{paddingTop: 15, width: 40}}>{totalHours}</Text>
                    </View>
                    <View style={{paddingLeft: 82}}>
                        <Text style={{paddingTop: 15}}>{'$ ' + totalCost}</Text>
                    </View>
                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
};

export default MyDocument;