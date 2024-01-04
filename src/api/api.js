// api.js
import axios from 'axios';
// import { useAuth } from '../AuthContext/AuthProvider';
const API_BASE_URL = 'http://localhost:8000';



export const getUserFormations = async (user) => {
// console.log("getUserFormations");
  
  try {

      // const userData= await getUser(userId)
    // console.log(userData);

    const response = await axios.get(`${API_BASE_URL}/formations`);
    const allFormations = response.data;

    if (user && user.role =="Formateur"){

        const userFormations = allFormations.filter((formation) =>
        user.formationsEnseignees.includes(formation.id)
      );

        return userFormations;
    }
    if (user && user.role =="Participant"){

        const userFormations = allFormations.filter((formation) =>
        user.formationsInscrites.includes(formation.id)
      );
        return userFormations;
    }
  } catch (error) {
    console.error('Error fetching user formations', error);
    throw error; 
  }
};







// export const getUserFormations = async (userId) => {
//   try {
//     const userData = await getUser(userId);

//     if (userData && userData.role === "Formateur") {
//       const userFormationsPromises = userData.formationsEnseignees.map(async (formationId) => {
//         const formationResponse = await axios.get(`${API_BASE_URL}/formations?id=${formationId}`);
//         return formationResponse.data; // Assuming the relevant data is in formationResponse.data
//       });

//       const userFormations = await Promise.all(userFormationsPromises);
//       const flattenedFormations = userFormations.flat(); // Flatten the array of arrays
//       console.log(flattenedFormations);
//       return flattenedFormations;
//     }

//     if (userData && userData.role === "Participant") {
//       const userFormationsPromises = userData.formationsInscrites.map(async (formationId) => {
//         const formationResponse = await axios.get(`${API_BASE_URL}/formations?id=${formationId}`);
//         return formationResponse.data; // Assuming the relevant data is in formationResponse.data
//       });

//       const userFormations = await Promise.all(userFormationsPromises);
//       const flattenedFormations = userFormations.flat(); // Flatten the array of arrays
//       console.log(flattenedFormations);
//       return flattenedFormations;
//     }

//   } catch (error) {
//     console.error('Error fetching user formations', error);
//     throw error;
//   }
// };









export const addUser= async (user)=>{
  // console.log("getUser");

    try {
      await axios.post('http://localhost:8000/users', user);

      } catch (error) {
        console.error(error);
        throw error; 
      }
}
export const getUser= async (userId)=>{
  // console.log("getUser");

    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const userData = response.data;
        // console.log(userData)
        return userData;

      } catch (error) {
        console.error('Error fetching user ', error);
        throw error; 
      }
}


export const getFormationParticipants= async (formationId)=>{
  // console.log("getFormationParticipants");
  
  try {
      const users = await getUsers();
      
      const participants=users.filter((user)=>{
        return user.role==="Participant" && user?.formationsInscrites?.includes(Number(formationId));
      })
      return participants;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}
export const getFormationSessions= async (formationId)=>{
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions?codeForm=${formationId}`);
    const formationSessions = response.data;
      return formationSessions;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}

export const postSession = async (session) => {
  // console.log("postSession");

  try {
    // console.log(session);
    await axios.post(`${API_BASE_URL}/sessions`, session);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const AddFormation = async (formation, updateUser, user) => {
  try {
    // console.log(session);
    const response = await axios.post(`${API_BASE_URL}/formations`, formation);

    const newFormationId = response.data.id;
    
      const updatedUser = {
        ...user,
        formationsEnseignees: [...user.formationsEnseignees, newFormationId]
      };
      // console.log(updatedUser);
    updateUser(updatedUser);
  } catch (error) {
    console.error(error);
    throw error;
  }
};





export const DeleteFormation = async (formationId, updateUser, user) => {
  try {
    // Delete the formation
    await axios.delete(`${API_BASE_URL}/formations/${formationId}`);

    // Fetch sessions with the same codeForm (formationId)
    const response = await axios.get(`${API_BASE_URL}/sessions?codeForm=${formationId}`);
    const sessionsToDelete = response.data;

    // Delete each session
    const deleteSessionPromises = sessionsToDelete.map(async (session) => {
      await axios.delete(`${API_BASE_URL}/sessions/${session.id}`);
    });

    await Promise.all(deleteSessionPromises);

    const updatedFormationsEnseignees = user.formationsEnseignees.filter((id) => id !== formationId);
    const updatedUser = {
      ...user,
      formationsEnseignees: updatedFormationsEnseignees
    };
    updateUser(updatedUser);
  } catch (error) {
    console.error(error);
    throw error;
  }
};




export const UpdateUser= async (updatedUser)=>{
  // localStorage.setItem('user', JSON.stringify(updatedUser));
  // console.log("UpdateUser");

  try {
      await axios.put(`http://localhost:8000/users/${updatedUser.id}`, updatedUser);
      
      
      
    } catch (error) {
      console.error( error);
      throw error; 
    }
}




export const getUserEnrolledFormations= async (user)=>{
  try {
     
        const allFormations = await getFormations();
        const userEnrolledFormations = allFormations?.filter((formation) =>
        user.formationsInscrites?.includes(formation.id)
        )
        // console.log(userEnrolledFormations)

        return userEnrolledFormations;
    
      
    } catch (error) {
      console.error( error);
      throw error; 
    }
}




export const enrollFormation= async (user,formationId )=>{
  // console.log("getSessions");
  
  try {
    const response=await axios.put(`http://localhost:8000/users/${user.id}`, {
      ...user,
      formationsInscrites: [...user.formationsInscrites, formationId],
    });
      const updatedUser= response.data;
      return updatedUser;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}
export const addComment= async (formationId,specificTraining,user,comment,rating )=>{
  // console.log("getSessions");
  
  try {
    await axios.put(`http://localhost:8000/formations/${formationId}`, {
      ...specificTraining,
      evaluations: [
        ...(specificTraining.evaluations || []),
        { userId: user.id, username: user.nom, commentaire: comment, note: rating },
      ],
    });

    } catch (error) {
      console.error( error);
      throw error; 
    }
}



export const getUserByEmail= async (email)=>{
  // console.log("getSessions");
  
  try {
    const response = await axios.get(`http://localhost:8000/users?email=${email}`);
    const user = response.data
      return user;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}
export const getFormationByTitre= async (titre)=>{
  console.log(titre);
  
  try {
    const response = await axios.get(`http://localhost:8000/formations?titre=${titre}`);
    const formation = response.data
    console.log(formation);
    // console.log(formation);
      return formation;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}
export const getUserByName= async (name)=>{
  // console.log("getSessions");
  
  try {
    const response = await axios.get(`http://localhost:8000/users?email=${name}`);
    const user = response.data
      return user;
    } catch (error) {
      console.error( error);
      throw error; 
    }
}

export const getSessions= async ()=>{
  // console.log("getSessions");
  
  try {
      const reponse = await axios.get(`${API_BASE_URL}/sessions`);
      const sessions = reponse.data;
      return sessions;
      
    } catch (error) {
      console.error( error);
      throw error; 
    }
}


export const getUsers= async ()=>{
  // console.log("getUsers");
  
  try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      const users = response.data;

      return users;
      
    } catch (error) {
      console.error( error);
      throw error; 
    }
}
export const getFormations= async ()=>{
  // console.log("getFormations");

  try {
      const response = await axios.get(`${API_BASE_URL}/formations`);
      
      const formations = response.data;
      return formations;

    } catch (error) {
      console.error( error);
      throw error; 
    }
}

export const updateFormation= async (formation)=>{
  // console.log("getFormations");

  try {
    const forma= await getFormation(formation.id);
    // console.log(forma[0].evaluations);
     await axios.put(`http://localhost:8000/formations/${formation.id}`, {...formation,evaluations:forma.evaluations});
    // console.log()
    } catch (error) {
      console.error( error);
      throw error; 
    }
}

export const getFormation= async (formationId)=>{

  try {
      const response = await axios.get(`${API_BASE_URL}/formations/${formationId}`);
      const formation= response.data;
      return formation;

    } catch (error) {
      console.error( error);
      throw error; 
    }
}
