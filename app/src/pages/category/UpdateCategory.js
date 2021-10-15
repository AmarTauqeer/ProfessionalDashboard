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
import { categoryValidator as validator } from "../validation";

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
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    width: "500px",
  },
});

export default function UpdateCategory() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [catId, setCatId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customError, setCustomError] = useState({
    nameError: "",
    descError: "",
  });

  const [inputs, setInputs] = useState({
    categoryName: "",
    description: "",
  });

  // get category
  const fetchCategories = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_category/")
      .then((res) => {
        if (res.data) {
          const selectedCat = res.data.filter(
            (item) => item.id === parseInt(id)
          );
          setInputs({
            categoryName: selectedCat[0].category_name,
            description: selectedCat[0].category_description,
          });
          setCatId(parseInt(id));
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(inputs.categoryName, inputs.description);
    // console.log(validationResult);
    setCustomError({
      nameError: validationResult.nameError,
      descError: validationResult.descError,
    });
    const isValid = validationResult.valid;

    // add user
    const updateCategories = () => {
      if (inputs.categoryName && inputs.description) {
        const categoryData = {
          category_name: inputs.categoryName,
          category_description: inputs.description,
        };
        axios
          .put(`http://127.0.0.1:8000/update_category/${catId}`, categoryData)
          .then((res) => {
            if (res.data) {
              history.push("/category");
            } else {
              alert("There are issues to insert the record");
            }
          });
      }
    };

    if (isValid) {
      // add user
      updateCategories();
      // clear form data
      setCustomError({
        nameError: "",
        descError: "",
      });
    }
  };

  // handle change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(inputs.categoryName, inputs.description);
    setCustomError({
      nameError: validationResult.nameError,
      descError: validationResult.descError,
    });
    // console.log(customError.nameError + "     " + customError.descError);
  };
  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Typography component="h1" variant="h5">
            UPDATE CATEGORY
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
              id="categoryName"
              label="Category Name"
              name="categoryName"
              value={inputs.categoryName}
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
              name="description"
              label="Description"
              type="text"
              id="description"
              value={inputs.description}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            <box>
              {customError.descError && (
                <div className={classes.validationInput}>
                  {customError.descError}
                </div>
              )}
            </box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
