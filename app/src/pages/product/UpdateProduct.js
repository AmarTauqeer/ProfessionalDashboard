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
import { productValidator as validator } from "../validation";
import uploadImage from "../../images/default-upload-1.png";
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
    display: "flex",
    flexDirection: "column",
    padding: "5px",
    width: "500px",
  },
  prodImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    height: 300,
    minWidth: 500,
    width: 500,
    "@media (max-width:960px)": {
      minWidth: 290,
      height: 200,
      width: 290,
    },
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

export default function UpdateProduct() {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [customError, setCustomError] = useState({
    nameError: "",
    descError: "",
    categoryError: "",
  });

  const [inputs, setInputs] = useState({
    productName: "",
    description: "",
    category: 0,
    salePrice: 0,
    purchasePrice: 0,
    image: "",
  });

  // get category
  const fetchCategories = async () => {
    await axios
      .get("http://127.0.0.1:8000/all_category/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  // get products

  const fetchProduct = () => {
    axios
      .get("http://127.0.0.1:8000/all_product/")
      .then((res) => {
        let product = res.data;
        const selectedProd = product.filter((item) => item.id === parseInt(id));

        setInputs({
          productName: selectedProd[0].product_name,
          description: selectedProd[0].product_description,
          productId: selectedProd[0].id,
          category: selectedProd[0].category,
          purchasePrice: selectedProd[0].purchase_price,
          salePrice: selectedProd[0].sale_price,
        });
        var file = selectedProd[0].image;
        setImageUrl(file);
        setProductId(selectedProd[0].id);
        //setSelectedFile(file);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (id && id !== null) fetchProduct();
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = validator(
      inputs.productName,
      inputs.description,
      inputs.category
    );
    // console.log(validationResult);
    setCustomError({
      nameError: validationResult.nameError,
      descError: validationResult.descError,
      categoryError: validationResult.categoryError,
    });
    const isValid = validationResult.valid;

    const updateProduct = () => {
      if (inputs.productName && inputs.description && inputs.category) {
        const fd = new FormData();

        fd.append("product_name", inputs.productName);
        fd.append("product_description", inputs.description);
        fd.append("category", inputs.category);
        fd.append("purchase_price", inputs.purchasePrice);
        fd.append("sale_price", inputs.salePrice);
        if (selectedFile !== "") {
          fd.append("image", selectedFile);
        }

        //Display the key/value pairs
        // for (var pair of fd.entries()) {
        //   console.log(pair[0] + ", " + pair[1]);
        // }

        axios
          .put(`http://127.0.0.1:8000/update_product/${productId}`, fd)
          .then((res) => {
            if (res.data) {
              history.push("/product");
            } else {
              alert("There are issues to update the record");
            }
          });
      }
    };

    if (isValid) {
      // add user
      updateProduct();
      // clear form data
      setCustomError({
        nameError: "",
        descError: "",
        categoryError: "",
      });
    }
  };

  // handle change
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });

    const validationResult = validator(
      inputs.productName,
      inputs.description,
      inputs.category
    );
    setCustomError({
      nameError: validationResult.nameError,
      descError: validationResult.descError,
      categoryError: validationResult.categoryError,
    });
    // console.log(customError.nameError + "     " + customError.descError);
  };

  // image handler
  const imageHandler = (e) => {
    setSelectedFile(e.target.files[0]);

    var file = e.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
  };

  return (
    <div className={classes.outer}>
      <Paper elevation={0} className={classes.paper} square={true}>
        <Box className={classes.box}>
          <Typography component="h1" variant="h5">
            UPDATE PRODUCT
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <FormControl fullWidth>
              <Select
                className={classes.select}
                value={inputs.category}
                onChange={(e) => {
                  setInputs({ ...inputs, category: e.target.value });
                }}
              >
                {categories.map((x) => {
                  return (
                    <MenuItem key={x.id} value={x.id}>
                      {x.category_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {customError.categoryError && (
              <div className={classes.validationInput}>
                {customError.categoryError}
              </div>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="productName"
              label="Product Name"
              name="productName"
              value={inputs.productName}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="salePrice"
              label="Sale Price"
              type="text"
              id="salePrice"
              value={inputs.salePrice}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="purchasePrice"
              label="Purchase Price"
              type="text"
              id="purchasePrice"
              value={inputs.purchasePrice}
              onChange={handleChange}
              size="small"
              autoComplete="off"
            />
            <input
              name="file"
              label="Image"
              type="file"
              onChange={imageHandler}
            />

            {selectedFile === "" ? (
              <div>
                <img
                  src={
                    imageUrl ? "http://127.0.0.1:8000" + imageUrl : uploadImage
                  }
                  className={classes.prodImage}
                />
              </div>
            ) : (
              <div>
                <img
                  src={imageUrl ? imageUrl : uploadImage}
                  className={classes.prodImage}
                />
              </div>
            )}

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
  );
}
