import axios from "axios";
import { backend } from "../Skills";

function getToken() {
  return localStorage.getItem('token');
}

// Get Filtered Users
export const getFilteredUsers =
  (page = 1, keyword = "", experience = "", workLevel = "") => async (dispatch) => {
  try {
    dispatch({ type: "FILTER_USER_REQUEST" });

    let link = `${backend}/api/v1/filter?keyword=${keyword}&experience=${experience}&workLevel=${workLevel}&page=${page}`;

    const { data } = await axios.get(link);
    
    dispatch({
      type: "FILTER_USER_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "FILTER_USER_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get Algorithm Users
export const getAlgorithmUsers = (page = 1) => async (dispatch) => {
  try {
    dispatch({ type: "ALGORITHM_USER_REQUEST" });

    const token = getToken();

    const config = {
      headers: { token },
    };

    const { data } = await axios.get(`${backend}/api/v1/algorithm?page=${page}`, config);

    dispatch({
      type: "ALGORITHM_USER_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ALGORITHM_USER_FAIL",
      payload: error.response.data.message,
    });
  }
}

// Get Default Users
export const getDefaultUsers = (page = 1) => async (dispatch) => {
  try {
    dispatch({ type: "DEFAULT_USER_REQUEST" });
  
    const { data } = await axios.get(`${backend}/api/v1/default?page=${page}`);

    dispatch({
      type: "DEFAULT_USER_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "DEFAULT_USER_FAIL",
      payload: error.response.data.message,
    });
  }
}

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};