import React, {useState} from 'react'
import {Input, Layout, Space, Table, theme} from "antd";
import {useNavigate} from "react-router";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import {EyeOutlined} from "@ant-design/icons";

const {Content} = Layout;

const ShowBlogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const {data, isLoading} = useList<any>({
    resource: "blog",
    filters: [
      ...(searchTerm ? [{field: "title", operator: "contains" as const, value: searchTerm}] : []),
    ]
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

        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between'>
          <Input
            rootClassName={'w-96'}
            placeholder="Search blogs"
            className='shadow-md'
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 12, marginTop: 12}}
          />
          <CreateButton
            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
            resource="tournaments"
            onClick={() => navigate('/blog/new')}
            style={{marginBottom: 12, marginTop: 12}}
          />
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

export default ShowBlogs