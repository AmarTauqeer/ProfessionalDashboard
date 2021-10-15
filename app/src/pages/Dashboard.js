import {
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "create_date", label: "Date", minWidth: 20 },
  { id: "customer", label: "Customer", minWidth: 100 },
  { id: "order_status", label: "Status", minWidth: 20 },
  { id: "order_amount", label: "Amount", minWidth: 20 },
];

const useStyles = makeStyles({
  pannel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 70,
    "@media (max-width:960px)": {
      margin: 10,
    },
  },
  pannelPaper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    marginRight: 10,
    "@media (max-width:960px)": {
      marginLeft: 0,
    },
  },

  category: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    minHeight: 250,
    width: 430,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    "@media (max-width:960px)": {
      width: "97%",
      marginBottom: 5,
      minHeight: 150,
    },
  },
  product: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E62802",
    minHeight: 250,
    width: 430,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    "@media (max-width:960px)": {
      margin: 0,
      width: "97%",
      marginBottom: 5,
      minHeight: 150,
    },
  },
  customer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#029BE6",
    minHeight: 250,
    width: 430,
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    "@media (max-width:960px)": {
      marginLeft: 0,
      width: "97%",
      marginBottom: 5,
      minHeight: 150,
    },
  },
  catItem: {
    // maxWidth: "98%",
    marginRight: 10,
    marginTop: 10,
    padding: 10,
    "@media (max-width:960px)": {
      fontSize: "12px",
      maxWidth: "97%",
      marginLeft: 0,
      padding: 0,
    },
  },

  button: {
    width: "150px",
  },
});
const Dashboard = ({ user }) => {
  const classes = useStyles();
  const [cData, setCdata] = useState([]);
  const [pData, setPdata] = useState([]);
  const [custData, setCustdata] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // get category
  const cat = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_category/")
      .then((res) => {
        if (res.data) {
          setCdata(res.data.length);
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
          setPdata(res.data.length);
        }
      })
      .catch((err) => console.log(err));
  };

  // get product
  const cust = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_customer/")
      .then((res) => {
        if (res.data) {
          setCustdata(res.data.length);
          setCustomers(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // get orders
  const fetchOrders = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_order/")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cat();
    prod();
    cust();
    fetchOrders();
    // userData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <Paper className={classes.pannelPaper}>
        <Grid container className={classes.pannel}>
          <Grid item xs={12} sm={8} md={4}>
            <Paper elevation={0} className={classes.category}>
              Category {"{"} {cData} {"}"}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={4}>
            <Paper elevation={0} className={classes.product}>
              Product {"{"} {pData} {"}"}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={4}>
            <Paper elevation={0} className={classes.customer}>
              Customer {"{"} {custData} {"}"}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <br />
      <Paper elevation={0} className={classes.catItem}>
        <Typography variant="h6">CUSTOMER ORDERS</Typography>
        <br />
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {Moment(row.create_date).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {customers
                          .filter((cust) => cust.id === row.customer)
                          .map((name) => name.customer_name)}
                      </TableCell>
                      <TableCell>{row.order_status}</TableCell>
                      <TableCell>{row.order_amount}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Dashboard;
