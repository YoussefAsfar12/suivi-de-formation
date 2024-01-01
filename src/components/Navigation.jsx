import { useState } from "react";
import {
  AppBar,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthProvider";
import MenuIcon from "@mui/icons-material/Menu";

const Navigation = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const getMenuButtons = () => {
    if (user) {
      const buttons = [
        { label: "Home", link: "/" },
      ];

      if (user.role === "Formateur") {
        buttons.push(
          { label: "Trainings Management", link: "/training-management" },
          { label: "Add Session", link: "/add-session" },
          { label: "My Formations", link: "/formations" }
        );
      } else if (user.role === "Participant") {
        buttons.push({ label: "Dashboard", link: "/dashboard" });
      }

      return buttons;
    }



    return [
      { label: "Home", link: "/" },
      { label: "Register", link: "/register" },
      { label: "Log In", link: "/login" },
    ];
  };

  return (
    <AppBar position="static">
      <Container >
        {isMobile ? (
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(!drawerOpen)}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Grid container justifyContent="flex-start" alignItems="center"  >
              
              {user&&(
                <Typography variant="body1">
                Bienvenue {user?.nom}
                </Typography>
              )}
            {getMenuButtons().map((button, index) => (
              <Button
                key={index}
                color="inherit"
                component={Link}
                sx={{margin:"10px 0"}}
                to={button.link}
                onClick={() => toggleDrawer(false)}
              >
                {button.label}
              </Button>
            ))}

            {user&& (
 <Button
 color="inherit"
 sx={{margin:"10px 0"}}
 onClick={logout}
>
 Log out
</Button>
            )}
          
          </Grid>
        )}


        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} >
          <List>
            {user &&(
              <ListItem>
              <Typography variant="body1">
              Bienvenue {user?.nom}
            </Typography>
            </ListItem>
            )}
            
            {getMenuButtons().map((button, index) => (
              <ListItem
                key={index}
                disablePadding
                component={Link}
                sx={{ textDecoration: 'none', color: 'inherit',width:"220px" }}
                to={button.link}
                onClick={toggleDrawer(false)}
              >
                <ListItem>
                  <ListItemText primary={button.label} />
                </ListItem>
              </ListItem>
              
            ))}
          
            {user&& (
            <ListItemButton onClick={logout} sx={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemText primary="Log out" />
          </ListItemButton>
            )}
          </List>
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Navigation;
