import { Box, styled, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../utility/themes";

export interface Input {
  username: string;
  password: string;
}

export const StyledTextField = styled(TextField)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  width: "100%",
  margin: "10px",
  borderRadius: "5px",
}));

function Login() {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prevState: Input) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const req = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const res = await req.json();
      localStorage.setItem(
        "login",
        JSON.stringify({ id: res.id, username: res.username, role: res.role }),
      );
      navigate("/advertisements");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "750px",
        height: "600px",
        backgroundColor: "#dddddd",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.66)",
      }}
    >
      <img
        src="/logo.png"
        alt="logo"
        style={{ height: "auto", width: "clamp(50%, 450px, 90%)" }}
      />
      <Box
        component="div"
        sx={{
          marginBottom: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "85%",
        }}
      >
        <StyledTextField
          name="username"
          label="Username"
          variant="filled"
          value={input.username}
          onChange={handleChange}
        />
        <StyledTextField
          name="password"
          label="Password"
          type="password"
          variant="filled"
          value={input.password}
          onChange={handleChange}
        />
        <StyledButton
          type="submit"
          sx={{ width: "100%", height: "2em", fontSize: "2em" }}
        >
          Log in
        </StyledButton>
      </Box>
    </Box>
  );
}

export default Login;
