import "./App.css";
import { AppBar, makeStyles } from "@material-ui/core";
import bg from "./assets/bg.svg";
import logo from "./assets/logo_white.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import Card from "./components/Card.js";
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
    overflow: "auto",
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
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  items: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    margin: "auto",
    width: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 65,
    paddingTop: 50,
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
function RenderList(list) {
  return list.map((x) => {
    return <Card key={x.date} photo={x} />;
  });
}

const App = () => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [feed, setFeed] = useState([]);

  const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRef = useRef(1);
  const listInnerRef = useRef();

  //Api call can timeout with too many posts, only do 9 posts at a time
  const posts = 9;

  const fetchData = useCallback(() => {
    if (startDate && endDate) {
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
          loadRef.current++;
        });
    }
  }, [url]);

  //initialize start and end states
  useEffect(() => {
    const end = new Date();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    const start = subtractDays(end, posts);
    setEndDate(endYear + "-" + endMonth + "-" + endDay);
    setStartDate(start);
  }, []);

  //update feed array whenever data is updated
  useEffect(() => {
    let array = feed;
    for (let i = data?.length - 1; i >= 0; i--) {
      const found = array.some((el) => el.date === data[i].date);
      if (!found) {
        array.push({
          date: data[i].date,
          title: data[i].title,
          url: data[i].url,
        });
      }
    }
    setFeed(array);
  }, [data]);

  //Fetch data whenever start date state changes
  useEffect(() => {
    fetchData();
  }, [fetchData, startDate]);

  //Load more posts
  const loadMore = () => {
    const temp = new Date(startDate);
    temp.setDate(temp.getDate() - 1);
    const year = temp.getFullYear();
    const month = temp.getMonth() + 1;
    const day = temp.getDate();

    //Set date to previous start date, decrease start date by posts
    setEndDate(year + "-" + month + "-" + day);
    setStartDate(subtractDays(new Date(startDate), posts));
  };

  //loads more posts if user gets to bottom of page
  const handleScroll = (e) => {
    const el = document.querySelector("#container");
    const scroll = el.scrollHeight - el.scrollTop;
    const client = el.clientHeight;
    const diff = Math.abs(parseInt(scroll - client));
    const bottom = diff <= 2;
    if (bottom) {
      loadMore();
    }
  };
  return (
    <>
      {!data ? (
        <Box
          sx={{
            height: "80%",
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <CircularProgress style={{ color: "white" }} />
        </Box>
      ) : null}
      <AppBar position="fixed" className={classes.bar}>
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
      <div id="container" className={classes.container} onScroll={handleScroll}>
        <div className={classes.mask}></div>
        <div className={classes.feedContainer}>
          <div className={classes.items}>
            {RenderList(feed)}
            {loading && data ? (
              <Box sx={{}}>
                <CircularProgress style={{ color: "white" }} />
              </Box>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
