import React, {useState} from "react";
import {Layout} from "antd";
import Sidebar from "../Sidebar";
import {Outlet} from "react-router";

const {Content} = Layout;

const AppLayout: React.FC = () => {
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  return (
    <Layout style={{height: "100vh", overflow: "hidden"}}>
      <Sidebar/>
      <Content
        style={{
          height: "100vh",
          padding: "70px 20px 20px",
          backgroundColor: "#f0f2f5",
          position: "relative",
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
            height: "calc(100vh - 95px)",
            overflowY: "auto",
          }}
        >
          <Outlet context={{setHeaderActions}}/>
        </div>
      </Content>

    </Layout>
  );
};

export default AppLayout;
