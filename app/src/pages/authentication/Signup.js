import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
    width: "37%",
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
    width: "500px",
  },
  validationInput: {
    color: "#9d0000",
    fontSize: "12px",
  },
});

export default function Signup() {
  const classes = useStyles();
  const history = useHistory();
  const [isAdmin, setIsAdmin] = useState(false);
  const [customError, setCustomError] = useState({
    nameError: "",
    passError: "",
    emailError: "",
    countryError: "",
    addressError: "",
  });

  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    region: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(
      inputs.userName,
      inputs.password,
      "cpass",
      inputs.email,
      inputs.country,
      inputs.address
    );
    console.log(validationResult);
    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
      emailError: validationResult.emailError,
      countryError: validationResult.countryError,
      addressError: validationResult.addressError,
    });
    const isValid = validationResult.valid;

    // add user
    const addUsers = () => {
      if (
        inputs.userName &&
        inputs.password &&
        inputs.email &&
        inputs.address &&
        inputs.country
      ) {
        const userData = {
          user_name: inputs.userName,
          user_email: inputs.email,
          user_address: inputs.address,
          user_country: inputs.country,
          user_state: inputs.state,
          user_region: inputs.region,
          user_phone: inputs.phone,
          user_password: inputs.password,
        };
        axios.post("http://127.0.0.1:8000/add_user/", userData).then((res) => {
          if (res.data) {
            history.push("/signin");
          } else {
            alert("There are issues to insert the record");
          }
        });
      }
    };

    if (isValid) {
      // add user
      addUsers();
      // clear form data
      setCustomError({
        nameError: "",
        passError: "",
        emailError: "",
        countryError: "",
        addressError: "",
      });
    }
  };

  // handle change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(
      inputs.userName,
      inputs.password,
      inputs.email,
      inputs.country,
      inputs.address
    );
    setCustomError({
      nameError: validationResult.nameError,
      passError: validationResult.passError,
      emailError: validationResult.emailError,
      countryError: validationResult.countryError,
      addressError: validationResult.addressError,
    });
  };
  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              value={inputs.email}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            {customError.emailError && (
              <div className={classes.validationInput}>
                {customError.emailError}
              </div>
            )}
            <TextField
              margin="normal"
              fullWidth
              name="phone"
              label="Telephone"
              type="text"
              id="phone"
              value={inputs.phone}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="country"
              label="Country"
              type="text"
              id="country"
              value={inputs.country}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            {customError.countryError && (
              <div className={classes.validationInput}>
                {customError.countryError}
              </div>
            )}

            <TextField
              margin="normal"
              fullWidth
              name="state"
              label="State"
              type="text"
              id="state"
              value={inputs.state}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            <TextField
              margin="normal"
              fullWidth
              name="region"
              label="Region"
              type="text"
              id="region"
              value={inputs.region}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              type="text"
              id="address"
              value={inputs.address}
              onChange={handleChange}
              size="small"
              autoComplete="off"
              multiline={true}
              rows={4}
            />
            {customError.addressError && (
              <div className={classes.validationInput}>
                {customError.addressError}
              </div>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Grid container>
            {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
            <Grid item>
              <Link to="/signin" variant="body2">
                {"Have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
}
