import React, { ChangeEvent, FormEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },

    },
    button: {
        margin: theme.spacing(1),
    },
}));



export const SearchBox = () => {
    const [name, setName] = useState<string>('');

    const history = useHistory();


    const classes = useStyles();
    const searchButtonHidden = true;
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("search 누름", name);
        history.push(`/search?category=all&name=${name}`);
    }

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={submitHandler}>
            <TextField id="standard-basic" label="Search" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} autoFocus />
            <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<SearchOutlinedIcon />}
                type="submit"
                hidden={searchButtonHidden}
            > Search
            </Button>
        </form>
    )
}
