import { Route, Routes } from "react-router-dom";
import NPFCULayout from "../pages/Public/NPFCULayout";
import Home from "../pages/Public/Home";
import Loans from "../pages/Public/Loans";
import Rates from "../pages/Public/Rates";
import About from "../pages/Public/About";
import Contact from "../pages/Public/Contact";
import Membership from "../pages/Public/Membership";

function PublicRouting() {
  return (
    <NPFCULayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
    </NPFCULayout>
  );
}

export default PublicRouting;
