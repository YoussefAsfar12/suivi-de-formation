import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Rating,
  Grid,
} from "@mui/material";
import { useAuth } from "../AuthContext/AuthProvider";
import { addComment, enrollFormation, getFormation } from "../api/api";

const TrainingDetailPage = () => {
  const { id } = useParams();
  const [formation, setFormation] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const { user,updateUser } = useAuth();

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        const formationData = await getFormation(id);
        setFormation(formationData);
      } catch (error) {
        console.error("Error fetching training details", error);
      }
    };

    fetchTrainingDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      const checkUserEnroll = user?.formationsInscrites?.includes(
        parseInt(formation?.id, 10)
      );
      setIsEnrolled(checkUserEnroll);
    };

    if (formation) {
      fetchUserData();
    }
    


  }, [formation, user?.formationsInscrites]);

  const handleEnroll = async (trainingId) => {
    try {
      const isEnrolled = user.formationsInscrites.includes(trainingId);

      if (!isEnrolled) {
        const updatedUser= await enrollFormation(user,trainingId)
        setIsEnrolled(true);
        updateUser(updatedUser)
      }
    } catch (error) {
      console.error("Enrollment failed", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await addComment(id,formation,user,comment,rating)
      const formationData= await getFormation(id);
      setFormation(formationData);
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  return (
    <div>
      <h1>Détail de la formation</h1>
      {formation ? (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {formation.titre}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Disponibilité:{" "}
              {formation.disponible ? "Disponible" : "Non disponible"}
            </Typography>


            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEnroll(formation.id)}
              disabled={!formation.disponible  || isEnrolled}
              readOnly={!formation.disponible}
              style={{ marginTop: "16px", display:!formation.disponible}}
            >
              { isEnrolled
                ? "Enrolled"
                : "S'inscrire"}
            </Button>

            <Grid container spacing={2} style={{ marginTop: "16px" }}>
              <Grid item xs={12}>
                <Typography variant="h6">Commentaires</Typography>
              </Grid>
              {formation.evaluations?.map((evaluation, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2">
                        Commentaire de {evaluation.username}:
                      </Typography>
                      <Typography>{evaluation.commentaire}</Typography>
                      <Rating value={evaluation.note} readOnly />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <TextField
              label="Votre Commentaire"
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ marginTop: "16px" }}
            />

            <Rating
              name="rating"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => setRating(newValue)}
              style={{ marginTop: "16px" }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              style={{ marginTop: "16px" }}
            >
              Soumettre le Commentaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p>Formation non trouvée</p>
      )}
    </div>
  );
};

export default TrainingDetailPage;
