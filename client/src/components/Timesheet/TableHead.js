import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles(() => ({
    arrowBack: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

function EnhancedTableHead() {
    
    const [headCells, setHeadCells] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        // Hardcoded to avoid errors when week overlaps between months
        const monday  = startOfWeek(new Date(), {weekStartsOn: 1}).getDate() + "/" + (startOfWeek(new Date(), {weekStartsOn: 1}).getMonth() + 1);
        const tuesday = endOfWeek(new Date(), {weekStartsOn: 3}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 3}).getMonth() + 1);
        const wednesday = endOfWeek(new Date(), {weekStartsOn: 4}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 4}).getMonth() + 1);;
        const thursday = endOfWeek(new Date(), {weekStartsOn: 5}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 5}).getMonth() + 1);;
        const friday = endOfWeek(new Date(), {weekStartsOn: 6}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 6}).getMonth() + 1);;
        const saturday = endOfWeek(new Date(), {weekStartsOn: 0}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 0}).getMonth() + 1);;
        const sunday = endOfWeek(new Date(), {weekStartsOn: 1}).getDate() + "/" + (endOfWeek(new Date(), {weekStartsOn: 1}).getMonth() + 1);;
    
        const tempDatesArr = [
            {id: 'task', numeric: false, disablePadding: false, label: <ArrowBackIosIcon className={classes.arrowBack} onClick={() => console.log("Test")} />},
            {id: 0, numeric: true, disablePadding: false, label: monday},
            {id: 1, numeric: true, disablePadding: false, label: tuesday},
            {id: 2, numeric: true, disablePadding: false, label: wednesday},
            {id: 3, numeric: true, disablePadding: false, label: thursday},
            {id: 4, numeric: true, disablePadding: false, label: friday},
            {id: 5, numeric: true, disablePadding: false, label: saturday},
            {id: 6, numeric: true, disablePadding: false, label: sunday}
        ];
    
        console.log(tempDatesArr);
        setHeadCells(tempDatesArr);
    }, [])

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    headCell.id === 'task' ? (
                // <Box>
                    <TableCell
                        key={headCell.id}
                        align={"right"}
                        style={{fontWeight: 'bold'}}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    >
                        {headCell.label}
                    </TableCell>
                // </Box>
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
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;