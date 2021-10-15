import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { productValidator as validator } from "../validation";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import OrderDetail from "./OrderDetail";
import Moment from "moment";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles({
  outer: {
    display: "flex",
    justifyContent: "center",
    width: "98%",
    minHeight: "30vh",
  },
  detail: {
    display: "flex",
    justifyContent: "center",
    width: "98%",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    width: "60%",
    borderRadius: 30,

    "@media (max-width:960px)": {
      width: "98%",
      borderRadius: 25,
    },
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "10px",
  },

  validationInput: {
    color: "#9d0000",
    fontSize: "12px",
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    width: "500px",
  },
  select: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 400,
    height: 42,
    "@media (max-width:960px)": {
      height: 40,
      width: 290,
    },
  },
  inputs: {
    width: 400,
    height: 42,
    "@media (max-width:960px)": {
      minWidth: 290,
      height: 32,
      width: 290,
      minHeight: 32,
    },
  },
});

export default function AddOrder() {
  const classes = useStyles();
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [ordItems, setOrdItems] = useState([]);
  const [customError, setCustomError] = useState({
    customerIdError: "",
  });

  const [inputs, setInputs] = useState({
    customerId: 7,
    createDate: new Date(),
    orderStatus: "Pending",
    orderAmount: 0,
    orderId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // const validationResult = validator(inputs.customerId);
    // // console.log(validationResult);
    // setCustomError({
    //   customerIdError: validationResult.customerIdError,
    // });
    // const isValid = validationResult.valid;

    // add order
    const addOrder = () => {
      if (inputs.customerId && inputs.orderAmount) {
        let newDate = Moment(inputs.createDate).format("yyyy-MM-DD");

        // console.log(typeof newDate);
        // let a = new Date(newDate);

        // console.log(a);

        const fd = new FormData();
        let t = fd.append("customer", inputs.customerId);
        fd.append("order_status", inputs.orderStatus);
        fd.append("order_amount", inputs.orderAmount);
        fd.append("create_date", newDate);
        // console.log(fd);

        axios.post("http://127.0.0.1:8000/add_order/", fd).then((res) => {
          if (res.data) {
            // console.log(res.data);
            addOrderDetail(res.data.id);
            history.push("/order");
          } else {
            alert("There are issues to insert the record");
          }
        });
      }
    };

    // add order detail
    const addOrderDetail = (ord) => {
      if (ordItems.length > 0) {
        for (let index = 0; index < ordItems.length; index++) {
          const element = ordItems[index];
          let data = {
            order: ord,
            product: element.product,
            qty: element.qty,
            price: element.price,
            amount_per_product: element.amount_per_product,
          };
          axios
            .post("http://127.0.0.1:8000/add_order_detail/", data)
            .then((res) => {
              if (res.data) {
                // console.log(res.data);
              } else {
                alert("There are issues to insert the record");
              }
            });
        }
      }
    };

    // if (isValid) {
    //   // add user
    addOrder();
    //   // clear form data
    //   setCustomError({
    //     customerIdError: "",
    //   });
    // }
  };

  // handle change
  const handleChange = (e) => {
    console.log(e.target.name);
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(inputs.customerId);
    setCustomError({
      customerIdError: validationResult.customerIdError,
    });
    // console.log(customError.nameError + "     " + customError.descError);
  };

  // get customer
  const fetchCustomer = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_customer/")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => console.log(err));
  };

  // get last order id
  const fetchOrderId = async () => {
    await axios
      .get("http://127.0.0.1:8000/get_last_ordId/")
      .then((res) => {
        setInputs({ ...inputs, orderId: res.data + 1 });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrderId();
    fetchCustomer();
  }, []);

  const detailData = (values) => {
    let total = 0;
    let detail = [];
    values.map((x) => {
      let result = {
        oder: inputs.orderId,
        product: x.product,
        qty: parseInt(x.qty),
        price: parseFloat(x.price),
        amount_per_product: x.qty * x.price,
      };

      let amt = x.qty * x.price;
      total += amt;
      detail.push(result);
    });

    setInputs({ ...inputs, orderAmount: total });
    setOrdItems(detail);
  };
  return (
    <>
      <div className={classes.outer}>
        <Paper elevation={0} className={classes.paper} square={true}>
          <Box className={classes.box}>
            <Typography
              component="h1"
              variant="h5"
              style={{ textAlign: "center" }}
            >
              ADD ORDER
            </Typography>
            <br />
            <Grid container>
              <Grid item xs={12} sm={8} md={6} style={{ marginBottom: "30px" }}>
                <FormControl>
                  <Select
                    className={classes.select}
                    value={inputs.customerId}
                    displayEmpty
                    onChange={(e) => {
                      setInputs({ ...inputs, customerId: e.target.value });
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select customer
                    </MenuItem>
                    {customers &&
                      customers.map((x) => {
                        return (
                          <MenuItem key={x.id} value={x.id}>
                            {x.customer_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {customError.customerIdError && (
                  <div className={classes.validationInput}>
                    {customError.customerIdError}
                  </div>
                )}

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    className={classes.inputs}
                    format="dd-MM-yyyy"
                    margin="normal"
                    value={inputs.createDate}
                    onChange={(date) => {
                      setInputs({
                        ...inputs,
                        createDate: date,
                      });
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <FormControl fullWidth>
                  <Select
                    className={classes.select}
                    value={inputs.orderStatus}
                    onChange={(e) => {
                      setInputs({ ...inputs, orderStatus: e.target.value });
                    }}
                  >
                    <MenuItem value="Pending" selected>
                      Pending
                    </MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  className={classes.inputs}
                  name="orderAmount"
                  label="Total Price"
                  type="text"
                  id="orderAmount"
                  value={inputs.orderAmount}
                  onChange={handleChange}
                  disabled
                  autoComplete="off"
                />
              </Grid>
            </Grid>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </div>
      <Paper elevation={0} className={classes.detail}>
        <OrderDetail ord={inputs.orderId} detailData={detailData} />
      </Paper>
    </>
  );
}
