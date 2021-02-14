/* eslint-disable no-loop-func */
import React, { useEffect, useState } from 'react';
import API from '../../utils/apis/API';
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
}));

function Timesheet() {
    const history = useHistory();

    // ID of the users unique board is extracted from the location pathname
    const { id } = useParams();

    // MUI Table data
    const [rows, setRows] = useState([]);

    // Variables for MUI Table
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
            setRows(tempRowArr);
        })
    }

    // Functions required for MUI Table
    function createData(task, mon, tues, wed, thurs, fri) {
        return { task, mon, tues, wed, thurs, fri };
    }

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
        history.push("/tasks");
    } 

    useEffect(() => {
        renderTasks();
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
                                    />
                                    <TableBody>
                                    {rows.map((row, index) => {
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
                <Button onClick={handleTaskBtnClick} className="tasksButton" variant="contained" color="primary">Tasks</Button>
            </div>
        </div>
    )
}

export default Timesheet;