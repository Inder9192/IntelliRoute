import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0d0d0d" }}>
      <DashboardSidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "40px 48px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
