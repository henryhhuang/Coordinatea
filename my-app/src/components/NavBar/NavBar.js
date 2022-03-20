import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublicIcon from '@mui/icons-material/Public';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log("Logout");
    const requestOptions = {
      credentials: 'include'
    }
    fetch('http://localhost:5001/signout', requestOptions).then(res => console.log(res))
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              COORDINATE
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
              <Link to="/home" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Home</Typography>
                </MenuItem>
              </Link>
              <Link to="/following" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Following</Typography>
                </MenuItem>
              </Link>
              <Link to="/discover" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Discover</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          ><Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
              COORDINATE</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Button sx={{ my: 2, display: 'flex', color: 'white' }} >
                <HomeIcon sx={{ mr: 1 }} />
                <Typography>Home</Typography>
              </Button>
            </Link>
            <Link to="/following" style={{ textDecoration: 'none' }}>
              <Button sx={{ my: 2, display: 'flex', color: 'white' }} >
                <FavoriteIcon sx={{ mr: 1 }} />
                <Typography>Following</Typography>
              </Button>
            </Link>
            <Link to="/discover" style={{ textDecoration: 'none' }}>
              <Button sx={{ my: 2, display: 'flex', color: 'white' }} >
                <PublicIcon sx={{ mr: 1 }} />
                <Typography>Discover</Typography>
              </Button>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar><AccountCircleIcon /></Avatar>
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
              <Link to="/profile" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Profile</Typography>
                </MenuItem>
              </Link>
              <Link to="/signup" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Sign Up</Typography>
                </MenuItem>
              </Link>
              <Link to="/signin" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem>
                  <Typography>Sign In</Typography>
                </MenuItem>
              </Link>
              <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
