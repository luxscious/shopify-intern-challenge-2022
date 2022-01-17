import "./App.css";
import { AppBar, makeStyles } from "@material-ui/core";
import bg from "./assets/bg.svg";
import logo from "./assets/logo_white.svg";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "use-axios-client";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundImage: `url(${bg})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover ",
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: -1,
  },
  mask: {
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    margin: "auto",
    opacity: "50%",
    position: "fixed",
    zIndex: -1,
  },
  feed: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "50%",
    height: "100%",
    margin: "auto",
  },
  bar: {
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
  },
  logo: {
    width: 40,
    height: 40,
    display: "flex",
    padding: 10,
  },
}));

function subtractDays(date, days) {
  const temp = new Date(Number(date));
  temp.setDate(date.getDate() - days);
  const year = temp.getFullYear();
  const month = temp.getMonth() + 1;
  const day = temp.getDate();
  return year + "-" + month + "-" + day;
}

function App() {
  const classes = useStyles();
  const [startDate, setStartDate] = useState("2012-01-01");
  const [endDate, setEndDate] = useState("2012-01-01");
  const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loadRef = useRef();
  const fetchData = () => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [feed, setFeed] = useState([]);
  console.log(feed);
  const posts = 9;
  //Exessive loading, only do 10 dates at a time
  useEffect(() => {
    const end = new Date();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    const start = subtractDays(end, posts);
    setEndDate(endYear + "-" + endMonth + "-" + endDay);
    setStartDate(start);
    loadRef.current = 1;
  }, []);

  useEffect(() => {
    let array = feed;
    for (let i = 0; i < data?.length; i++) {
      array.push({
        date: data[i].date,
        title: data[i].title,
        url: data[i].url,
      });
    }
    setFeed(array);
  }, [data]);
  useEffect(() => {
    if (loadRef.current > 0) {
      fetchData();
    }
  }, [startDate, endDate]);

  const loadMore = () => {
    setStartDate(subtractDays(new Date(startDate), posts));
    setEndDate(subtractDays(new Date(endDate), posts));
  };
  return (
    <>
      <AppBar position="static" className={classes.bar}>
        <a
          href="/"
          style={{
            display: "flex",
            flexDirection: "row",
            textDecoration: "none",
            color: "white",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 16 }}>spacetagram</h1>
          <img src={logo} alt="logo" className={classes.logo} />
        </a>
      </AppBar>
      <div className={classes.container}>
        <div className={classes.mask}></div>
        <div className={classes.feed}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80%",
              }}
            >
              <CircularProgress style={{ color: "white" }} />
            </Box>
          ) : null}
          <button onClick={loadMore}>more</button>
        </div>
      </div>
    </>
  );
}

export default App;
