import React from "react";

//local components
import { Input } from "./Input"
import { DropdownSelect } from "./DropdownSelect"

//material ui
import {TableDisplay} from "./TableDisplay"
import { makeStyles } from '@material-ui/core/styles';

// other libraries
import _ from 'lodash';

// local file
import data from "../data/emails.json";
import {
    DEFAULT_MINUTE_RANGE,
    EMAIL_RESPONSE_TIME_ENGLISH,
    EMAIL_RESPONSE_TIME_FRAMES,
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

    // 
    for (let i = 0; i < data.length; i++) {
        yearSet.add(new Date(_.get(data[i], "time")*1000).getFullYear())
    }

    const [currentYear, setCurrentYear] = React.useState(Array.from(yearSet).sort()[0] || DEFAULT_YEAR);
    const [currentEmail, setCurrentEmail] = React.useState(USER);
    const [minuteRange, setMinuteRange] = React.useState(DEFAULT_MINUTE_RANGE)

    const handleYearDropDown = (e) => {
        const value = e.target.value;
        setCurrentYear(value);
    }

    const handleTimeDropDown = (e) => {
        const value = e.target.value;
        setMinuteRange(value);
    }

    const handleEmailSubmit = (e) => {
        if(e.keyCode === 13){
            setCurrentEmail(e.target.value);
         }
    }

    // get list of years for year dropdown
    for (let i = 0; i < data.length; i++) {
        yearSet.add(new Date(_.get(data[i], "time")*1000).getFullYear());
    }

    // find all emails that were sent by user to look for replies
    data.forEach(email => {
        const year = new Date(_.get(email, "time")*1000).getFullYear();
        if (year !== currentYear) return;
        const addresses = email.addresses;
        const sender = addresses.find(user => user.role === SENDER);
        if (_.get(sender, "address") === currentEmail) sentEmails.push(email);
    })

    // for each sent email find corresponding reply to calculate total time
    sentEmails.forEach(email => {
        const sentAddresses = email.addresses;
        const sender = sentAddresses.find(user => user.role === SENDER);
        const messageId = _.get(email, "message-id");
        const responseEmail = data.find(email => {
            return _.get(email, IN_REPLY_TO) === messageId && _.get(sender, "addresses") !== USER;
        })

        if (responseEmail) {
            const companyObj = {};
            const receivedAddresses = responseEmail.addresses;
            const receiver = receivedAddresses.find(user => user.role === RECEIVER);
            const companyName = _.get(receiver, "address").split('@')[1] 
            const sentTime = new Date(_.get(email, TIME)*1000).getTime();
            const receivedTime = new Date(_.get(responseEmail, TIME)*1000).getTime();


            if (sentTime < receivedTime && (receivedTime-sentTime)/6000 < minuteRange) {
                const month = new Date(_.get(responseEmail, TIME)*1000).getMonth();
                const year = new Date(_.get(responseEmail, "time")*1000).getFullYear();
                const sentEmailTime = new Date(_.get(email, TIME)*1000).getTime();
                const receivedEmailTime = new Date(_.get(responseEmail, TIME)*1000).getTime();
                const replytime = (receivedEmailTime - sentEmailTime) / 60000;

                if (companyMap[companyName] === undefined) {
                    const yearObj = {};
                    yearObj[TOTAL_EMAIL_TIME] = new Array(12).fill(0);
                    yearObj[TOTAL_EMAIL_TIME][month] = replytime;
                    yearObj[NUMBER_OF_EMAILS] = new Array(12).fill(0);
                    yearObj[NUMBER_OF_EMAILS][month] = 1;
                    companyObj[year] = yearObj;
                    companyMap[companyName] = companyObj;
                } else {
                    if (companyMap[companyName][year]) {
                        companyMap[companyName][year][TOTAL_EMAIL_TIME][month] += replytime;
                        companyMap[companyName][year][NUMBER_OF_EMAILS][month] ++;
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
                <DropdownSelect
                    labelId={"year-selector"}
                    id={"year-selector"}
                    value={currentYear}
                    onChange={handleYearDropDown}
                    defaultValue={currentYear}
                    label={"year"}
                    dataList={Array.from(yearSet)}
                    labelNames={Array.from(yearSet)}
                    title={"Year"}
                />
                <DropdownSelect
                    title={"Time Frame"}
                    labelId={"time-frame-selector"}
                    id={"time-frame-selector"}
                    value={minuteRange}
                    onChange={handleTimeDropDown}
                    defaultValue={minuteRange}
                    label={"time-frame-selector"}
                    dataList={EMAIL_RESPONSE_TIME_FRAMES}
                    labelNames={EMAIL_RESPONSE_TIME_ENGLISH}
                />
            </div>
      </div>
    )
}