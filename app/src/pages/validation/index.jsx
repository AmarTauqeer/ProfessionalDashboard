export const validator = (name, pass, cpass, email, country, address) => {
  let customError = {
    nameError: "",
    passError: "",
    confirmPassError: "",
    emailError: "",
    countryError: "",
    addressError: "",

    valid: true,
  };
  let nameError = "";
  let passError = "";
  let confirmPassError = "";
  let emailError = "";
  let countryError = "";
  let addressError = "";

  if (name === "" && typeof name !== "undefined") {
    nameError = "Please provide a username.";
  }
  if (pass === "" && typeof pass !== "undefined") {
    passError = "Please provide a password.";
  }

  if (email === "" && typeof email !== "undefined") {
    emailError = "Please provide an email.";
  }

  if (country === "" && typeof country !== "undefined") {
    countryError = "Please provide a country name.";
  }

  if (address === "" && typeof address !== "undefined") {
    addressError = "Please provide an address.";
  }

  if (cpass === "" && typeof cpass !== "undefined") {
    confirmPassError = "Please provide a confirm password.";
  }

  if (
    typeof pass !== "undefined" &&
    typeof cpass !== "undefined" &&
    cpass !== "cpass"
  ) {
    if (cpass !== pass) {
      confirmPassError = "Confirm passwrod doesn't match with password.";
    }
  }

  if (pass !== "") {
    if (pass.length !== 0 && pass.length < 5) {
      passError = "Password length must be greater than 5.";
    }
  }

  if (
    nameError ||
    passError ||
    confirmPassError ||
    emailError ||
    countryError ||
    addressError
  ) {
    customError = {
      nameError,
      passError,
      confirmPassError,
      emailError,
      countryError,
      addressError,
      valid: false,
    };
    return customError;
  }
  return customError;
};

export const changePasswordValidator = (name, pass, oldPass) => {
  let customError = {
    nameError: "",
    passError: "",
    oldPassError: "",
    valid: true,
  };
  let nameError = "";
  let passError = "";
  let oldPassError = "";

  if (name === "" && typeof name !== "undefined") {
    nameError = "Please provide a user name.";
  }

  if (pass === "" && typeof pass !== "undefined") {
    passError = "Please provide password.";
  }

  if (oldPass === "" && typeof oldPass !== "undefined") {
    passError = "Please provide old password.";
  }

  if (nameError || passError || oldPassError) {
    customError = {
      nameError,
      passError,
      oldPassError,
      valid: false,
    };
    return customError;
  }
  return customError;
};

export const categoryValidator = (name, desc) => {
  let customError = {
    nameError: "",
    descError: "",
    valid: true,
  };
  let nameError = "";
  let descError = "";

  if (name === "" && typeof name !== "undefined") {
    nameError = "Please provide a category name.";
  }

  if (desc === "" && typeof desc !== "undefined") {
    descError = "Please provide a description of category.";
  }

  if (nameError || descError) {
    customError = {
      nameError,
      descError,
      valid: false,
    };
    return customError;
  }
  return customError;
};

export const productValidator = (name, desc, category) => {
  let customError = {
    nameError: "",
    descError: "",
    categoryError: "",
    valid: true,
  };
  let nameError = "";
  let descError = "";
  let categoryError = "";

  if (category === 0) {
    categoryError = "Please provide a category name.";
  }

  if (name === "" && typeof name !== "undefined") {
    nameError = "Please provide a product name.";
  }

  if (desc === "" && typeof desc !== "undefined") {
    descError = "Please provide a description of product.";
  }

  if (nameError || descError || categoryError) {
    customError = {
      nameError,
      descError,
      categoryError,
      valid: false,
    };
    return customError;
  }
  return customError;
};

export const customerValidator = (name, email, country, address) => {
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  let customError = {
    nameError: "",
    addressError: "",
    countryError: "",
    emailError: "",
    valid: true,
  };
  let nameError = "";
  let addressError = "";
  let countryError = "";
  let emailError = "";

  if (name === "" && typeof name !== "undefined") {
    nameError = "Please provide a customer name.";
  }

  if (address === "" && typeof address !== "undefined") {
    addressError = "Please provide an address.";
  }

  if (country === "" && typeof country !== "undefined") {
    countryError = "Please provide a country name.";
  }

  if (email === "" && typeof email !== "undefined") {
    emailError = "Please provide an email.";
  }

  if (email !== "") {
    if (!pattern.test(email)) {
      emailError = "please provide a valid email address";
    }
  }

  if (nameError || addressError || countryError || emailError) {
    customError = {
      nameError,
      addressError,
      countryError,
      emailError,
      valid: false,
    };
    return customError;
  }
  return customError;
};
