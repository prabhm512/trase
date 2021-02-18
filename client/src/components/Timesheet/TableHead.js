import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell, Box } from '@material-ui/core';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';

function EnhancedTableHead() {
    
    const [headCells, setHeadCells] = useState([]);

    useEffect(() => {
        // Make sure that only dates from Mon-Fri get rendered every time component is mounted
        const weekStart = startOfWeek(new Date(), {weekStartsOn: 1}).getDate();
        const weekEnd = endOfWeek(new Date(), {weekStartsOn: 1}).getDate();
    
        const tempDatesArr = [{id: 'task', numeric: false, disablePadding: false, label: 'Task'}];
    
        let cntr = 0;
        for (let i=weekStart; i<=weekEnd; i++) {
            const date = new Date();
            const dateHeading = i + '/' + (date.getMonth() + 1);

            cntr += 1;

            tempDatesArr.push({id: cntr, numeric: true, disablePadding: false, label: dateHeading});
        }
        setHeadCells(tempDatesArr);
    }, [])

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    headCell.id === 'task' ? (
                <Box pl={2}>
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        style={{fontWeight: 'bold'}}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    >
                        {headCell.label}
                    </TableCell>
                </Box>
                ) :  
                <TableCell
                    key={headCell.id}
                    align={'center'}
                    style={{fontWeight: 'bold'}}
                    padding={headCell.disablePadding ? 'none' : 'default'}
                >
                    {headCell.label}
                </TableCell>
            ))}
            </TableRow>
        </TableHead>
    );    
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;