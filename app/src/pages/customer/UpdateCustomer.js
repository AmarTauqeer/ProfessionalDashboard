import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useHistory, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { customerValidator as validator } from "../validation";
import { FormControl, MenuItem, Select } from "@mui/material";
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
  select: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 500,
    height: 42,
    "@media (max-width:960px)": {
      minWidth: 290,
      height: 40,
      width: 290,
      minWidth: 290,
    },
  },
});

export default function UpdateCustomer() {
  const classes = useStyles();
  const history = useHistory();
  const { REACT_APP_COUNTRYSTATECITY_KEY } = process.env;
  const { id } = useParams();
  const [customerId, setCustomerId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customError, setCustomError] = useState({
    nameError: "",
    emailError: "",
    countryError: "",
    addressError: "",
  });

  const [inputs, setInputs] = useState({
    customerName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    phone: "",
    email: "",
  });

  // fetch country

  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", `${REACT_APP_COUNTRYSTATECITY_KEY}`);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  const fetchCountries = () => {
    fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setCountries(result);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const fetchStates = (cid) => {
    fetch(
      `https://api.countrystatecity.in/v1/countries/${cid}/states`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setStates(result);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const fetchCities = (cid) => {
    fetch(
      `https://api.countrystatecity.in/v1/countries/${cid}/cities`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setCities(result);
        }
      })
      .catch((error) => console.log("error", error));
  };

  // get customer
  const fetchCustomers = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_customer/")
      .then((res) => {
        if (res.data) {
          const selectedCust = res.data.filter(
            (item) => item.id === parseInt(id)
          );
          setInputs({
            customerName: selectedCust[0].customer_name,
            address: selectedCust[0].customer_address,
            country: selectedCust[0].customer_country,
            state: selectedCust[0].customer_state,
            city: selectedCust[0].customer_city,
            phone: selectedCust[0].customer_phone,
            email: selectedCust[0].customer_email,
          });
          setCustomerId(parseInt(id));
          fetchStates(selectedCust[0].customer_country);
          fetchCities(selectedCust[0].customer_country);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchCustomers();
    fetchCountries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(
      inputs.customerName,
      inputs.email,
      inputs.country,
      inputs.address
    );
    // console.log(validationResult);
    setCustomError({
      nameError: validationResult.nameError,
      emailError: validationResult.emailError,
      countryError: validationResult.countryError,
      addressError: validationResult.addressError,
    });
    const isValid = validationResult.valid;

    // add customer
    const updateCustomers = () => {
      if (
        inputs.customerName &&
        inputs.email &&
        inputs.address &&
        inputs.country
      ) {
        const userData = {
          customer_name: inputs.customerName,
          customer_address: inputs.address,
          customer_country: inputs.country,
          customer_state: inputs.state,
          customer_city: inputs.city,
          customer_phone: inputs.phone,
          customer_email: inputs.email,
        };
        // console.log(userData);
        axios
          .put(`http://127.0.0.1:8000/update_customer/${customerId}`, userData)
          .then((res) => {
            if (res.data) {
              history.push("/customer");
            } else {
              alert("There are issues to update the record");
            }
          });
      }
    };

    if (isValid) {
      // add user
      updateCustomers();
      // clear form data
      setCustomError({
        nameError: "",
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
      inputs.customerName,
      inputs.email,
      inputs.country,
      inputs.address
    );
    setCustomError({
      nameError: validationResult.nameError,
      emailError: validationResult.emailError,
      countryError: validationResult.countryError,
      addressError: validationResult.addressError,
    });
  };
  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Typography component="h1" variant="h5">
            UPDATE CUSTOMER
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
              id="customerName"
              label="Customer Name"
              name="customerName"
              value={inputs.customerName}
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
            <FormControl fullWidth>
              <Select
                className={classes.select}
                value={inputs.country}
                displayEmpty
                onChange={(e) => {
                  setInputs({ ...inputs, country: e.target.value });
                  {
                    fetchStates(e.target.value);
                    fetchCities(e.target.value);
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Select country
                </MenuItem>
                {countries.length > 0 &&
                  countries.map((x) => {
                    return (
                      <MenuItem key={x.id} value={x.id}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            {customError.countryError && (
              <div className={classes.validationInput}>
                {customError.countryError}
              </div>
            )}
            <FormControl fullWidth>
              <Select
                className={classes.select}
                value={inputs.state}
                displayEmpty
                onChange={(e) => {
                  setInputs({ ...inputs, state: e.target.value });
                }}
              >
                <MenuItem value="" disabled>
                  Select state
                </MenuItem>

                {states.map((x) => {
                  return (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Select
                className={classes.select}
                value={inputs.city}
                displayEmpty
                onChange={(e) => {
                  setInputs({ ...inputs, city: e.target.value });
                }}
              >
                <MenuItem value="" disabled>
                  Select city
                </MenuItem>

                {cities.map((x) => {
                  return (
                    <MenuItem key={x.id} value={x.id}>
                      {x.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

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
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
