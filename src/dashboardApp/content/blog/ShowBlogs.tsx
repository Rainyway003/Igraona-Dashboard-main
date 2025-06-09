import React from 'react'
import {Layout, List, Space, Table, theme, Typography} from "antd";
import {useNavigate} from "react-router";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import {EyeOutlined} from "@ant-design/icons";

const {Content} = Layout;
const {Title} = Typography;

const ShowBlogs = () => {
  const navigate = useNavigate();

  const {data, isLoading} = useList({
    resource: "blog",
  });


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  if (isLoading) {
    return <div>...Loading</div>;
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="blog" icon={<EyeOutlined/>}
                      recordItemId={record.id}
                      onClick={() => navigate(`/blog/${record.id}`)}></EditButton>
          <EditButton hideText size="small" resource="blog" recordItemId={record.id}/>
          <DeleteButton hideText size="small" resource="blog" recordItemId={record.id}></DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <div className='sticky top-[7px] pr-6 pl-6 z-10 flex justify-end'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/blog/new')}
          >
            Create
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

          <Table
            loading={isLoading}
            dataSource={data?.data}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 5,
              position: ['bottomCenter'],
            }}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

function BlogPost({blog}) {
  return (
    <div dangerouslySetInnerHTML={{__html: blog}}/>
  );
}

export default ShowBlogs