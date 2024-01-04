
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Registration from "./auth/Registration";
import Login from "./auth/Login";
import TrainingCatalog from "./components/TrainingCatalog";
import TrainerManagementPage from "./components/trainerDashboard/TrainerManagementPage";
import { Navigate } from "react-router-dom";
import TrainingDetailPage from "./components/TrainingDetailPage";
import UserDashboard from "./components/UserDashbord";
import AddSessionForm from "./components/trainerDashboard/AddSession";
import ParticipantsList from "./components/TrainerDashboard/ParticipantsList";
import FormationsList from "./components/trainerDashboard/FormationsList";
import FormationSessions from "./components/trainerDashboard/FormationSessions";
import Navigation from "./components/Navigation";
import { useAuth } from "./AuthContext/AuthProvider";
const App = () => {
  return (
      <Router>
        <Navigation />
        <Routes>
        <Route path="/training/:id" element={<TrainingDetailPage />} />
        <Route path="/sessions/:id" element={<FormationSessions />} />
        <Route path="/:id/participants" element={<ParticipantsList />} />
        <Route path="/formations" element={<FormationsList />} />
        
          <Route path="/" element={<TrainingCatalog />} />
          <Route path="*" element={<h1>not found</h1>} />
          
          <Route element={<GuestPrivateRoutes />}>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<FormateurPrivateRoutes />}>
            <Route element={<AddSessionForm />} path="/add-session"  />
            <Route element={<TrainerManagementPage />} path="/training-management"/>
          </Route>
          <Route element={<ParticipantPrivateRoutes />}>
            <Route element={<UserDashboard />} path="/dashboard"/>
          </Route>
        </Routes>
      </Router>
  );
};

const GuestPrivateRoutes = () => {
  const { user, userLoaded } = useAuth();
  if (userLoaded) {
    return !user ? <Outlet /> : <Navigate to="/"  />;
  }
};


const FormateurPrivateRoutes = () => {
  const { user, userLoaded } = useAuth();
  if (userLoaded) {
    const isFormateur = user && user.role === 'Formateur';
    return isFormateur ? <Outlet /> : <Navigate to="/" replace />;
    
}
};


const ParticipantPrivateRoutes = () => {
  const { user, userLoaded } = useAuth();
  if (userLoaded) {
    const isParticipant= user && user.role === "Participant";
  return isParticipant ? <Outlet /> : <Navigate to="/" replace />;
  }
};

export default App;
