/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import API from '../../utils/apis/kanbanFunctions';
import { useParams, useHistory } from 'react-router-dom';
import './Timesheet.css';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, FormControlLabel, Switch, Box, Button } from '@material-ui/core';
import EnhancedTableHead from './TableHead';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        border: '1px solid #1874cd'
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    button: {
        marginBottom: 40,
        float: 'right'
    }
}));

function Timesheet() {
    const history = useHistory();

    // ID of the users unique board is extracted from the location pathname
    const { id } = useParams();

    // MUI Table data
    const [rows, setRows] = useState([]);

    // Variables for MUI Table
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('cost');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Populate MUI Table
    const renderTasks = () => {
        const tempRowArr = [];

        API.getUserBoard(id)
        .then(res => {
            // Loop through initial data to find out content & time of each task
            // Add this data to table
            for (let key in res.data.tasks) {

                if (res.data.tasks.hasOwnProperty(key)) {
                    if (key === 'task-1') {
                        continue;
                    } else {
                        if (res.data.tasks[key].transferred === false) {
                            const tempTimesheetArr = [];
                            for (let timeKey in res.data.tasks[key].timesheet) {
                                if (res.data.tasks[key].timesheet[timeKey] === 0) {
                                    tempTimesheetArr.push("");
                                } else {
                                    tempTimesheetArr.push(res.data.tasks[key].timesheet[timeKey]);
                                }
                            }
                            tempRowArr.push(createData(res.data.tasks[key].content, ...tempTimesheetArr))
                        }
                    }
                }
            }
            if (('transferredTasks') in res.data) {
                for (let key in res.data.transferredTasks) {
                    const tempTimesheetArr = [];
                    for (let timeKey in res.data.transferredTasks[key].timesheet) {
                        if (res.data.transferredTasks[key].timesheet[timeKey] === 0) {
                            tempTimesheetArr.push("");
                        } else {
                            tempTimesheetArr.push(res.data.transferredTasks[key].timesheet[timeKey]);
                        }
                    }
                    tempRowArr.push(createData(res.data.transferredTasks[key].content, ...tempTimesheetArr));
                }
            }
        })
        .then(() => {
            // console.log(tempRowArr);
            setRows(tempRowArr);
        })
    }

    // Functions required for MUI Table
    function createData(task, mon, tues, wed, thurs, fri, sat, sun) {
        return { task, mon, tues, wed, thurs, fri, sat, sun };
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelecteds = rows.map((n) => n.task);
        setSelected(newSelecteds);
        return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleTaskBtnClick = () => {
        if (localStorage.usertoken) {
            history.push("/tasks");
        } else {
            history.push("/demo/tasks")
        }
    } 

    useEffect(() => {
        if (localStorage.usertoken) {
            renderTasks();
        } else {
            if (sessionStorage.traseDemo) {
                const demo = JSON.parse(sessionStorage.getItem("traseDemo"));
                const tempRowArr = []
                // Loop through initial data to find out content & time of each task
                // Add this data to table
                for (let key in demo.tasks) {
                    if (demo.tasks.hasOwnProperty(key)) {
                        if (key === 'task-1') {
                            continue;
                        } else {
                            if (demo.tasks[key].transferred === false) {
                                const tempTimesheetArr = [];
                                for (let timeKey in demo.tasks[key].timesheet) {
                                    if (demo.tasks[key].timesheet[timeKey] === 0) {
                                        tempTimesheetArr.push("");
                                    } else {
                                        tempTimesheetArr.push(demo.tasks[key].timesheet[timeKey]);
                                    }
                                }
                                tempRowArr.push(createData(demo.tasks[key].content, ...tempTimesheetArr))
                            }
                        }
                    }
                    if (('transferredTasks') in demo) {
                        for (let key in demo.transferredTasks) {
                            const tempTimesheetArr = [];
                            for (let timeKey in demo.transferredTasks[key].timesheet) {
                                if (demo.transferredTasks[key].timesheet[timeKey] === 0) {
                                    tempTimesheetArr.push("");
                                } else {
                                    tempTimesheetArr.push(demo.transferredTasks[key].timesheet[timeKey]);
                                }
                            }
                            tempRowArr.push(createData(demo.transferredTasks[key].content, ...tempTimesheetArr));
                        }
                    }
                }
                setRows(tempRowArr);
            }
        } 
    }, []);

    return (
        <div className="timesheet">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <h2 className="timesheet-heading">Timesheet</h2>
                        <br></br>
                        <Paper className={classes.paper}>
                            <TableContainer>
                                <Table
                                    className={classes.table}
                                    aria-labelledby="tableTitle"
                                    size={dense ? 'small' : 'medium'}
                                    aria-label="enhanced table"
                                >   
                                    <EnhancedTableHead
                                        classes={classes}
                                        numSelected={selected.length}
                                        onSelectAllClick={handleSelectAllClick}
                                        rowCount={rows.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                        const isItemSelected = isSelected(row.task);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.task)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            selected={isItemSelected}
                                            >
                                                <TableCell style={{fontWeight: 'bold'}} component="td" id={labelId} scope="row" align="left">
                                                    <Box pl={3}>
                                                        {row.task}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">{row.mon}</TableCell>
                                                <TableCell align="center">{row.tues}</TableCell>
                                                <TableCell align="center">{row.wed}</TableCell>
                                                <TableCell align="center">{row.thurs}</TableCell>
                                                <TableCell align="center">{row.fri}</TableCell>
                                                <TableCell align="center">{row.sat}</TableCell>
                                                <TableCell align="center">{row.sun}</TableCell>
                                            </TableRow>
                                        );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Paper>
                        <FormControlLabel
                            control={<Switch checked={dense} onChange={handleChangeDense} />}
                            label="Dense padding"
                        />
                    </div>
                </div>
                <Button onClick={handleTaskBtnClick} className={classes.button} variant="contained" color="primary">Tasks</Button>
            </div>
        </div>
    )
}

export default Timesheet;