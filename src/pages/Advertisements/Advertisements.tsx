import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StyledButton } from "../../utility/themes";

const StyledImage = styled("img")(({ theme }) => ({
  height: "80%",
  borderRadius: "2px",
}));

interface ConditionalLinkBaseProps {
  to: string;
  condition: boolean;
}

type ConditionalLinkProps = PropsWithChildren<ConditionalLinkBaseProps>;

const ConditionalLink = ({ children, to, condition }: ConditionalLinkProps) =>
  !!condition && to ? <Link to={to}>{children}</Link> : <>{children}</>;

export interface Advertisement {
  id?: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  datePosted: string;
  status: string;
  ratings:
    | {
        id: number;
        score: number;
      }[];
  creatorUsername: string;
}

function Advertisements() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  const [checked, setChecked] = useState(false);
  const [filter, setFilter] = useState("");

  const [stopLinking, setStopLinking] = useState(false);

  const theme = useTheme();

  const fetchAdvertisements = async () => {
    try {
      const req = await fetch("http://localhost:8080/advertisement", {
        method: "GET",
      });
      const res = await req.json();
      setAdvertisements(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
    const userData = JSON.parse(localStorage.getItem("login") ?? "");
    if (userData) {
      setIsAdmin(userData.role === "ADMIN");
    }
  }, []);

  useEffect(() => {
    if (filter === "priceAsc") {
      setAdvertisements((prev) =>
        [...prev].sort(
          (a, b) =>
            parseInt(a.price.slice(1), 10) - parseInt(b.price.slice(1), 10),
        ),
      );
    } else if (filter === "priceDesc") {
      setAdvertisements((prev) =>
        [...prev].sort(
          (a, b) =>
            parseInt(b.price.slice(1), 10) - parseInt(a.price.slice(1), 10),
        ),
      );
    } else if (filter === "dateAsc") {
      setAdvertisements((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime(),
        ),
      );
    } else if (filter === "dateDesc") {
      setAdvertisements((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
        ),
      );
    }
  }, [filter]);

  const handleToggle = () => {
    setChecked((prev) => !prev);
  };

  const handleChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number | undefined,
  ) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    try {
      const req = await fetch(`http://localhost:8080/advertisement/${id}`, {
        method: "PUT",
        body: JSON.stringify(target.value),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      fetchAdvertisements();
      setStopLinking(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getBackgroundColor = (element: Advertisement) => {
    if (element.status === "APPROVED") {
      return "#fffff0";
    }
    if (element.status === "PENDING") {
      return "#dddddd";
    }
    return "#bbbbbb";
  };

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          height: "15%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItem disablePadding sx={{ width: "30%" }}>
          <ListItemButton role={undefined} onClick={handleToggle} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": "check" }}
              />
            </ListItemIcon>
            <ListItemText id="check" primary="Only active listings" />
          </ListItemButton>
        </ListItem>
        <FormControl sx={{ width: "40%" }}>
          <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Age"
            onChange={handleChange}
            sx={{ color: theme.palette.secondary.contrastText }}
          >
            <MenuItem
              value="dateAsc"
              sx={{ color: theme.palette.secondary.contrastText }}
            >
              Date Ascending
            </MenuItem>
            <MenuItem
              value="dateDesc"
              sx={{ color: theme.palette.secondary.contrastText }}
            >
              Date Descending
            </MenuItem>
            <MenuItem
              value="priceAsc"
              sx={{ color: theme.palette.secondary.contrastText }}
            >
              Price Ascending
            </MenuItem>
            <MenuItem
              value="priceDesc"
              sx={{ color: theme.palette.secondary.contrastText }}
            >
              Price Descending
            </MenuItem>
          </Select>
        </FormControl>
        <Link to="new">
          <StyledButton
            sx={{
              width: "100%",
              height: "100%",
              fontSize: "1em",
              fontFamily: "Lexend Deca",
            }}
          >
            Add new listing
          </StyledButton>
        </Link>
      </Box>
      <List
        sx={{
          width: "80%",
          height: "100%",
          bgcolor: "background.paper",
          padding: "30px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.66)",
          overflowY: "scroll",
        }}
      >
        {advertisements
          .filter((el) => (checked ? el.status === "APPROVED" : true))
          .map((element) => (
            <ConditionalLink
              condition={element.status === "APPROVED" && !stopLinking}
              to={`${element.id}`}
            >
              <ListItem
                key={element.id}
                alignItems="flex-start"
                sx={{
                  height: "250px",
                  width: "100%",
                  borderRadius: "2px",
                  boxShadow: "0px 0px 3px 1px rgba(0,0,0,0.66)",
                  transition: "0.1s all ease-out",
                  padding: "20px",
                  backgroundColor: getBackgroundColor(element),
                  ":hover":
                    element.status === "APPROVED"
                      ? {
                          cursor: "pointer",
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        }
                      : {
                          cursor: "default",
                        },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "200px",
                    height: "90%",
                    marginRight: "25px",
                  }}
                >
                  <StyledImage src={element.imageUrl} alt="Advertisement" />
                  <Typography
                    component="div"
                    variant="h5"
                    color="primary.secondary.contrastText"
                    sx={{ fontFamily: "Lexend Deca", fontWeight: "800" }}
                  >
                    {element.price}
                  </Typography>
                  {element.status === "PENDING" && isAdmin && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <StyledButton
                        value="APPROVED"
                        sx={{
                          margin: 0,
                          backgroundColor: theme.palette.success.main,
                        }}
                        onClick={(e) => handleClick(e, element.id)}
                        onMouseOver={() => setStopLinking(true)}
                        onMouseLeave={() => setStopLinking(false)}
                      >
                        Approve
                      </StyledButton>
                      <StyledButton
                        value="DECLINED"
                        sx={{
                          margin: 0,
                          backgroundColor: theme.palette.error.main,
                        }}
                        onClick={(e) => handleClick(e, element.id)}
                        onMouseOver={() => setStopLinking(true)}
                        onMouseLeave={() => setStopLinking(false)}
                      >
                        Decline
                      </StyledButton>
                    </div>
                  )}
                </div>
                <ListItemText
                  sx={{ width: "70%", height: "60%" }}
                  primary={
                    <Typography
                      sx={{
                        display: "inline",
                        fontFamily: "Lexend Deca",
                        fontWeight: "500",
                      }}
                      component="span"
                      variant="h3"
                    >
                      {element.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="div"
                      variant="h6"
                      color="primary.secondary.contrastText"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      {element.description}
                      <div style={{ display: "flex" }}>
                        <Typography
                          component="div"
                          variant="body1"
                          color="primary.secondary.contrastText"
                          sx={{ marginRight: "auto" }}
                        >
                          {new Date(element.datePosted).toLocaleString()}
                        </Typography>
                        <Typography
                          component="div"
                          variant="body1"
                          color="primary.secondary.contrastText"
                          sx={{ marginLeft: "auto", marginRight: "30px" }}
                        >
                          Rating:{" "}
                          {element.ratings.length > 0
                            ? element.ratings.reduce(
                                (acc, curr) => acc + curr.score,
                                0,
                              ) / element.ratings.length
                            : "No ratings yet"}
                        </Typography>
                      </div>
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </ConditionalLink>
          ))}
      </List>
    </Box>
  );
}

export default Advertisements;
