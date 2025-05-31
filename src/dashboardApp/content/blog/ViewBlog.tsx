import React from 'react';
import {Layout, theme, Typography} from "antd";
import {useNavigate, useParams} from "react-router";
import {useOne} from "@refinedev/core";

const {Content} = Layout;
const {Title} = Typography;

const ViewBlog = () => {
  const navigate = useNavigate();
  const {id} = useParams();

  const {data, isLoading} = useOne({
    resource: "blog",
    id: id || "",
  });

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Title level={2}>{data?.data.title}</Title>
          <div dangerouslySetInnerHTML={{__html: data?.data.blog}}/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ViewBlog;
