import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
      },
  });

export const DropdownSelect = (props) => {
    const classes = useStyles();
    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="input-label">{props.title}</InputLabel>
                    <Select
                        labelId={props.labelId}
                        id={props.id}
                        value={props.value}
                        onChange={props.onChange}
                        defaultValue={props.defaultValue}
                        label={props.label}
                    >
                        {props.dataList.map((listItem, i) => (
                            <MenuItem key={i} value={listItem}>{props.labelNames[i]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
        </div>
    )
}