import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Button,
  Divider,
  Grid,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import ToDo from "./ToDo";
import { ListTasksContext } from "./contexts/ListTasksContext";
// Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useTost } from "./contexts/TostContext";

// Start Style
const styleInputField = {
  position: "fixed",
  bottom: "-9px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "70%",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px 10px 30px 10px",
  boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.51)",
  borderRadius: "10px",
  backgroundColor: "#fff",
};
// End Style
const ToDoList = ({message}) => {
  const {clickSnack} = useTost();
  const { ListTasks, setListTasks } = useContext(ListTasksContext);
  // All State
  const [titleInput, setTitleInput] = useState({
    titleTask: "",
    descriptionTask: "",
  });

  //  ------------------------------------------------------
  // filter Tasks
  const [displayedTasksType, setDisplayedTasksType] = useState("all");

  const noComplite = useMemo(() => {
    return ListTasks.filter((t) => {
      console.log("noComplite");
      return !t.isComplite;
    });
  }, [ListTasks]);

  const complite = useMemo(() => {
    return ListTasks.filter((t) => {
      console.log("complite");
      return t.isComplite;
    });
  }, [ListTasks]);
  function handleFilteration(e) {
    setDisplayedTasksType(e.target.value);
  }
  let toDosToBeRendered = ListTasks;
  // All Tasks
  if (displayedTasksType === "complite") {
    toDosToBeRendered = complite;
  } else if (displayedTasksType === "noComplite") {
    toDosToBeRendered = noComplite;
  } else {
    toDosToBeRendered = ListTasks;
  }

  //  ------------------------------------------------------
  function handelAddTask() {
    if (
      titleInput.titleTask.trim() === "" ||
      titleInput.descriptionTask.trim() === ""
    ) {
      alert("please Enter The Task");
      return;
    } else {
      const NewTask = {
        id: uuidv4(),
        title: titleInput.titleTask,
        description: titleInput.descriptionTask,
        isComplite: false,
      };
      const NewListTasks = [...ListTasks, NewTask];
      setListTasks(NewListTasks);
      localStorage.setItem("ListTask", JSON.stringify(NewListTasks));
      setTitleInput({ titleTask: "", descriptionTask: "" });
      clickSnack('تمت اضافة المهمة بنجاح')
    }
  }
  useEffect(() => {
    const storageTasks = JSON.parse(localStorage.getItem("ListTask")) ?? [];
    setListTasks(storageTasks);
  }, []);

  // --------------------------- Dialog --------------------
  const [openAlert, setOpenAlert] = useState({ delete: false, edit: false });
  const [alertTask, setAlertTask] = useState({title:'', description:''});
  function handelCloseAlert() {
    setOpenAlert({ delete: false, edit: false });
  }
  function handelOpenAlert(action , task) {
    setAlertTask(task)
    if (action === "edit") {
      setUpdateTask({
        title: task.title,
        description: task.description,
      });
    }
    setOpenAlert((prevState) => ({ ...prevState, [action]: true }));
  }

  function HandelDeleted() {
    const NewTasksDelete = ListTasks.filter((t) => {
      return t.id !== alertTask.id;
    });
    setListTasks(NewTasksDelete);
    localStorage.setItem("ListTask", JSON.stringify(NewTasksDelete));
    handelCloseAlert();
    clickSnack('تم حذف المهمة بنجاح')
  }
  // Edit Task
  const [updateTask, setUpdateTask] = useState({
    title: alertTask.title,
    description: alertTask.description,
  });
  function handelEdit() {
    const newUpdateTask = ListTasks.map((t) => {
      if (t.id === alertTask.id) {
        return {
          ...t,
          title: updateTask.title,
          description: updateTask.description,
        };
      } else {
        return t;
      }
    });
    setListTasks(newUpdateTask);
    localStorage.setItem("ListTask", JSON.stringify(newUpdateTask));
    handelCloseAlert();
    clickSnack('تم تعديل المهمة بنجاح')
  }
  // Task List jsx
  const ListTask =
    toDosToBeRendered.length === 0 ? (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
        لا توجد مهام حالياً
      </Typography>
    ) : (
      toDosToBeRendered.map((task) => {
        return <ToDo key={task.id} task={task} OpenAlert={handelOpenAlert}/>;
      })
    );
  return (
    <>
      {/* Alert Delete */}
      <Dialog
        sx={{ direction: "rtl" }}
        open={openAlert.delete}
        onClose={handelCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"هل تريد متابعة حذف هذه المهمة؟"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            انتبه !! عند الضغط على اتابع الحذق لا يمكنك الاسترجاع عن الحذف
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handelCloseAlert}>الغاء</Button>
          <Button onClick={HandelDeleted} autoFocus>
            تابع الحذف
          </Button>
        </DialogActions>
      </Dialog>
      {/* Alert Edit */}
      <Dialog
        sx={{ direction: "rtl" }}
        open={openAlert.edit}
        onClose={handelCloseAlert}
      >
        <DialogTitle>تعديل المهمة</DialogTitle>
        <DialogContent>
          <DialogContentText>
            قم بتعديل المهمة الخاصه بك من هنا اضف العنوان واكتب وصف المهمة
            الجديد
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="address"
            label="العنوان"
            fullWidth
            variant="standard"
            value={updateTask.title}
            onChange={(e) =>
              setUpdateTask({ ...updateTask, title: e.target.value })
            }
          />

          <TextField
            autoFocus
            required
            margin="dense"
            id="desc"
            label="تفاصيل المهمة"
            fullWidth
            variant="standard"
            value={updateTask.description}
            onChange={(e) =>
              setUpdateTask({ ...updateTask, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handelCloseAlert}>الغاء</Button>
          <Button onClick={handelEdit}>تعديل</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            position: "fixed",
            top: "0",
            left: "0",
            bgcolor: "#fff",
            width: "100%",
            zIndex: "100",
            paddingBottom: "20px",
          }}
        >
          <Typography variant="h2"> مهامي </Typography>
          <Divider />
          <ToggleButtonGroup
            style={{ direction: "ltr", marginTop: "20px" }}
            value={displayedTasksType}
            exclusive
            onChange={handleFilteration}
            aria-label="text alignment"
            color="secondary"
          >
            <ToggleButton value="noComplite">غير المنجز</ToggleButton>
            <ToggleButton value="complite">المنجز</ToggleButton>
            <ToggleButton value="all">الكل</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ padding: "150px 0 100px 0" }}>{ListTask}</Box>
        <Grid className="inputs" spacing={2} container sx={styleInputField}>
          <Grid size={3} sx={{ height: "50px" }}>
            <TextField
              sx={{ height: "100%", width: "100%" }}
              id="filled-basic"
              label="عنوان المهمة"
              variant="filled"
              value={titleInput.titleTask}
              onChange={(e) => {
                setTitleInput({ ...titleInput, titleTask: e.target.value });
              }}
            />
          </Grid>
          <Grid size={7} sx={{ height: "50px" }}>
            <TextField
              sx={{ height: "100%", width: "100%" }}
              id="filled-basic"
              label="الوصف المهمة"
              variant="filled"
              value={titleInput.descriptionTask}
              onChange={(e) => {
                setTitleInput({
                  ...titleInput,
                  descriptionTask: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid size={2} sx={{ height: "50px" }}>
            <Button
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: "secondary.main",
              }}
              variant="contained"
              onClick={() => handelAddTask()}
            >
              اضافة
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default ToDoList;
