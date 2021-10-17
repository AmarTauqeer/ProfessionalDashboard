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
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "customer_name", label: "Customer Name", minWidth: 100 },
  { id: "customer_email", label: "Email", minWidth: 50 },
  { id: "customer_phone", label: "Phone", minWidth: 50 },
  { id: "customer_country", label: "Country", minWidth: 50 },
  { id: "customer_address", label: "Address", minWidth: 200 },
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
  const { REACT_APP_COUNTRYSTATECITY_KEY } = process.env;
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  const [countries, setCountries] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);

    if (customers) {
      const results = customers.filter((cust) =>
        cust.customer_name.toLowerCase().includes(e.target.value)
      );
      setSearchResults(results);
    }
  };

  let customer = [];
  if (search) {
    customer = searchResults;
  } else {
    customer = customers;
  }

  // fetch country

  var headersNew = new Headers();
  headersNew.append("X-CSCAPI-KEY", `${REACT_APP_COUNTRYSTATECITY_KEY}`);

  var requestOptions = {
    method: "GET",
    headers: headersNew,
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
    fetchCountries();
  }, []);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Customer Name", key: "customer_name" },
    { label: "Email", key: "customer_email" },
    { label: "Phone", key: "customer_phone" },
    { label: "Country", key: "customer_country" },
    { label: "Address", key: "customer_address" },
  ];

  const csvReport = {
    filename: "Customer.csv",
    headers: headers,
    data: customers,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandler = (id) => {
    const deleteCust = async () => {
      const response = await axios
        .delete("http://127.0.0.1:8000/delete_customer/" + id)
        .catch((err) => console.log(err));
      if (response) {
        const results = customers.filter((cust) => cust.id !== id);
        setCustomers(results);
      }
    };

    deleteCust();
  };
  return (
    <>
      <Box className={classes.addPanel}>
        <div className={classes.item}>
          <div>
            {customers && (
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
                history.push("/add-customer");
              }}
            >
              Add Customer
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
              label="Search customer"
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
              {customer
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.customer_name}</TableCell>
                      <TableCell>{row.customer_email}</TableCell>
                      <TableCell>{row.customer_phone}</TableCell>
                      <TableCell>
                        {countries
                          .filter(
                            (c) => c.id === parseInt(row.customer_country)
                          )
                          .map((item) => item.name)}
                      </TableCell>
                      <TableCell>{row.customer_address}</TableCell>
                      <TableCell>
                        <Link
                          to={`/edit-customer/${row.id}`}
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
          count={customers.length}
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
