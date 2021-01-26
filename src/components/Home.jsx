import data from "../data/emails.json";
import {TableDisplay} from "./TableDisplay"
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import {USER, SENDER, RECEIVER, NUMBER_OF_EMAILS, TOTAL_EMAIL_TIME, IN_REPLY_TO, TIME} from "../data/constants"

const useStyles = makeStyles({
    header: {
      display: "flex",
      justifyContent: "center",
      fontFamily: "sans-serif",
      fontSize: "50px"
    },
  });

export const Home = () => {
    const classes = useStyles()
    const sentEmails = [];
    const companyMap = {};

    // find all emails that were sent by user to look for replies
    data.forEach(email => {
        let addresses = email.addresses;
        let sender = addresses.find(user => user.role === SENDER)
        if (_.get(sender, "address") === USER) sentEmails.push(email) 
    })

      console.log(data, sentEmails)

    // for each sent email find corresponding reply to calculate total time
    sentEmails.forEach(email => {
        let sentAddresses = email.addresses;
        let sender = sentAddresses.find(user => user.role === SENDER)
        let messageId = _.get(email, "message-id");
        let responseEmail = data.find(email => {
            return _.get(email, IN_REPLY_TO) === messageId && _.get(sender, "addresses") !== USER
        })

        if (responseEmail) {
            let tempObj = {}
            let receivedAddresses = responseEmail.addresses;
            let receiver = receivedAddresses.find(user => user.role === RECEIVER)
            let companyName = _.get(receiver, "address").split('@')[1] 
            let sentMiliTime = new Date(_.get(email, TIME)*1000).getSeconds();
            let receivedMiliTime = new Date(_.get(responseEmail, TIME)*1000).getSeconds();

            if (sentMiliTime < receivedMiliTime) {
                let month = new Date(_.get(responseEmail, TIME)*1000).getMonth()
                // we can use this if we paginate for multiple years, MVP first
                // let year = new Date(_.get(responseEmail, "time")*1000).getFullYear()
                let sentEmailTime = new Date(_.get(email, TIME)*1000).getTime();
                let receivedEmailTime = new Date(_.get(responseEmail, TIME)*1000).getTime();
                let replytime = (receivedEmailTime - sentEmailTime) / 60000

                if (companyMap[companyName] === undefined) {
                    tempObj[TOTAL_EMAIL_TIME] = new Array(12).fill(0)
                    tempObj[TOTAL_EMAIL_TIME][month] = replytime
                    tempObj[NUMBER_OF_EMAILS] = new Array(12).fill(0)
                    tempObj[NUMBER_OF_EMAILS][month] = 1
                    companyMap[companyName] = tempObj
                } else {
                    companyMap[companyName][TOTAL_EMAIL_TIME][month] += replytime
                    companyMap[companyName][NUMBER_OF_EMAILS][month] ++
                }
            }
        }
    })

    console.log(companyMap)

    return (
        <div>
            <div className={classes.header}> Monthly Average Email Response Time in Minutes </div>
            <TableDisplay data={companyMap}/>
      </div>
    )
}