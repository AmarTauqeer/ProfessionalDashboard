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

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "image", label: "Image", minWidth: 20 },
  { id: "product_name", label: "Product Name", minWidth: 170 },
  { id: "product_description", label: "Description", minWidth: 170 },
  { id: "category", label: "Category", minWidth: 100 },
  { id: "sale_price", label: "Sale Price", minWidth: 20 },
  { id: "purchase_price", label: "Purchase Price", minWidth: 20 },
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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);

    if (products) {
      const results = products.filter((prod) =>
        prod.product_name.toLowerCase().includes(e.target.value)
      );
      setSearchResults(results);
    }
  };

  let product = [];
  if (search) {
    product = searchResults;
  } else {
    product = products;
  }

  // get category
  const fetchCategories = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_category/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  // get product
  const fetchProducts = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_product/")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Product Name", key: "product_name" },
    { label: "Description", key: "product_description" },
    { label: "Category", key: "category" },
    { label: "Sale Price", key: "sale_price" },
    { label: "Purchase Price", key: "purchase_price" },
    { label: "Image", key: "image" },
  ];

  const csvReport = {
    filename: "Product.csv",
    headers: headers,
    data: products,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandler = (id) => {
    const deleteProd = async () => {
      const response = await axios
        .delete("http://127.0.0.1:8000/delete_product/" + id)
        .catch((err) => console.log(err));
      if (response) {
        const results = products.filter((prod) => prod.id !== id);
        setProducts(results);
      }
    };

    deleteProd();
  };
  return (
    <>
      <Box className={classes.addPanel}>
        <div className={classes.item}>
          <div>
            {products && (
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
                history.push("/add-product");
              }}
            >
              Add Product
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
              label="Search product"
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
              {product
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        <img
                          src={"http://127.0.0.1:8000" + row.image}
                          width="50px"
                        />
                      </TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell>{row.product_description}</TableCell>
                      <TableCell>
                        {categories
                          .filter((cat) => cat.id === row.category)
                          .map((name) => name.category_name)}
                      </TableCell>
                      <TableCell>{row.purchase_price}</TableCell>
                      <TableCell>{row.sale_price}</TableCell>
                      <TableCell>
                        <Link
                          to={`/edit-product/${row.id}`}
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
          count={categories.length}
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
