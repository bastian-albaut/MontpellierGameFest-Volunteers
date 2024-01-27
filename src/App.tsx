import React from 'react';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/fr';

import "./styles/styles.scss"
import variables from "./styles/abstract/variables.module.scss"
import HomePage from './pages/HomePage/HomePage';
import CreateFestival from './pages/CreateFestival/CreateFestival';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import Dashboard from './pages/Dashboard/Dashboard';
import { UserProvider } from './contexts/UserContext';
import SignupFestival from './pages/SignupFestival/SignupFestival';
import Festival from './pages/Festival/Festival';


let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: variables.primaryColor,
    },
    secondary: {
      main: variables.secondaryColor,
    },
    text: {
      primary: variables.textColor,
      disabled: variables.greyColor,
    },
    background: {
      default: variables.whiteColor,
      paper: variables.whiteColor,
    },
  },
  breakpoints: {
    values: {
      xs: variables.breakpointXS,
      sm: variables.breakpointSM,
      md: variables.breakpointMD,
      lg: variables.breakpointLG,
      xl: variables.breakpointXL,
    },
  },
  typography: {
    h1: {
      fontFamily: [
        'Fredoka',
        'cursive',
      ].join(','),
    },
    h2: {
      fontFamily: [
        'Fredoka',
        'cursive',
      ].join(','),
    },
    h3: {
      fontFamily: [
        'Fredoka',
        'sans-serif',
      ].join(','),
    },
    h4: {
      fontFamily: [
        'Fredoka',
        'sans-serif',
      ].join(','),
    },
    h5: {
      fontFamily: [
        'Fredoka',
        'sans-serif',
      ].join(','),
    },
    h6: {
      fontFamily: [
        'Fredoka',
        'sans-serif',
      ].join(','),
    },
    subtitle1: {
      fontFamily: [
        'Raleway',
        'sans-serif',
      ].join(','),
    },
    body1: {
      fontFamily: [
        'Raleway',
        'sans-serif',
      ].join(','),
    },
    caption: {
      fontFamily: [
        'Raleway',
        'sans-serif',
      ].join(','),
    },
    button: {
      fontFamily: [
        'Fredoka',
        'cursive',
      ].join(','),
      fontWeight: "bold",
    }
  },
  shape: {
    borderRadius: 30
  },
});

theme = responsiveFontSizes(theme);

const App = () => {

  return (
    <UserProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst>
                <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/connexion" element={<LoginRegister />} />
                    <Route path="/festival/creation" element={<CreateFestival />}/>
                    <Route path="/tableaudebord/:id" element={<Dashboard />}/>
                    <Route path="/festival/inscription/:id" element={<SignupFestival />}/>
                    <Route path="/festival/:id" element={<Festival />}/>
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
                </BrowserRouter>
            </StyledEngineProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </UserProvider>
  );
}

export default App;
