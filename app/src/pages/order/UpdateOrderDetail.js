import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles({
  main: {
    display: "flex",
    justifyContents: "center",
    alignItems: "center",
    marginLeft: 60,
  },
  detail: {
    display: "flex",
    justifyContents: "center",
    alignItems: "center",
  },
  select: {
    width: 300,
    height: 42,
    marginTop: 7,
    marginLeft: 5,
    "@media (max-width:960px)": {
      width: 290,
    },
  },
});

const UpdateOrderDetail = ({ ord, detailData }) => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [inputs, setInputs] = useState([
    {
      orderId: ord,
      product: 0,
      qty: 0,
      price: 0.0,
      amount_per_product: 0.0,
    },
  ]);

  const fetchOrderDetail = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_order_detail/")
      .then((res) => {
        if (res.data) {
          const selectedOrderDetail = res.data.filter(
            (item) => item.order === parseInt(ord)
          );
          let arr = [];
          for (let index = 0; index < selectedOrderDetail.length; index++) {
            const element = selectedOrderDetail[index];
            let data = {
              ...inputs,
              orderId: element.order,
              product: element.product,
              qty: element.qty,
              price: element.price,
              amount_per_product: element.amount_per_product,
            };
            arr.push(data);
            setInputs(arr);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  // get product
  const prod = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_product/")
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    prod();
    fetchOrderDetail();
  }, []);

  // handle change
  const handleChange = (e, index) => {
    const values = [...inputs];
    values[index][e.target.name] = e.target.value;

    // console.log(values);
    setInputs(values);
    detailData(values);
    // setInputs({ ...inputs, [e.target.name]: e.target.value });

    // const validationResult = validator(inputs.customerId);
    // setCustomError({
    //   customerIdError: validationResult.customerIdError,
    // });
    // console.log(customError.nameError + "     " + customError.descError);
  };
  const handleAdd = () => {
    setInputs([
      ...inputs,
      {
        orderId: ord,
        product: 4,
        qty: 0,
        price: 0.0,
        amount_per_product: 0.0,
      },
    ]);
    detailData([
      ...inputs,
      {
        orderId: ord,
        product: 4,
        qty: 0,
        price: 0.0,
        amount_per_product: 0.0,
      },
    ]);
  };

  const handleDelete = (index) => {
    const values = [...inputs];
    values.splice(index, 1);
    setInputs(values);
    detailData(values);
  };

  return (
    <>
      <Grid container>
        {inputs.map((x, index) => (
          <div key={index}>
            <Paper elevation={0} className={classes.main}>
              <Grid item className={classes.detail}>
                <TextField
                  margin="normal"
                  className={classes.inputs}
                  name="ordId"
                  label="OrderId"
                  type="text"
                  id="ordId"
                  value={ord && ord}
                  autoComplete="off"
                  disabled
                  size="small"
                  style={{ marginLeft: "5px" }}
                />
                <Select
                  className={classes.select}
                  name="product"
                  value={x.product}
                  displayEmpty
                  onChange={(e) => handleChange(e, index)}
                >
                  <MenuItem value="" disabled>
                    Select product
                  </MenuItem>
                  {products &&
                    products.map((x) => {
                      return (
                        <MenuItem key={x.id} value={x.id}>
                          {x.product_name}
                        </MenuItem>
                      );
                    })}
                </Select>
                <TextField
                  margin="normal"
                  className={classes.inputs}
                  name="qty"
                  label="QTY"
                  type="text"
                  id="qty"
                  value={x.qty}
                  autoComplete="off"
                  size="small"
                  onChange={(e) => handleChange(e, index)}
                  style={{ marginLeft: "5px" }}
                />
                <TextField
                  margin="normal"
                  className={classes.inputs}
                  name="price"
                  label="Price"
                  type="text"
                  id="price"
                  value={x.price}
                  autoComplete="off"
                  size="small"
                  onChange={(e) => handleChange(e, index)}
                  style={{ marginLeft: "5px" }}
                />
                <TextField
                  margin="normal"
                  className={classes.inputs}
                  name="amount_per_product"
                  label="Total Per Product"
                  type="text"
                  id="amount_per_product"
                  value={x.qty * x.price}
                  autoComplete="off"
                  size="small"
                  disabled
                  // onChange={handleChange}
                  style={{ marginLeft: "5px" }}
                />
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  style={{
                    marginLeft: "5px",
                    height: "40px",
                    marginTop: "5px",
                  }}
                  onClick={() => handleAdd()}
                >
                  Add
                </Button>
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  style={{
                    marginLeft: "5px",
                    height: "40px",
                    marginTop: "5px",
                  }}
                  onClick={() => handleDelete(index)}
                >
                  Del
                </Button>
              </Grid>
            </Paper>
          </div>
        ))}
      </Grid>
    </>
  );
};

export default UpdateOrderDetail;
