import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserReducer from "./user/user.reducer";
import ContestReducer from "./contest/contest.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: UserReducer,
  contests: ContestReducer,
});

export default persistReducer(persistConfig, rootReducer);
