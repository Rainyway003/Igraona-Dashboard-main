import React, {FC, useState} from 'react'
import {Avatar, Input, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";

const {Content} = Layout;

const ShowGames: FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList<any>({
    resource: "games",
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: () => <Avatar/>,
    },
    {
      title: 'Naziv Igre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="games" recordItemId={record.id}/>
          <DeleteButton hideText size="small" resource="games" recordItemId={record.id}/>
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
            placeholder="Search tournaments"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 16}}
          />
          <CreateButton
            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
            resource="tournaments"
            onClick={() => navigate('/games/new')}
          />
        </div>


        <Content
          style={{
            margin: '0px 14px',
            padding: 24,
            minHeight: 360,
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
            onRow={(record) => ({
              onClick: (event) => {
                const target = event.target as HTMLElement;
                if (target.closest('button')) return;
                navigate(`/tournaments/${record.id}`);
              },
            })}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

export default ShowGames