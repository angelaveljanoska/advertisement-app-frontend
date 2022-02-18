import {
  Card,
  CardActionArea,
  CardContent,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Advertisement } from "../Advertisements/Advertisements";

function Details() {
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState<Advertisement>();
  const theme = useTheme();

  const loginData = JSON.parse(
    localStorage.getItem("login") ?? JSON.stringify({}),
  );

  const ratedAdvertisementsIds =
    JSON.parse(
      localStorage.getItem("ratedAdvertisementsIds") ?? JSON.stringify({}),
    ) ?? [];

  const fetchAdvertisement = async () => {
    try {
      const req = await fetch(`http://localhost:8080/advertisement/${id}`, {
        method: "GET",
      });
      const res = await req.json();
      console.log(res);
      setAdvertisement(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdvertisement();
  }, []);

  const advertisementRating = useMemo(
    () =>
      // eslint-disable-next-line no-unsafe-optional-chaining
      advertisement?.ratings.reduce((acc, curr) => acc + curr.score, 0)!! /
      // eslint-disable-next-line no-unsafe-optional-chaining
      advertisement?.ratings.length!!,
    [advertisement],
  );

  const checkRatingDisabled = useMemo(() => {
    if (advertisement?.creatorUsername === loginData.username) {
      return true;
    }
    if (!ratedAdvertisementsIds[loginData.id]) {
      return false;
    }
    return (
      ratedAdvertisementsIds[loginData.id].includes(
        advertisement?.id ?? -1,
        0,
      ) || advertisement?.id === loginData.id
    );
  }, [advertisement, ratedAdvertisementsIds]);

  const handleRate = async (e: React.SyntheticEvent, value: number | null) => {
    try {
      const req = await fetch(
        `http://localhost:8080/advertisement/${id}/rating`,
        {
          method: "POST",
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      localStorage.setItem(
        "ratedAdvertisementsIds",
        JSON.stringify({
          ...ratedAdvertisementsIds,
          [loginData.id]: [
            ...(ratedAdvertisementsIds[loginData.id] ?? []),
            advertisement?.id,
          ],
        }),
      );
      fetchAdvertisement();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        width: "clamp(80%, 1000px, 95%)",
        height: "clamp(80%, 800px, 95%)",
      }}
      style={{
        boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.66)",
        backgroundColor: "#eeeeee",
        padding: "5px",
        borderRadius: "10px",
      }}
    >
      <CardActionArea
        disableRipple
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            height: "95%",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "4fr 1fr 3fr",
            gridColumnGap: "0px",
            gridRowGap: "0px",
            "&:hover": {
              cursor: "default",
            },
          }}
        >
          <div style={{ display: "flex", height: "350px" }}>
            <img
              src={advertisement?.imageUrl}
              alt="Advertisement"
              style={{ height: "100%", margin: "auto" }}
            />
          </div>
          <Typography
            variant="h3"
            component="div"
            sx={{
              color: theme.palette.secondary.contrastText,
              fontFamily: "Lexend Deca",
              fontWeight: "400",
            }}
          >
            {advertisement?.name}
          </Typography>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                color: theme.palette.secondary.contrastText,
                fontFamily: "Lexend Deca",
                fontWeight: "400",
              }}
            >
              {advertisement?.description}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  color: theme.palette.secondary.contrastText,
                  fontFamily: "Lexend Deca",
                  fontWeight: "400",
                  marginRight: "auto",
                  marginTop: "auto",
                  width: "50%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Created by: {advertisement?.creatorUsername}
              </Typography>
              <Rating
                disabled={checkRatingDisabled}
                name="rating"
                value={advertisementRating ?? 0}
                onChange={handleRate}
                size="large"
                precision={0.25}
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "auto",
                }}
              />
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: theme.palette.secondary.contrastText,
                  fontFamily: "Lexend Deca",
                  fontWeight: "400",
                  marginLeft: "auto",
                  marginTop: "auto",
                  width: "50%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {advertisement?.price}
              </Typography>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Details;
