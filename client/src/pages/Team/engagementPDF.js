import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

// Create Document Component
function MyDocument(props) {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const tempTasksArr = [];
        for (let key in props.tasks) {
            tempTasksArr.push(props.tasks[key])
        }
        setTasks(tempTasksArr);
    }, [props.tasks]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>{props.name}</Text>
                </View>
                <View style={styles.section}>
                    {tasks.map(el => {
                        return <Text>{el}</Text>
                    })}
                </View>
            </Page>
        </Document>
    )
};

export default MyDocument;