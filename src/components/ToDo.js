import { Card, Grid, IconButton, Typography } from "@mui/material";
// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import React, { useContext } from "react";
import { ListTasksContext } from "./contexts/ListTasksContext";
import { useTost } from "./contexts/TostContext";

const ToDo = ({ task, OpenAlert }) => {
  const { clickSnack } = useTost();
  const { ListTasks, setListTasks } = useContext(ListTasksContext);
  const handelCheck = () => {
    const filterTask = ListTasks.map((t) => {
      if (task.id === t.id) {
        t.isComplite = !t.isComplite;
      }
      return t;
    });
    localStorage.setItem("ListTask", JSON.stringify(filterTask));
    setListTasks(filterTask);
    clickSnack(task.isComplite ? "تم إتمام المهمة" : "تم إلغاء إتمام المهمة");
  };
  // Dialog
  function handelOpenAlert(action) {
    OpenAlert(action, task);
  }
  //-- Dialog
  return (
    <>
      <Card
        className="cardToDo"
        sx={{
          minWidth: 200,
          marginTop: "20px",
          bgcolor: `${task.isComplite ? "#597eb6ff" : "primary.main"}`,
          padding: "10px 20px",
          color: "#fff",
        }}
      >
        <Grid container>
          <Grid size={9} sx={{ textAlign: "start" }}>
            <Typography
              sx={{
                fontSize: 30,
                textDecoration: task.isComplite ? "line-through" : "none",
              }}
            >
              {task.title}{" "}
            </Typography>
            <Typography sx={{ fontSize: 20 }}> {task.description} </Typography>
          </Grid>
          <Grid
            size={3}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <IconButton
              className="icons"
              sx={{
                color: task.isComplite ? "#fff" : "#0a791cff",
                border: `1px solid  ${task.isComplite ? "#fff" : "#0a791cff"}`,
                bgcolor: task.isComplite ? "#0a791cff" : "#fff",
              }}
              onClick={handelCheck}
            >
              <CheckOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton
              className="icons"
              sx={{
                color: "#1247aaff",
                border: "1px solid #1247aaff",
                bgcolor: "#fff",
              }}
              onClick={() => handelOpenAlert("edit")}
            >
              <EditOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <IconButton
              className="icons"
              sx={{
                color: "#c50909ff",
                border: "1px solid #c50909ff",
                bgcolor: "#fff",
              }}
              onClick={() => handelOpenAlert("delete")}
            >
              <DeleteIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ToDo;
