import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Content
        style={{
          height: "100vh",
          overflowY: "auto",
          padding: "70px 20px 20px",
          backgroundColor: "#f0f2f5",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {headerActions}
        </div>

        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            minHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Outlet context={{ setHeaderActions }} />
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
