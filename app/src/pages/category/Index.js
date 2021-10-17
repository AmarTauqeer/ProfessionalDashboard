import Button from "@mui/material/Button";
import { Link, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { CSVLink } from "react-csv";
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

const columns = [
  { id: "id", label: "ID", minWidth: 20 },
  { id: "category_name", label: "Category Name", minWidth: 170 },
  { id: "category_description", label: "Description", minWidth: 170 },
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);

    if (categories) {
      const results = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(e.target.value)
      );
      setSearchResults(results);
    }
  };

  let category = [];
  if (search) {
    category = searchResults;
  } else {
    category = categories;
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Category Name", key: "category_name" },
    { label: "Description", key: "category_description" },
  ];

  const csvReport = {
    filename: "Category.csv",
    headers: headers,
    data: categories,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandler = (id) => {
    const deleteCat = async () => {
      const response = await axios
        .delete("http://127.0.0.1:8000/delete_category/" + id)
        .catch((err) => console.log(err));
      if (response) {
        const results = categories.filter((cat) => cat.id !== id);
        setCategories(results);
      }
    };

    deleteCat();
  };
  return (
    <>
      <Box className={classes.addPanel}>
        <div className={classes.item}>
          <div>
            {categories && (
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
                history.push("/add-category");
              }}
            >
              Add Category
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
              label="Search category"
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
              {category
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.category_name}</TableCell>
                      <TableCell>{row.category_description}</TableCell>
                      <TableCell>
                        <Link
                          to={`/edit-category/${row.id}`}
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
