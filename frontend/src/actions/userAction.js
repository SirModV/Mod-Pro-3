import axios from "axios";
import { toast } from "react-toastify";
import { backend } from "../Skills";

function getToken() {
  return localStorage.getItem('token');
}

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${backend}/api/v1/login`,
      { email, password },
      config
    );

    localStorage.setItem('token', data.token);
    toast('Login Successful');

    dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "LOGIN_FAIL",
      payload: error.response.data.message
    });
  };
};

// Signup
export const signup = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_USER_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json"
      },
    };

    const { data } = await axios.post(`${backend}/api/v1/signup`, userData, config);

    localStorage.setItem('token', data.token);
    toast('Signup Successful');

    dispatch({ type: "REGISTER_USER_SUCCESS", payload: data.user });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "REGISTER_USER_FAIL",
      payload: error.response.data.message,
    });
  };
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LOAD_USER_REQUEST" });

    const token = getToken();

    if (!token) {
      return null;
    }

    const config = { headers: { token } };

    const { data } = await axios.get(`${backend}/api/v1/me`, config)

    dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user });
  } catch (error) {
    if (error.response.data.message) {
      dispatch({
        type: "LOAD_USER_FAIL",
        payload: error.response.data.message
      });
    } else {
      dispatch({
        type: "LOAD_USER_FAIL",
        payload: "error",
      });
    };
  };
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${backend}/api/v1/logout`);
    localStorage.clear();
  
    toast('Logout Successful');
    dispatch({ type: "LOGOUT_SUCCESS" });
    
  } catch (error) {
    toast(error.response.data.message)
    dispatch({ type: "LOGOUT_FAIL", payload: error.response.data.message });
  };
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PROFILE_REQUEST" });

    const token = getToken();

    const config = { headers: { "Content-Type": "application/json", token } };

    const { data } = await axios.put(`${backend}/api/v1/profile/update`, userData, config);
    toast('Profile Updated Successfully');

    dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: data.success });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "UPDATE_PROFILE_FAIL",
      payload: error.response.data.message,
    });
  };
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PASSWORD_REQUEST" });

    const token = getToken();

    const config = {
      headers: { "Content-Type": "application/json", token },
    };

    const { data } = await axios.put(`${backend}/api/v1/password/update`,
      passwords,
      config
    );
    toast('Password Updated Successfully');

    dispatch({ type: "UPDATE_PASSWORD_SUCCESS", payload: data.success });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "UPDATE_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  };
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "FORGOT_PASSWORD_REQUEST" });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`${backend}/api/v1/password/forgot`, email, config);
    toast('Password Reset Link Sent Successfully to your Email');

    dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: data.message });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "FORGOT_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  };
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: "RESET_PASSWORD_REQUEST" });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `${backend}/api/v1/password/reset/${token}`,
      passwords,
      config
    );
    toast('Password Reset Successfully');

    dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: data.success });
  } catch (error) {
    toast(error.response.data.message);
    dispatch({
      type: "RESET_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  };
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};