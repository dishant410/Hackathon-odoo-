import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import swapReducer from "./swapSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  swap: swapReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "swap"], // persist all slices, or just ["auth"] if you want only auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
