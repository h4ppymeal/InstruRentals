import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/AccountPage";
import InstrumentsPage from "./pages/InstrumentsPage";
import InstrumentsFormPage from "./pages/InstrumentsFormPage";
import InstrumentPage from "./pages/InstrumentPage";
import RentalPage from "./pages/RentalPage";
import RentalsPage from "./pages/RentalsPage";

// he changed this to 127.0.0.1 but i didnt change it since i didnt get the same error
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/instruments" element={<InstrumentsPage />} />
          <Route
            path="/account/instruments/new"
            element={<InstrumentsFormPage />}
          />
          <Route
            path="/account/instruments/:id"
            element={<InstrumentsFormPage />}
          />
          <Route path="/instrument/:id" element={<InstrumentPage />} />
          <Route path="/account/rentals" element={<RentalsPage />} />
          <Route path="/account/rentals/:id" element={<RentalPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
