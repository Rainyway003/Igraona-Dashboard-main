import React, {FC, useState} from 'react'
import {ConfigProvider, Input, Layout, Space, Table, theme} from "antd";
import {DeleteButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import CalendarSmall from "./CalendarSmall";
import {Dayjs} from "dayjs";

const {Content} = Layout;

const ShowReserve: FC = () => {

  const [sorters, setSorters] = useState([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList<any>({
    resource: "reserve",
    sorters: sorters,
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
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
        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between'>
          <Input
            rootClassName={'w-96'}
            placeholder="Search tournaments"
            className='shadow-md'
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 12, marginTop: 12}}
          />
        </div>
        <Content
          style={{
            margin: '14px 14px',
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
                  colorBgContainerDisabled: '#ffffff',
                  colorTextDisabled: '#605e5e',
                  colorTextSecondary: '#ffffff',
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