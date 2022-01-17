import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
}));

export default function ProjectCard(props) {
  const photo = props.photo.url;
  const title = props.photo.title;
  const date = props.photo.date;
  const classes = useStyles();
  return (
    <div style={{ paddingBottom: 20 }}>
      <Card className={classes.card} style={{ backgroundColor: "#C4C4C4" }}>
        <CardContent>
          <h1>{title}</h1>
          <h1>{date}</h1>
        </CardContent>
        <CardMedia
          component="img"
          height="466"
          image={photo}
          width="760"
          alt="project picture"
        />
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
