import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { persistor, store } from "./redux/store";
import ThemeWrapper from "./components/ThemeWrapper";
import MainRouter from "./router/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/style.css";
import "./assets/css/mediaquery.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <HashRouter>
          <ThemeWrapper>
            <MainRouter />
            <ToastContainer />
          </ThemeWrapper>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
