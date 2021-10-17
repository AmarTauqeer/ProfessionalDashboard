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
import { validator } from "../validation";

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

export default function Signin() {
  const classes = useStyles();
  const history = useHistory();
  const [isAdmin, setIsAdmin] = useState(false);
  const [customError, setCustomError] = useState({
    nameError: "",
    passError: "",
  });

  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });
  const checkUsers = () => {
    if (inputs.userName && inputs.password) {
      const userData = {
        user_name: inputs.userName,
        user_password: inputs.password,
        is_admin: isAdmin,
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
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...userData,
              is_admin: isAdmin,
              id: res.data.id,
            })
          );
          //Session.set("userInfo", userData);
          if (res.data.is_admin === true) {
            history.push("/dashboard");
            window.location.reload(false);
          } else {
            history.push("/");
            window.location.reload(false);
          }
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(inputs.userName, inputs.password);

    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
    });
    const isValid = validationResult.valid;
    if (isValid) {
      // check user
      checkUsers();
      // clear form data
      setCustomError({ nameError: "", passError: "" });
    }
  };

  // handle change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(inputs.userName, inputs.password);
    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
    });
  };
  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
              name="password"
              label="Password"
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
            <FormControlLabel
              control={
                <Checkbox
                  name="isAdmin"
                  value={isAdmin}
                  color="primary"
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              }
              label="Is Admin"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
