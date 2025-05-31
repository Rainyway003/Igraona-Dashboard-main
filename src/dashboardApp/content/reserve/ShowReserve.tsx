import React, {FC, useState} from 'react'
import {Avatar, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import {AntDesignOutlined, ArrowLeftOutlined, CheckOutlined} from "@ant-design/icons";
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from "../../providers/firebase";

const {Content} = Layout;

const ShowReserve: FC = () => {
  const navigate = useNavigate()

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList({
    resource: "reserve",
  })


  const Accept = async (record: any) => {
    const docRef = doc(db, "reserve", record.id);
    await updateDoc(docRef, {
      accepted: !record.accepted
    })
    window.location.reload();
  }

  const columns = [
    {
      title: 'Ime i Prezime',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kontakt',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Početak',
      dataIndex: 'startingAt',
      key: 'startingAt',
    },
    {
      title: 'Zasvršetak',
      dataIndex: 'endingAt',
      key: 'endingAt',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="reserve" icon={<CheckOutlined/>}
                      className={record.accepted === false ? 'bg-red-200' : 'bg-green-200'} recordItemId={record.id}
                      onClick={() => Accept(record)}/>
          <DeleteButton hideText size="small" resource="reserve" recordItemId={record.id}></DeleteButton>
        </Space>
      ),
    },
  ];

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

export default ShowReserve