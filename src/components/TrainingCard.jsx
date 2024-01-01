import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const TrainingCard = ({ training }) => {
  // eslint-disable-next-line react/prop-types
  const { id, titre, domaine, niveau, description, disponible } = training;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {titre}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Domaine: {domaine}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Niveau: {niveau}
        </Typography>
        <Typography variant="body1" paragraph>
          {description}
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          Disponibilité: {disponible ? "Disponible" : "Non disponible"}
        </Typography>

        <Button variant="contained" color="primary">
          <Link
            to={`/training/${id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            détails
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainingCard;
