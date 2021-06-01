import axios from "axios";

const methods = {
  // Gets all boards
  getBoards: () => {
    return axios.get("/api/boards");
  },
  getTeamUserBoards: teamName => {
    return axios.get("/api/team/boards/" + teamName)
  },
  // Gets task board of logged in user
  getUserBoard: (id) => {
    return axios.get("/api/boards/" + id);
  },
  // Updates current task list
  updateUserBoard: (taskData) => {
    return axios.put("/api/boards/" + taskData._id, taskData);
  }, 
  // Creates new task board
  createBoard: (taskData) => {
    return axios.post("/api/boards", taskData);
  },
  deleteBoard: id => {
    return axios.delete("/api/boards/" + id);
  }
}

export default methods;
