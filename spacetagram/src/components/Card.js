import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Cookies from "universal-cookie";
const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    margin: "auto",
    backgroundColor: "white",
  },
}));

export default function ProjectCard(props) {
  const photo = props.photo.url;
  const title = props.photo.title;
  const date = props.photo.date;
  const classes = useStyles();
  const cookies = new Cookies();
  const [isClick, setClick] = useState(false);
  useEffect(() => {
    let prevChecked = cookies.get("liked").indexOf(date) > -1;
    setClick(prevChecked);
  }, []);

  return (
    <div style={{ paddingBottom: 20 }}>
      <Card className={classes.card} style={{ borderRadius: 0, padding: 0 }}>
        <CardContent
          style={{
            height: 10,

            padding: 10,
          }}
        >
          <h1
            style={{
              fontSize: 14,
              fontFamily: "Segoe UI",
              color: "black",
              //textAlign: "center",
              margin: 0,
              fontWeight: "normal",
              fontStyle: "italic",
            }}
          >
            "{title}"
          </h1>
        </CardContent>
        <CardMedia
          style={{
            paddingTop: 10,
          }}
          component="img"
          image={photo}
          alt="project picture"
        ></CardMedia>

        <CardContent
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 0,
            paddingTop: 0,
          }}
        >
          <Checkbox
            icon={<FavoriteBorder />}
            checked={isClick}
            checkedIcon={<Favorite />}
            onClick={() => {
              setClick(!isClick);
              if (!isClick) {
                let updatedCookie = cookies.get("liked");
                updatedCookie.push(date);
                cookies.set("liked", updatedCookie, { path: "/" });
              } else {
                let cookie = cookies.get("liked");
                let updatedCookie = cookie.filter((x) => {
                  return x !== date;
                });
                cookies.set("liked", updatedCookie, { path: "/" });
              }
            }}
          />

          <h1
            style={{
              fontWeight: "normal",
              fontSize: 14,
              fontFamily: "Segoe UI",
              color: "black",
            }}
          >
            {date}
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}
