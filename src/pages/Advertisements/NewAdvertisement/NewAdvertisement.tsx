import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../../utility/themes";
import { StyledTextField } from "../../Login/Login";

interface Input {
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
}

const NewAdvertisement = () => {
  const userData = JSON.parse(localStorage.getItem("login") ?? "");
  const navigate = useNavigate();

  const [input, setInput] = useState<Input>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userData) throw Error("No user!");
      const req = await fetch("http://localhost:8080/advertisement", {
        method: "POST",
        body: JSON.stringify({
          ...input,
          creatorUsername: userData.username,
          price: `$${input.price}`,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const res = await req.json();
      navigate("/advertisements");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(
      (prevState): Input => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }),
    );
  };

  const isDisabled = useMemo(() => input.name.length < 2, [input.name]);

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
        width: "clamp(60%, 750px, 95%)",
        height: "clamp(40%, 600px, 100%)",
        backgroundColor: "#dddddd",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.66)",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: "Lexend Deca",
          fontWeight: "600",
          marginBottom: "auto",
        }}
      >
        New listing
      </Typography>
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
          error={isDisabled}
          helperText={isDisabled ? "Name must have at least 2 characters!" : ""}
          name="name"
          label="Listing name"
          variant="filled"
          onChange={handleChange}
          value={input.name}
        />
        <StyledTextField
          name="description"
          label="Description"
          variant="filled"
          onChange={handleChange}
          value={input.description}
        />
        <StyledTextField
          name="price"
          type="number"
          label="Price (in USD)"
          variant="filled"
          onChange={handleChange}
          value={input.price}
        />
        <StyledTextField
          name="imageUrl"
          label="Image URL"
          variant="filled"
          onChange={handleChange}
          value={input.imageUrl}
        />
        <StyledButton
          type="submit"
          sx={{ width: "100%", height: "2em", fontSize: "2em" }}
          disabled={isDisabled}
        >
          Create listing
        </StyledButton>
      </Box>
    </Box>
  );
};

export default NewAdvertisement;
