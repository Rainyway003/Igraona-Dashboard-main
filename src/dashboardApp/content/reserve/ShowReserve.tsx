import React, {FC, useState} from 'react'
import {ConfigProvider, Input, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import CalendarSmall from "./CalendarSmall";
import {Dayjs} from "dayjs";
import {useNavigate, useOutletContext} from "react-router";

const {Content} = Layout;

const ShowReserve: FC = () => {

  const navigate = useNavigate()

  const [sorters, setSorters] = useState([]);
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex justify-between w-full">
          <Input
              rootClassName={'w-96'}
              placeholder="Search tournaments"
              className='shadow-md'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    );
  }, [navigate, searchTerm, setHeaderActions ]);

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
    <>
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
    </>
  )
}

export default ShowReserve