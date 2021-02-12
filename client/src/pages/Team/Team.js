import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getOneTeam } from '../../utils/apis/userFunctions';
import API from '../../utils/apis/API';
import './style.css';
// import EngAccordion from './Accordion';
import MyDocument from './engagementPDF';
import {PDFDownloadLink } from '@react-pdf/renderer';
import { startOfWeek, endOfWeek } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, FormControlLabel, Switch } from '@material-ui/core';
import EnhancedTableHead from './TableHead';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
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

function Team() {

    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);

    const [engs, setEngs] = useState([]);

    const dateToday = new Date();
    const month = dateToday.getMonth() + 1;
    const fullDate = dateToday.getDate() + '/' + month + '/' + dateToday.getFullYear();

    let tempEngArr = [];
    
    // MUI Table data
    const [rows, setRows] = useState([]);

    // Variables for MUI Table
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('cost');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Show different report based on which button is clicked
    const [showReport, setShowReport] = useState({
        name: '',
        tasks: {},
        weekStart: '', 
        weekEnd: '',
        view: false
    });
    

    const storeEngagementNames = () => {

        // Store content of each task with the same engagement name
        getOneTeam(decoded.teamName).then(res => {

            res.engagements.forEach(eng => {
                tempEngArr.push({ engName: eng, tasks: [] });
            })
        }).then(() => {
            renderEngagements();
        }).then(() => {
            setEngs(tempEngArr);
        })
    }
    
    const renderEngagements = () => {
        API.getBoards().then(response => {    
            response.data.forEach(el => {
                if (el.teamName === decoded.teamName) {
                    for (let key in el.tasks) {
                        if (el.tasks[key].engagement !== "") {
                            tempEngArr.map((eng, idx) => {
                                if (eng.engName === el.tasks[key].engagement) {
                                    tempEngArr[idx].tasks.push({employees: { ...el.tasks[key].employees }, content: el.tasks[key].content })
                                }
                            })
                        }
                    }
                }
            })
        })  
    }

    // Required for PDF print & table data render
    const renderClickedEngReport = event => {
        event.preventDefault();
        
        // PDF Print
        let tasks = {};

        const date = new Date();

        const weekStart = startOfWeek(date, { weekStartsOn: 1 }).getDate() + '/' + month + '/' + date.getFullYear();
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 }).getDate() - 2 + '/' + month + '/' + date.getFullYear();

        engs.forEach(el => {
            if (el.engName === event.target.id) {
                tasks = {...el.tasks};
            }
        })
        setShowReport({
            name: event.target.id,
            tasks: tasks,
            weekStart: weekStart, 
            weekEnd: weekEnd,
            view: true
        })

        // Table data render

        const tempRowArr = [];
        
        engs.forEach((el, idx) => {
            if (el.engName === event.target.id) {
                el.tasks.forEach(task => {
                    let taskCost = 0.00;
                    let taskTime = 0;
                    for (let empsKey in task.employees) {
                        taskCost += parseFloat(task.employees[empsKey].cost);
                        taskTime += parseInt(task.employees[empsKey].overallTime);
                    }
                    tempRowArr.push(createData(task.content, taskTime, taskCost));
                })
            }
        })
        setRows(tempRowArr);
    }

    // Functions required for MUI Table
    function createData(task, hours, cost) {
        return { task, hours, cost };
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

    useEffect(() => {
        storeEngagementNames();
    }, [])

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h1>{decoded.teamName}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <h3>Engagements</h3>
                    <ul className="engagement-list" type="none">
                        {engs.map((el, idx) => {
                            // return <li><EngAccordion key={idx} name={el.engName} tasks={[el.tasks]} /></li>
                            return <li><button id={el.engName} onClick={renderClickedEngReport}>{el.engName}</button></li>
                        })}
                    </ul>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-sm-12">
                    {showReport.view ? ( <div>
                        <h3 className="engName">{showReport.name.toUpperCase()} Report</h3>

                        <div className={classes.root}>
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
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
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
                                                    <TableCell component="td" id={labelId} scope="row" align="center">
                                                        {row.task}
                                                    </TableCell>
                                                    <TableCell align="center">{row.hours}</TableCell>
                                                    <TableCell align="center">{row.cost}</TableCell>
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
                        <br></br>
                        <PDFDownloadLink className="btn btn-primary pdfDownloadLink" document={<MyDocument name={showReport.name.toUpperCase()} tasks={showReport.tasks} weekStart={showReport.weekStart} weekEnd={showReport.weekEnd}/>} fileName={showReport.name + '-' + fullDate + '.pdf'}>
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : `Download PDF`)}
                        </PDFDownloadLink>
                        </div> ) : ''}
                </div>
            </div>
        </div>
    )
}

export default Team;