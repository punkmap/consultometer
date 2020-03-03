import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const theme = createMuiTheme({
  palette: {
    success: {
      main: blue[500],
    }
  }
});
const successThemePalette = { primary: theme.palette.success };
const successTheme = createMuiTheme({ ...theme, palette: successThemePalette });
const SuccessThemeProvider = props => {
  return (
    <MuiThemeProvider theme={successTheme}>{props.children}</MuiThemeProvider>
  );
};
export default function IconBtn(props) {
  
  const toggleSwitchState = () => {
    //change the state of the A/V? switch
    console.log('togglebutton click')
  };
  return (
    <MuiThemeProvider theme={theme}>
        <SuccessThemeProvider>
          <IconButton 
            onClick={props.click}
            color={props.active ? "primary" : "default"} 
            variant="contained">
            {props.icon}
          </IconButton>
        </SuccessThemeProvider>
    </MuiThemeProvider>
  );
}


