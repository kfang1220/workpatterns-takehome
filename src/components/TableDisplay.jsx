import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {months} from "../data/months"
import _ from 'lodash';
import {NUMBER_OF_EMAILS, TOTAL_EMAIL_TIME } from "../data/constants"

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        height: "750px"
    },
    cellHeader: {
        fontWeight: "normal"
    }
})

export const TableDisplay = (props) => {
    const classes = useStyles();
    const { data } = props;
    const columns = [{id: "CompanyName", label: "CompanyName", minWidth: 50}];
    const rows = [];
    const uniqueYearsSet = new Set();
    const companyTimeData = new Array(12).fill(0);
    const companyMonthlyEmailCount = new Array(12).fill(0);

    //create rows for table
    const createRowData = (companyName, data) => {
        const monthlyData = _.get(data, TOTAL_EMAIL_TIME);
        if (monthlyData !== undefined) {
            const monthlyMinuteAverages = monthlyData.map((month, i) => {
                if (data[NUMBER_OF_EMAILS][i] !== 0) {
                    return month = Math.ceil(month/data[NUMBER_OF_EMAILS][i]);
                } else {
                    if (month === 0) return <h6 key={i} className={classes.cellHeader}>No Data</h6>
                    return Math.ceil(month);
                }
            })

            return {companyName, 
                "Jan": monthlyMinuteAverages[0], 
                "Feb": monthlyMinuteAverages[1], 
                "Mar": monthlyMinuteAverages[2], 
                "Apr": monthlyMinuteAverages[3], 
                "May": monthlyMinuteAverages[4], 
                "Jun": monthlyMinuteAverages[5], 
                "Jul": monthlyMinuteAverages[6], 
                "Aug": monthlyMinuteAverages[7], 
                "Sep": monthlyMinuteAverages[8], 
                "Oct": monthlyMinuteAverages[9], 
                "Nov": monthlyMinuteAverages[10], 
                "Dec": monthlyMinuteAverages[11], 
              };
        }
    }

    for (let company in data) {
        for (let years in data[company]) {
            uniqueYearsSet.add(years)
        }
    }

    // loop through and get sum total for all orgs
    for (let company in data) {
        for(let year in data[company]) {
            const yearObj = data[company][year];
            for (let i = 0; i < yearObj[TOTAL_EMAIL_TIME].length; i++) {
                companyTimeData[i] += yearObj[TOTAL_EMAIL_TIME][i];
                companyMonthlyEmailCount[i] += yearObj[NUMBER_OF_EMAILS][i]
            }
        }
    }

    rows.push(createRowData("All Orgs", {"totalEmailTime": companyTimeData, "numberOfEmails": companyMonthlyEmailCount}))

    for (let month in months) {
        columns.push({id: months[month], label: months[month], minWidth: 50})
    }
    
    for (let companies in data) {
        for (let year in data[companies]) {
            let monthlyData = _.get(data[companies][year], TOTAL_EMAIL_TIME)

            if (monthlyData) {
                rows.push(createRowData(companies, data[companies][year]))
            }
        }
    }

    return (
        <div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.companyName}
                                </TableCell>
                                <TableCell align="left">{row.Jan}</TableCell>
                                <TableCell align="left">{row.Feb}</TableCell>
                                <TableCell align="left">{row.Mar}</TableCell>
                                <TableCell align="left">{row.Apr}</TableCell>
                                <TableCell align="left">{row.May}</TableCell>
                                <TableCell align="left">{row.Jun}</TableCell>
                                <TableCell align="left">{row.Jul}</TableCell>
                                <TableCell align="left">{row.Aug}</TableCell>
                                <TableCell align="left">{row.Sep}</TableCell>
                                <TableCell align="left">{row.Oct}</TableCell>
                                <TableCell align="left">{row.Nov}</TableCell>
                                <TableCell align="left">{row.Dec}</TableCell>
                            </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}