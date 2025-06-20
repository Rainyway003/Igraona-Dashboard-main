import React from 'react';
import {Layout, theme, Typography} from "antd";
import {useNavigate, useParams} from "react-router";
import {useOne} from "@refinedev/core";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

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

        <div className='sticky top-[7px] pr-[14px] pl-[14px] z-10 flex justify-start'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/blog')}
            icon={<ArrowLeftOutlined/>}
            style={{marginBottom: 12, marginTop: 12}}
          >
            Back
          </CreateButton>
        </div>

        <Content
          style={{
            margin: '14px 14px',
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