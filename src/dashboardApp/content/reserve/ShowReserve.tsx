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

  const [sorters, setSorters] = useState([]);

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList({
    resource: "reserve",
    sorters: sorters,
  })

  console.log("Sorteri:", sorters);

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
      title: 'Vrijeme',
      dataIndex: 'vrijeme',
      key: 'vrijeme',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.vrijeme.toDate().toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <DeleteButton
            hideText
            size="small"
            resource="reserve"
            recordItemId={record.id}
            onClick={() => console.log("Deleting record ID:", record.id)}
          />
        </Space>
      )
    },
  ];

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
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
            onChange={(_, __, sorter) => {
              const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
              const formattedSorters = sorterArray
                .filter((s) => s.order)
                .map((s) => ({
                  field: s.field,
                  order: s.order === "ascend" ? "asc" : "desc",
                }));
              setSorters(formattedSorters);
            }}

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