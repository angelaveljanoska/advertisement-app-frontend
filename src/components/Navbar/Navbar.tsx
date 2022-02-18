import { AppBar, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StyledButton } from "../../utility/themes";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.split("/")[1].toUpperCase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginData = localStorage.getItem("login")
      ? JSON.parse(localStorage.getItem("login")!!)
      : null;
    setIsLoggedIn(!!loginData);
  }, [pageName]);

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            marginRight: "auto",
            fontFamily: "Lexend Deca",
            fontWeight: "900",
          }}
        >
          {pageName}
        </Typography>
        {isLoggedIn ? (
          <div>
            <Link to="/advertisements">
              <StyledButton>Advertisements</StyledButton>
            </Link>
            <StyledButton onClick={handleLogout}>Log out</StyledButton>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <StyledButton>Login</StyledButton>
            </Link>
            <Link to="/register">
              <StyledButton>Register</StyledButton>
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
