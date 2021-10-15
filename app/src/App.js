import { Grid, makeStyles } from "@material-ui/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";
import CategoryList from "./pages/category/Index";
import ProductList from "./pages/product/Index";
import AddProduct from "./pages/product/AddProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import CustomerList from "./pages/customer/Index";
import SignIn from "./pages/authentication/Signin";
import UserList from "./pages/authentication/user/Index";

import SignUp from "./pages/authentication/Signup";

import Contact from "./pages/Contact";
import Home from "./pages/Home";
import { Box } from "@mui/system";
import Header from "./components/navigation/Header";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import AddCategory from "./pages/category/AddCategory";
import UpdateCategory from "./pages/category/UpdateCategory";
import AddCustomer from "./pages/customer/AddCustomer";
import ChangePassword from "./pages/authentication/ChangePassword";
import UpdateCustomer from "./pages/customer/UpdateCustomer";
import AddOrder from "./pages/order/AddOrder";
import Order from "./pages/order/Index";
import UpdateOrder from "./pages/order/UpdateOrder";

// styles
const useStyle = makeStyles({
  main: {
    backgroundColor: "#efefef",
  },
  content: {
    marginTop: "70px",
    paddingLeft: "10px",
    minHeight: "90vh",
    "@media (min-width:960px)": {
      marginLeft: "300px",
      marginTop: "90px",
      minHeight: "90vh",
    },
  },
});

const App = () => {
  const [userInfo, setUserInfo] = useState([]);
  const classes = useStyle();

  const fetchUser = () => {
    let user = localStorage.getItem("userInfo");
    if (user) {
      user = JSON.parse(user);
      setUserInfo(user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Grid container className={classes.main}>
        <Router>
          <Grid
            item
            md={1}
            component={Box}
            display={{ sm: "none", xs: "none", md: "block" }}
          >
            <Sidebar user={userInfo} />
          </Grid>
          <Grid item xs={12} sm={12} md={11} className={classes.content}>
            <Header user={userInfo} />
            <Route exact path="/" component={Home} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            {userInfo.user_name && (
              <>
                <Route exact path="/category" component={CategoryList} />
                <Route exact path="/product" component={ProductList} />
                <Route exact path="/customer" component={CustomerList} />
                <Route
                  exact
                  path="/edit-customer/:id"
                  component={UpdateCustomer}
                />
                <Route exact path="/add-customer" component={AddCustomer} />

                <Route exact path="/add-product" component={AddProduct} />
                <Route
                  exact
                  path="/edit-product/:id"
                  component={UpdateProduct}
                />

                <Route exact path="/add-category" component={AddCategory} />
                <Route
                  exact
                  path="/edit-category/:id"
                  component={UpdateCategory}
                />

                <Route exact path="/user" component={UserList} />
                <Route exact path="/change-password">
                  <ChangePassword user={userInfo} />
                </Route>

                <Route exact path="/dashboard">
                  <Dashboard />
                </Route>
                <Route exact path="/order">
                  <Order />
                </Route>
                <Route exact path="/edit-order/:id">
                  <UpdateOrder />
                </Route>
                <Route exact path="/add-order">
                  <AddOrder />
                </Route>
              </>
            )}
          </Grid>
        </Router>
      </Grid>
    </div>
  );
};

export default App;
