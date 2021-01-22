import axios from "axios";

const methods = {
  // Gets all books
  getTasks: () => {
    return axios.get("/api/tasks");
  },
  // Saves a book to the database
  saveTask: (taskData) => {
    return axios.post("/api/tasks", taskData);
  }
}

export default methods;
