import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {
  forgotPasswordReducer,
  updateUserReducer,
  userReducer,
} from "./reducers/userReducer";
import {
  algorithmUsersReducer,
  filterUsersReducer,
} from "./reducers/skillReducer";

const reducer = combineReducers({
  user: userReducer,
  updateUser: updateUserReducer,
  forgotPassword: forgotPasswordReducer,
  algorithmUsers: algorithmUsersReducer,
  filterUsers: filterUsersReducer,
});

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk),
);

export default store;