import { createTheme, Button, Stack, Typography, styled, 
    Slider, Switch, responsiveFontSizes, Input, InputLabel, 
    OutlinedInput, MenuItem, Dialog 
} from "@mui/material"

export const colors = {
    babyBlue: '#b7ebf0',
    white: '#ffffff',
    black: '#000000',
    purple: '#6f42c1',
    darkerBlue: '#27b5cc',
    tan: '#F19336',
    peach: '#FE6E63',
    grey: '#8D8D8D',
    orange: '#F19336dd',
    yellow: '#FFD426',
    darkGrey: '#373737',
    green: '#4BA651',
}

export const theme = responsiveFontSizes(createTheme({
    typography: {
        fontFamily: 'Mulish',
        subtitle1: {
            fontSize: 17,
            fontWeight: 300,
        },
        subtitle2: {
            fontSize: 19,
            fontWeight: 400
        },
        h3: {
            fontSize: 31,
            fontWeight: 600,
            textTransform: 'uppercase'
        },
        h4: {
            fontSize: 22,
            fontWeight: 500,
            textTransform: 'capitalize',
        },
        body1: {
            fontSize: 16,
            fontWeight: 400
        },
        body2: {
            fontSize: 16,
            fontWeight: 300
        }
    },
    palette: {
        background: {
            default: colors.white,
            paper: colors.babyBlue
        },
        text: {
            primary: colors.black,
            secondary: colors.white,
            disabled: colors.grey  
        }
    },
}))

export const AddButton = styled(Button)(() => ({
    color: colors.black,
    maxWidth: 'fit-content',
    backgroundColor: colors.tan,
    transition: 'font-weight 300ms, background-color 300ms ease-in',
    '&:hover': {
        backgroundColor: colors.green,
        color: colors.white,
        fontWeight: 800,
    },
    ':disabled': {
        color: colors.grey
    }
}))

export const NavButton = styled(Button)(() => ({
    backgroundColor: colors.darkerBlue,
    fontFamily: 'DM Sans',
    color: colors.white,
    maxWidth: 'fit-content',
    transition: 'background-color 200ms ease-out, color 200ms ease-out',
    ':hover': {
        color: colors.black,
    },
    ':disabled': {
        color: colors.grey
    }
}))

export const ButtonGroupButton = styled(Button)(() => ({
    flex: 1, 
    border: 'unset',
    color: colors.black,
    ':hover': {
        backgroundColor: colors.orange,
        color: colors.white,
        border: 'unset',
        borderRadius: 0,
    },
}))

export const SelectedButton = styled(Button)(() => ({
    flex: 1, 
    border: 'unset',
    color: colors.white,
    backgroundColor: colors.green,
    transition: 'background-color 200ms ease-in-out, color 200ms ease-in-out',
    ':hover': {
        backgroundColor: colors.orange,
        border: 'unset',
        borderRadius: 0,
    },
}))


export const UnselectedButton = styled(Button)(() => ({
    flex: 1, 
    border: 'unset',
    color: colors.black,
    backgroundColor: colors.white,
    transition: 'background-color 200ms ease-in-out, color 200ms ease-in-out',
    ':hover': {
        backgroundColor: colors.orange,
        color: colors.white,
        border: 'unset',
        borderRadius: 0,
    },
}))

export const AppContainer = styled(Stack)(() => ({
    backgroundColor: colors.babyBlue,
    padding: '80px 40px 0px 40px',
    alignItems: 'center',
    overflowY: 'visible',
    // justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: '80px 12px 0px 12px',
        height: '200vh',
    }

}))

export const DSlider = styled(Slider)(() => ({
    color: colors.darkerBlue,
    maxWidth: '50%'
}))

export const DSwitch = styled(Switch)(() => ({
    '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
            color: colors.darkerBlue,
            '& + .MuiSwitch-track': {
                backgroundColor: colors.black,
            }
        },
    },
}))

export const DInput = styled(Input)(() => ({
    '&:after': {
        borderBottom: '2px solid #333333'
    }
}))

export const StepContainer = styled(Stack)(() => ({
    backgroundColor: colors.white,
    padding: '6rem',
    borderRadius: 20,
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: '2rem',
    }
}))

export const StreamScript = styled(Typography)(() => ({
    textAlign: 'left',
}))


export const SelectLabel = styled(InputLabel)(() => ({
    fontSize: 17,
    color: colors.darkerBlue,
    transition: 'font-size color 200ms',
    '&.Mui-focused': {
        fontSize: 12,
        color: colors.black
    }
}))

export const SelectInput = styled(OutlinedInput)(() => ({
    backgroundColor: theme.palette.background.paper,
    width: '12rem',
    color: colors.grey,
    '&.Mui-focused': {
        '.MuiOutlinedInput-notchedOutline': {
            border: '2px solid ' + colors.darkerBlue,
            color: colors.black
        }
    }
}))


export const SelectItem = styled(MenuItem)(() => ({
    paddingBottom: '1rem',
    transition: 'background 200ms',
    ':hover': {
        backgroundColor: colors.peach,
    },
    '&.Mui-selected': {
        backgroundColor: colors.peach,
        ':hover': {
            color: colors.white,
            backgroundColor: colors.black
        }
    },
}))


export const DDialog = styled(Dialog)(() => ({
    '&. MuiDialog-paper': {
        width: '50%'
    }
}))