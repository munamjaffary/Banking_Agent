import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { authReducer } from "./authSlice";
import themeReducer from "../api/toggleThemeSlice";
import conversationReducer from "../api/conversationSlice";
import nluReducer from "../api/nluSlice";
import { apiSlice } from "../api/apiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "conversation", "nlu"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  conversation: conversationReducer,
  nlu: nluReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;