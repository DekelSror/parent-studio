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
            fontSize: 13,
            fontWeight: 300,
        },
        subtitle2: {
            fontSize: 15,
            fontWeight: 400
        },
        h3: {
            fontSize: 25,
            fontWeight: 600,
            textTransform: 'uppercase'
        },
        h4: {
            fontSize: 19,
            fontWeight: 500,
            textTransform: 'capitalize',
        },
        body1: {
            fontSize: 12,
            fontWeight: 300
        },
        body2: {
            fontSize: 12,
            fontWeight: 200
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

export const RemoveButton = styled(Button)(({theme}) => ({
    color: colors.black,
    '&:hover': {
        backgroundColor: colors.darkGrey,
    },
    ':disabled': {
        backgroundColor: colors.grey
    }
}))

export const AddButton = styled(Button)(({theme}) => ({
    color: colors.black,
    // width: 'fit-content',
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

export const NavButton = styled(Button)(({theme}) => ({
    backgroundColor: colors.orange,
    fontFamily: 'DM Sans',
    color: colors.white,
    ':hover': {
        color: colors.black,
    },
    ':disabled': {
        color: colors.grey
    }
}))

export const ButtonGroupButton = styled(Button)(({theme}) => ({
    flex: 1, 
    border: 'unset',
    color: colors.black,
    ':hover': {
        backgroundColor: colors.orange,
        color: colors.white,
        border: 'unset',
        borderRadius: 0,
    },
    ':active': {
        backgroundColor: colors.darkerBlue,
        color: colors.white,
        border: 'unset',
    }
}))

export const AppContainer = styled(Stack)(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '80px 40px 0px 40px',
    alignItems: 'center',
    justifyContent: 'center',

}))

export const DSlider = styled(Slider)(({theme}) => ({
    color: colors.darkerBlue,
    maxWidth: '50%'
}))

export const DSwitch = styled(Switch)(({theme}) => ({
    '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
            color: colors.darkerBlue,
            '& + .MuiSwitch-track': {
                backgroundColor: colors.black,
            }
        },
    },
}))

export const DInput = styled(Input)(({theme}) => ({
    '&:after': {
        borderBottom: '2px solid #333333'
    }
}))

export const StepContainer = styled(Stack)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    padding: '5rem 3rem 5rem 3rem',
    boxShadow: '2px 1px 1px #777777',
    width: '70%',
}))

export const StreamScript = styled(Typography)(({theme}) => ({
    textAlign: 'left',
}))


export const SelectLabel = styled(InputLabel)(({theme}) => ({
    fontSize: 17,
    color: colors.darkerBlue,
    transition: 'font-size color 200ms',
    '&.Mui-focused': {
        fontSize: 12,
        color: colors.black
    }
}))

export const SelectInput = styled(OutlinedInput)(({theme}) => ({
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


export const SelectItem = styled(MenuItem)(({theme}) => ({
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


export const DDialog = styled(Dialog)(({theme}) => ({
    '&. MuiDialog-paper': {
        width: '50%'
    }
}))