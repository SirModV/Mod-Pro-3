export const filterUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case "FILTER_USER_REQUEST":
      return {
        ...state,
        users: state.users,
      };
      
    case "FILTER_USER_SUCCESS":
      return {
        ...state,
        users: action.payload.page <= 1 ? action.payload.users : [...state.users, ...action.payload.users],
        usersCount: action.payload.usersCount,
        resultPerPage: action.payload.resultPerPage,
        filteredUsersCount: action.payload.filteredUsersCount,
      };
      
    case "FILTER_USER_FAIL":
      return {
        error: action.payload,
      };
      
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  };
};

export const algorithmUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case "ALGORITHM_USER_REQUEST":
    case "DEFAULT_USER_REQUEST":
      return {
        ...state,
        users: state.users,
      };
      
    case "ALGORITHM_USER_SUCCESS":
      return {
        ...state,
        users: action.payload.page <= 1 ? action.payload.users : [...state.users, ...action.payload.users],
        usersCount: action.payload.usersCount,
        resultPerPage: action.payload.resultPerPage,
        AlgoUsersCount: action.payload.AlgoUsersCount,
      };
      
    case "DEFAULT_USER_SUCCESS":
      return {
        ...state,
        users: action.payload.page <= 1 ? action.payload.users : [...state.users, ...action.payload.users],
        usersCount: action.payload.usersCount,
        resultPerPage: action.payload.resultPerPage,
      };

    case "ALGORITHM_USER_FAIL":
    case "DEFAULT_USER_FAIL":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  };
};