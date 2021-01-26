import React from "react";

//local components
import {Input} from "./Input"

//material ui
import {TableDisplay} from "./TableDisplay"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// other libraries
import _ from 'lodash';

// local file
import data from "../data/emails.json";
import {
    DEFAULT_YEAR,
    IN_REPLY_TO,
    NUMBER_OF_EMAILS,
    RECEIVER, 
    SENDER, 
    TIME,
    TOTAL_EMAIL_TIME,
    USER} from "../data/constants"

const useStyles = makeStyles({
    emailInput : {
        paddingLeft: "100px",
        paddingTop: "10px"
    },
    footer: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "100px",
        paddingTop: "10px"
    },
    formControl: {
        minWidth: 120,
      },
      header: {
        display: "flex",
        fontFamily: "sans-serif",
        fontSize: "50px",
        justifyContent: "center",
      },
  });

export const Home = () => {
    const classes = useStyles()
    const sentEmails = [];
    const companyMap = {};
    const yearSet = new Set();

    for (let i = 0; i < data.length; i++) {
        yearSet.add(new Date(_.get(data[i], "time")*1000).getFullYear())
    }

    // to avoid parsing a massive file, default 2018 for demo purposes
    const [currentYear, setCurrentYear] = React.useState(Array.from(yearSet).sort()[0] || DEFAULT_YEAR);
    const [currentEmail, setCurrentEmail] = React.useState(USER);

    const handleDropDown = (e) => {
        const year = e.target.value;
        setCurrentYear(year)
    }

    const handleEmailSubmit = (e) => {
        if(e.keyCode === 13){
            setCurrentEmail(e.target.value)
         }
    }

    for (let i = 0; i < data.length; i++) {
        yearSet.add(new Date(_.get(data[i], "time")*1000).getFullYear())
    }

    // find all emails that were sent by user to look for replies
    data.forEach(email => {
        let year = new Date(_.get(email, "time")*1000).getFullYear()
        if (year !== currentYear) return;
        let addresses = email.addresses;
        let sender = addresses.find(user => user.role === SENDER)
        if (_.get(sender, "address") === currentEmail) sentEmails.push(email) 
    })

    // for each sent email find corresponding reply to calculate total time
    sentEmails.forEach(email => {
        const sentAddresses = email.addresses;
        const sender = sentAddresses.find(user => user.role === SENDER)
        const messageId = _.get(email, "message-id");
        const responseEmail = data.find(email => {
            return _.get(email, IN_REPLY_TO) === messageId && _.get(sender, "addresses") !== USER
        })

        if (responseEmail) {
            const companyObj = {}
            const receivedAddresses = responseEmail.addresses;
            const receiver = receivedAddresses.find(user => user.role === RECEIVER)
            const companyName = _.get(receiver, "address").split('@')[1] 
            const sentMiliTime = new Date(_.get(email, TIME)*1000).getSeconds();
            const receivedMiliTime = new Date(_.get(responseEmail, TIME)*1000).getSeconds();

            if (sentMiliTime < receivedMiliTime) {
                const month = new Date(_.get(responseEmail, TIME)*1000).getMonth()
                const year = new Date(_.get(responseEmail, "time")*1000).getFullYear()
                const sentEmailTime = new Date(_.get(email, TIME)*1000).getTime();
                const receivedEmailTime = new Date(_.get(responseEmail, TIME)*1000).getTime();
                const replytime = (receivedEmailTime - sentEmailTime) / 60000

                if (companyMap[companyName] === undefined) {
                    const yearObj = {}
                    yearObj[TOTAL_EMAIL_TIME] = new Array(12).fill(0)
                    yearObj[TOTAL_EMAIL_TIME][month] = replytime
                    yearObj[NUMBER_OF_EMAILS] = new Array(12).fill(0)
                    yearObj[NUMBER_OF_EMAILS][month] = 1
                    companyObj[year] = yearObj
                    companyMap[companyName] = companyObj
                } else {
                    if (companyMap[companyName][year]) {
                        companyMap[companyName][year][TOTAL_EMAIL_TIME][month] += replytime
                        companyMap[companyName][year][NUMBER_OF_EMAILS][month] ++
                    }
                }
            }
        }
    })

    return (
        <div>
            <div className={classes.header}> Monthly Average Email Response Time in Minutes ({currentYear}) </div>
            <TableDisplay data={companyMap} year={currentYear}/>
            <div className={classes.footer}>
                <Input onSubmit={handleEmailSubmit}/>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="input-label">Year</InputLabel>
                    <Select
                        labelId="year-selector"
                        id="year-selector"
                        value={currentYear}
                        onChange={handleDropDown}
                        defaultValue={currentYear}
                        label="year"
                    >
                        {Array.from(yearSet).map(year => (
                            <MenuItem value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
      </div>
    )
}