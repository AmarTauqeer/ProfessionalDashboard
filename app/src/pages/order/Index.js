import Button from "@mui/material/Button";
import { Link, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { CSVLink } from "react-csv";
import Moment from "moment";
const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "create_date", label: "Date", minWidth: 20 },
  { id: "customer", label: "Customer", minWidth: 100 },
  { id: "order_status", label: "Status", minWidth: 20 },
  { id: "order_amount", label: "Amount", minWidth: 20 },
  { id: "action", label: "Action", minWidth: 100 },
];

const useStyles = makeStyles({
  paper: {
    minHeight: "80vh",
    maxWidth: "97%",
    marginLeft: 10,
    "@media (max-width:960px)": {
      fontSize: "12px",
      margin: 0,
    },
  },
  search: {
    minHeight: "9vh",
    maxWidth: "97%",
    marginLeft: 10,
    "@media (max-width:960px)": {
      fontSize: "12px",
      margin: 0,
    },
  },
  catItem: {
    maxWidth: "97%",
    marginLeft: 10,
    paddingLeft: 5,
    paddingTop: 5,
    marginTop: 10,
    "@media (max-width:960px)": {
      fontSize: "12px",
      maxWidth: "97%",
      marginLeft: 0,
      padding: 0,
    },
  },
  addPanel: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
    marginRight: 23,
    "@media (max-width:960px)": {
      fontSize: "12px",
      marginBottom: 5,
      marginRight: 8,
      paddingBottom: 10,
    },
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "12%",
    marginRight: 15,
    marginBottom: 10,
    "@media (max-width:960px)": {
      width: "70%",
      fontSize: "12px",
      margin: 0,
    },
  },
  button: {
    width: "150px",
  },
});

const Index = () => {
  const classes = useStyles();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);

    let name = e.target.value;
    if (orders) {
      const results = orders.filter(
        (ord) => ord.id === parseInt(e.target.value)
      );
      setSearchResults(results);
    }
  };

  let order = [];
  if (search) {
    order = searchResults;
  } else {
    order = orders;
  }

  // get orders
  const fetchOrders = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_order/")
      .then((res) => {
        // console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  // get customer
  const fetchCustomers = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_customer/")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Date", key: "create_date" },
    { label: "Customer", key: "customer" },
    { label: "Status", key: "order_status" },
    { label: "Amount", key: "order_amount" },
  ];

  const csvReport = {
    filename: "Order.csv",
    headers: headers,
    data: orders,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandler = (id) => {
    const deleteOrder = async () => {
      // delete from order
      const response = await axios
        .delete("http://127.0.0.1:8000/delete_order/" + id)
        .catch((err) => console.log(err));
      if (response) {
        const results = orders.filter((ord) => ord.id !== id);
        setOrders(results);
      }
    };
    deleteOrder();
  };
  return (
    <>
      <Box className={classes.addPanel}>
        <div className={classes.item}>
          <div>
            {orders && (
              <div className="nav-link">
                <CSVLink {...csvReport}>
                  <CloudDownloadIcon
                    fontSize="large"
                    className={classes.link}
                  />
                </CSVLink>
              </div>
            )}
          </div>

          <div>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => {
                history.push("/add-order");
              }}
            >
              Add Order
            </Button>
          </div>
        </div>
      </Box>

      <Paper elevation={0} className={classes.search}>
        <Grid container style={{ paddingLeft: "5px" }}>
          <Grid item xs={11} sm={4} md={4}>
            <TextField
              margin="normal"
              fullWidth
              id="search"
              label="Search order"
              name="search"
              value={search}
              onChange={handleChange}
              size="large"
              autoComplete="off"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} className={classes.catItem}>
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
              {order
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
                      <TableCell>
                        <Link
                          to={`/edit-order/${row.id}`}
                          className={classes.link}
                        >
                          <EditIcon size={20} />
                        </Link>

                        <DeleteOutlineIcon
                          className={classes.delete}
                          size={20}
                          color="secondary"
                          onClick={() => deleteHandler(row.id)}
                        />
                      </TableCell>
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
export default Index;
