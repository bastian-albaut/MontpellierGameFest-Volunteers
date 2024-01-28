import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../styles/components/general/toolbarConnected.module.scss"
import { useUser } from "../../contexts/UserContext";


export default function ToolbarConnected(props: any) {

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event: any) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: any) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const navigate = useNavigate()
    const { reloadUserContext } = useUser();
    const handleLogout = async () => {
        handleCloseUserMenu();
        localStorage.removeItem('token');

        // Trigger the fetchUser function from the UserContext
        await reloadUserContext(); // Wait for fetchUser to complete

        navigate("/", { state: { message: "Vous êtes deconnecté !", severity: "success" } });
    }

    const handleDashboard = () => {
        handleCloseNavMenu();
        navigate(`/tableaudebord/${props.currentUser.id}`);
    }

    const handleHomepage = () => {
        handleCloseNavMenu();
        navigate(`/`);
    }

    const handleDashboardAdmin = () => {
        handleCloseNavMenu();
        navigate(`/tableaudebord/admin/${props.currentUser.id}`);
    }
    
    const pages = [
        {
            name: 'Accueil',
            function : handleHomepage
        },
        {
            name: 'Tableau de bord',
            function : handleDashboard
        }, 
        {
            name: 'Tableau de bord admin',
            function : handleDashboardAdmin
        }
    ];

  return (
    <AppBar position="static">
        <Toolbar disableGutters id={styles.toolbar}>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }} className={styles.smallScreen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                {pages.map((item, index) => (
                    <MenuItem key={index} onClick={item.function}>
                      <Typography textAlign="center">{item.name}</Typography>
                    </MenuItem>
                ))}

            </Menu>
          </Box>
        <Box sx={{flexGrow: 1, textAlign: "center" }} className={styles.smallScreen}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: "bold",
              color: 'inherit',
              textDecoration: 'none',
            }}
            className={styles.smallScreen}
          >
            Festival des jeux
          </Typography>
        </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 10,
              display: { xs: 'flex', md: 'none' },
              fontWeight: "bold",
              color: 'inherit',
              textDecoration: 'none',
            }}
            className={styles.wideScreen}
          >
            Festival des jeux
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className={styles.wideScreen} id={styles.boxPagesWideScreen}>
            {pages.map((item, index) => (
                <Button key={index} onClick={item.function} sx={{ my: 2, color: 'white', display: 'block' }}>{item.name}</Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Photo de profil" src={props.currentUser.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Déconnexion</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
    </AppBar>
  );
}