import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { productValidator as validator } from "../validation";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import UpdateOrderDetail from "./UpdateOrderDetail";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Moment from "moment";

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
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [ordItems, setOrdItems] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [customError, setCustomError] = useState({
    customerIdError: "",
  });
  const [orderId, setOrderId] = useState(id);

  const [inputs, setInputs] = useState({
    customerId: 7,
    createDate: "12.12.2022",
    orderStatus: "Pending",
    orderAmount: 0,
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
    const updateOrder = () => {
      if (inputs.customerId && inputs.orderAmount) {
        let newDate = Moment(inputs.createDate).format("yyyy-MM-DD");
        const fd = new FormData();
        fd.append("customer", inputs.customerId);
        fd.append("order_status", inputs.orderStatus);
        fd.append("order_amount", inputs.orderAmount);
        fd.append("create_date", newDate);

        axios
          .put(`http://127.0.0.1:8000/update_order/${orderId}`, fd)
          .then((res) => {
            if (res.data) {
              updateOrderDetail(res.data.id);
              history.push("/order");
            } else {
              alert("There are issues to update the record");
            }
          });
      }
    };

    // add order detail
    const updateOrderDetail = (ord) => {
      if (ordItems.length > 0) {
        // let arr = [];
        for (let index = 0; index < ordItems.length; index++) {
          const element = ordItems[index];
          let data = {
            order: ord,
            product: element.product,
            qty: element.qty,
            price: element.price,
            amount_per_product: element.amount_per_product,
          };
          // console.log(arr);
          axios
            .post("http://127.0.0.1:8000/update_order_detail/", data)
            .then((res) => {
              if (res.data) {
                // console.log(res.data);
              } else {
                alert("There are issues to insert the record");
              }
            });
          // arr.push(data);
        }
      }
    };

    // if (isValid) {
    //   // add user
    updateOrder();
    //   // clear form data
    //   setCustomError({
    //     customerIdError: "",
    //   });
    // }
  };

  // handle change
  const handleChange = (e) => {
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

  // get last order
  const fetchOrder = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_order/")
      .then((res) => {
        if (res.data) {
          const selectedOrder = res.data.filter(
            (item) => item.id === parseInt(id)
          );
          //   console.log(selectedOrder);
          setInputs({
            customerId: selectedOrder[0].customer,
            createDate: selectedOrder[0].create_date,
            orderStatus: selectedOrder[0].order_status,
            orderAmount: parseFloat(selectedOrder[0].order_amount),
          });
          setOrderId(selectedOrder[0].id);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrder();
    fetchCustomer();
  }, []);

  const detailData = (values) => {
    let total = 0;
    let detail = [];
    values.map((x) => {
      let result = {
        oder: orderId,
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
              UPDATE ORDER
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
                    value={selectedDate}
                    format="dd/MM/yyyy"
                    margin="normal"
                    value={inputs.createDate}
                    onChange={(e) => setInputs({ ...inputs, createDate: e })}
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
                Update
              </Button>
            </Box>
          </Box>
        </Paper>
      </div>
      <Paper elevation={0} className={classes.detail}>
        <UpdateOrderDetail ord={orderId} detailData={detailData} />
      </Paper>
    </>
  );
}
