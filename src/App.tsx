import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Advertisements from "./pages/Advertisements/Advertisements";
import NewAdvertisement from "./pages/Advertisements/NewAdvertisement/NewAdvertisement";
import Details from "./pages/Details.tsx/Details";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import theme from "./utility/themes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="page-container">
          <Navbar />
          <div className="component-container">
            <Routes>
              <Route path="*" element={<Navigate to="/login" />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="advertisements" element={<Advertisements />} />
              <Route path="advertisements/:id" element={<Details />} />
              <Route path="advertisements/new" element={<NewAdvertisement />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
