import { useState } from "react";
import Assider from "../components/Assider";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard/Dashboard";
import DocumentTable from "../pages/Documents/DocumentTable";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatArea from "../pages/Chat/ChatArea";
import Search from "../components/Search";
import Activity from "../pages/Activity/Activity";

function AppRouting() {
  const [collapsed, setCollapsed] = useState(true);



  return (
    <div className="app-wrapper">
      <div className={collapsed ? "sidebar-collapsed" : "sidebar-expanded"}>
        <Assider collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="dashboard-col">
     <Header />
        <div className="main-content custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/documettable" element={<DocumentTable />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chat" element={<ChatArea />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default AppRouting;
