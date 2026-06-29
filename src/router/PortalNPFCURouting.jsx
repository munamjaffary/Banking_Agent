import { useState } from "react";
import Assider from "../components/Assider";
import Header from "../components/Header";
import NPFCULayout from "../pages/Public/NPFCULayout";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Public/Home";
import Loans from "../pages/Public/Loans";
import Rates from "../pages/Public/Rates";
import About from "../pages/Public/About";
import Contact from "../pages/Public/Contact";
import Membership from "../pages/Public/Membership";
import DocumentTable from "../pages/Documents/DocumentTable";
import ChatArea from "../pages/Chat/ChatArea";
import Search from "../components/Search";
import KnowledgeBase from "../pages/KnowledgeBase/KnowledgeBase";
import NLU from "../pages/NLU/NLU";

function PortalNPFCURouting() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="app-wrapper">
      <div className={collapsed ? "sidebar-collapsed" : "sidebar-expanded"}>
        <Assider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="dashboard-col">
        <Header />
        <div className="main-content" style={{ padding: 0 }}>
          <NPFCULayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/rates" element={<Rates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/portal/knowledgebase" element={<KnowledgeBase />} />
              <Route path="/portal/documents" element={<DocumentTable />} />
              <Route path="/portal/search" element={<Search />} />
              <Route path="/portal/chat" element={<ChatArea />} />
              <Route path="/portal/nlu" element={<NLU />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </NPFCULayout>
        </div>
      </div>
    </div>
  );
}

export default PortalNPFCURouting;