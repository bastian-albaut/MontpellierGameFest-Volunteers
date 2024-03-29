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
import ModifyUserProfile from './pages/Profile/ModifyUserProfile';
import ViewUserProfile from './pages/Profile/ViewUserProfile';
import SignupFestival from './pages/SignupFestival/SignupFestival';
import PostePage from './pages/Poste/PostePage';
import ContactPage from './pages/Contact/ContactPage';
import Festival from './pages/Festival/Festival';
import DashboardAdmin from './pages/Dashboard/DashboardAdmin';
import OAuth2Callback from "./pages/OAuth2Callback/OAuth2Callback";
import ResetMDP from "./pages/ResetMDP/ResetMDP";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";

import Acceuil from './pages/Festival/Acceuil'
import MonFestival from './components/MyFestival/MonFestival';
import FAQPage from './pages/FAQ/FAQPage';
import MonFestivalPage from './pages/MyFestival/MonFestivalPage';

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
                    <Route path="/modifyprofil" element={<ModifyUserProfile />}/>
                    <Route path="/viewprofil" element={<ViewUserProfile />}/>
                    <Route path="/tableaudebord/admin/:id" element={<DashboardAdmin />}/>
                    <Route path="/festival/inscription/:id" element={<SignupFestival />}/>
                    <Route path="/poste/:id" element={<PostePage />}/>
                    <Route path="/contact" element={<ContactPage />}/>
                    <Route path="/festival/:id" element={<Festival />}/>
                    <Route path="/oauth2/callback" element={<OAuth2Callback />} />
                    <Route path="/reset-password" element={<ResetMDP />}/>
                    <Route path="/verify-email" element={<VerifyEmail/>} />
                    <Route path="/gestionacceuil/:id" element={<Acceuil />}/>
                    <Route path="/mon-festival" element={<MonFestivalPage />} />
                    <Route path="/faq" element={<FAQPage />} />
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
