import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


export const API_BASE = "http://localhost:9002";


// material-ui constant Slider
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 300,
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        margin: {
            height: theme.spacing(3),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export const marks = [
    {
        value: 0,
        label: '$0',
    },
    {
        value: 50,
        label: '$50',
    },
    {
        value: 100,
        label: '$100',
    },
    {
        value: 200,
        label: '$200',
    },
    {
        value: 300,
        label: '$300',
    },
    {
        value: 400,
        label: '$400',
    },
];

export const valuetext = (value: number) => {
    return `$${value}`;
}