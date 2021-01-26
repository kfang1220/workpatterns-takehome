import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
    emailInput : {
        paddingLeft: "100px",
        paddingTop: "10px"
    }
  });

export const Input = (props) => {
    const classes = useStyles();
    const [textString, setTextString] = React.useState("");

    const handleEmailChange = (e) => {
        setTextString(e.target.value)
    }

    const clearField = () => {
        setTextString("")
    }

    return (
        <div>
            <TextField value={textString} className={classes.emailInput} placeholder="Change Email" onChange={handleEmailChange} onKeyDown={(e) => {
                props.onSubmit(e); 
                if (e.keyCode === 13) clearField();
            }} />   
        </div>
    )
}