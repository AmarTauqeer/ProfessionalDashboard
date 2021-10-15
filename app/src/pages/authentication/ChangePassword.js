import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import { changePasswordValidator as validator } from "../validation";

const useStyles = makeStyles({
  outer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "98%",
    alignItems: "center",
    minHeight: "80vh",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "22%",
    alignItems: "center",
    borderRadius: 50,
    "@media (max-width:960px)": {
      width: "98%",
      borderRadius: 25,
    },
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5px",
    width: "300px",
  },
  validationInput: {
    color: "#9d0000",
    fontSize: "12px",
  },
});

export default function ChangePassword({ user }) {
  const classes = useStyles();
  const history = useHistory();
  const [isAdmin, setIsAdmin] = useState(false);
  const [customError, setCustomError] = useState({
    nameError: "",
    passError: "",
    oldPassError: "",
  });

  const [inputs, setInputs] = useState({
    userName: user.user_name,
    password: "",
    oldPassword: "",
    isAdmin: user.is_admin,
  });
  const checkUsers = () => {
    if (
      inputs.userName &&
      inputs.password &&
      inputs.oldPassword &&
      inputs.isAdmin
    ) {
      const userData = {
        user_name: inputs.userName,
        user_password: inputs.oldPassword,
        is_admin: inputs.isAdmin,
      };

      axios.post("http://127.0.0.1:8000/check_user/", userData).then((res) => {
        console.log(res.data);
        if (
          res.data === "Account doesn't exist" ||
          res.data === "Email or password incorrect" ||
          res.data === "You are not authorized to access dashboad"
        ) {
          alert("invalid user name or password");
        } else {
          const userData = {
            user_name: inputs.userName,
            user_password: inputs.password,
            old_password: inputs.oldPassword,
            is_admin: inputs.isAdmin,
          };
          axios
            .put("http://127.0.0.1:8000/change_password/", userData)
            .then((res) => {
              localStorage.setItem("userInfo", []);
              history.push("./signin");
              window.location.reload(false);
            })
            .catch((error) => console.log(error));
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(
      inputs.userName,
      inputs.password,
      inputs.oldPassword
    );

    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
      oldPassError: validationResult.oldPassError,
    });
    const isValid = validationResult.valid;
    if (isValid) {
      // check user
      checkUsers();
      // clear form data
      setCustomError({ nameError: "", passError: "", oldPassError: "" });
    }
  };

  // handle change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(
      inputs.userName,
      inputs.password,
      inputs.oldPassword
    );
    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
      oldPassError: validationResult.oldPassError,
    });
  };
  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Typography component="h1" variant="h5">
            CHANGE PASSWORD
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="User Name"
              name="userName"
              value={inputs.userName}
              size="small"
              onChange={handleChange}
              autoComplete="off"
            />
            {customError.nameError && (
              <div className={classes.validationInput}>
                {customError.nameError}
              </div>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              value={inputs.oldPassword}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            {customError.oldPassError && (
              <div className={classes.validationInput}>
                {customError.oldPassError}
              </div>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              value={inputs.password}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            {customError.passError && (
              <div className={classes.validationInput}>
                {customError.passError}
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
