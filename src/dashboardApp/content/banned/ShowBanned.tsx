import React, {FC, useState} from 'react'
import {Input, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";

const {Content} = Layout;

const ShowBanned: FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList({
    resource: "banned",
    filters: [
      ...(searchTerm ? [{field: "faceit", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })

  const columns = [
    {
      title: 'Faceit Igrača',
      dataIndex: 'faceit',
      key: 'faceit',
      render: (_: any, record: any) => (
        <Space>
          <a href={record.faceit}>{record.faceit}</a>
        </Space>
      ),
    },
    {
      title: 'Razlog Bana',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <DeleteButton hideText size="small" resource="banned" recordItemId={record.id}></DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between'>
          <Input
            rootClassName={'w-96'}
            placeholder="Search bans"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 16}}
          />
          <CreateButton
            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
            resource="tournaments"
            onClick={() => navigate('/banned/new')}
          />
        </div>
        <Content
          style={{
            margin: '0px 14px',
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

export default ShowBanned