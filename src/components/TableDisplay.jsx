import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {months} from "../data/months"
import _ from 'lodash';
import { TIME, NUMBER_OF_EMAILS } from "../data/constants"

const useStyles = makeStyles({
    container: {
        maxHeight: "800px"
    }
})

const createRowData = (companyName, data) => {
    const monthlyData = _.get(data, TIME);
    if (monthlyData !== undefined) {
        const monthlyMinuteAverage = monthlyData.map((month, i) => {
            if (data[NUMBER_OF_EMAILS][i] !== 0) {
                return month = Math.ceil(month / data[NUMBER_OF_EMAILS][i])
            } else {
                return Math.ceil(month)
            }
        })
    }
}

export const TableDisplay = (props) => {
    const classes = useStyles();
    const { data } = props;
    const columns = [{id: "CompanyName", label: "CompanyName", minWidth: 50}];
    const rows = [];

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
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                </Table>
                <TableBody>
                    {rows.map((row) => (
                        //some content
                        <div>hello</div>
                    ))}
                </TableBody>
            </TableContainer>
        </div>
    )
}