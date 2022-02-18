import { Box, styled, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../utility/themes";

interface Input {
  username: string;
  password: string;
  secondPassword: string;
}

interface ValidationErrors {
  username: string;
  password: string;
  secondPassword: string;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  width: "100%",
  margin: "10px",
  borderRadius: "5px",
}));

function Register() {
  const [input, setInput] = useState<Input>({
    username: "",
    password: "",
    secondPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: "",
    password: "",
    secondPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prevState: Input) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (input.username.length < 4) {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        username: "Username must have at least 4 characters!",
      }));
    } else {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        username: "",
      }));
    }
  }, [input.username]);

  useEffect(() => {
    if (input.password.length < 8) {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        password: "Password must have at least 8 characters!",
      }));
    } else {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  }, [input.password]);

  useEffect(() => {
    if (input.password !== input.secondPassword) {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        secondPassword: "Passwords must match!",
      }));
    } else {
      setValidationErrors((prevErrors: ValidationErrors) => ({
        ...prevErrors,
        secondPassword: "",
      }));
    }
  }, [input.password, input.secondPassword]);

  const disableSubmit = useCallback(() => {
    return Object.values(validationErrors).some((validationError) => {
      return validationError.length > 0;
    });
  }, [validationErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const req = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const res = await req.json();
      navigate("/login");
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
        width: "clamp(70%, 750px, 90%)",
        height: "clamp(60%, 600px, 90%)",
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
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "repeat(3, 1fr) 1.25fr",
          gridColumnGap: "0px",
          gridRowGap: "0px",
          width: "85%",
          height: "70%",
        }}
      >
        <StyledTextField
          error={validationErrors.username.length > 0}
          helperText={validationErrors.username}
          name="username"
          label="Username"
          variant="filled"
          value={input.username}
          onChange={handleChange}
        />
        <StyledTextField
          error={validationErrors.password.length > 0}
          helperText={validationErrors.password}
          name="password"
          label="Password"
          type="password"
          variant="filled"
          value={input.password}
          onChange={handleChange}
        />
        <StyledTextField
          error={validationErrors.secondPassword.length > 0}
          helperText={validationErrors.secondPassword}
          name="secondPassword"
          label="Confirm Password"
          type="password"
          variant="filled"
          value={input.secondPassword}
          onChange={handleChange}
        />
        <StyledButton
          disabled={disableSubmit()}
          type="submit"
          sx={{ width: "100%", height: "2em", fontSize: "2em" }}
        >
          Register
        </StyledButton>
      </Box>
    </Box>
  );
}

export default Register;
