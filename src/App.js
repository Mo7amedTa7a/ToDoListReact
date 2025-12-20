import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import ToDoList from "./components/ToDoList";
import { ListTasksContext } from "./components/contexts/ListTasksContext";
// import {init} from './TasksAPI'
import { useState } from "react";
import { theme } from "./components/themeApp/ThemeContext";
import {TostProvider } from "./components/contexts/TostContext";

function App() {
  const [ListTasks, setListTasks] = useState([]);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <TostProvider>
          <ListTasksContext.Provider value={{ ListTasks, setListTasks }}>
            <ToDoList />
          </ListTasksContext.Provider>
        </TostProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
