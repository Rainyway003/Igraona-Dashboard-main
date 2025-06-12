import React, {FC, useState} from 'react'
import {ConfigProvider, Layout, Space, Table, theme} from "antd";
import {DeleteButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import CalendarSmall from "./CalendarSmall";
import {Dayjs} from "dayjs";

const {Content} = Layout;

const ShowReserve: FC = () => {
  const navigate = useNavigate()

  const [sorters, setSorters] = useState([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

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
    <Layout style={{height: '100vh', overflowX: 'hidden', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '0px 14px',
            marginTop: '48px',
            padding: 24,
            minHeight: 1235,
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

          <div
className='pb-10'
            >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: '#000000',
                colorBgContainer: '#2a2929',
                colorPrimary: '#8D151F',
                controlItemBgActive: '#000000',
                colorText: '#ffffff',
                colorBgTextActive: '#ffffff',
                colorBgDisabled: '#ffffff',
                colorTextDisabled: '#605e5e',
                textsecondary: '#ffffff',
              },
              components: {
                Calendar: {
                  fullBg: '#000000', fullPanelBg: '#2a2929'
                }
              }
            }}
          >
            <CalendarSmall
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          </ConfigProvider>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ShowReserve