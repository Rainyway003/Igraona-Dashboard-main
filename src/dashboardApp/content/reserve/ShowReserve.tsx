import React, {FC, useState} from 'react'
import {ConfigProvider, Input, Space, Table, Typography, Dropdown, Button} from "antd";
import { DeleteButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import CalendarSmall from "./CalendarSmall";
import {Dayjs} from "dayjs";
import {useNavigate, useOutletContext} from "react-router";
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDelete } from "@refinedev/core";
import { notification } from "antd";


const ShowReserve: FC = () => {

  const navigate = useNavigate()

  const [sorters, setSorters] = useState([
      { field: "date", order: "asc" },
  ]);

  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

    const { mutate: deleteReserve } = useDelete();

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  const [show, setShow]= useState('1')

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Tabela',
        },
        {
            key: '2',
            label: 'Kalendar',
        },
    ];

    const selectedLabel = items?.find((item) => item?.key === show)?.label;

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex w-full gap-4">
          <Input
              rootClassName={'w-96'}
              placeholder="Pretraži turnire"
              className='shadow-md'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
            <Dropdown
                menu={{
                    items,
                    selectable: true,
                    defaultSelectedKeys: ['1'],
                    onSelect: ({ key }) => setShow(key),
                }}
            >
                <Button>
                    <Space>
                        {selectedLabel}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </div>
    );
  }, [navigate, searchTerm, setHeaderActions, show ]);

  const {data, isLoading} = useList<any>({
    resource: "reserve",
    sorters: sorters,
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })


  const columns = [
    {
      title: 'Ime i prezime',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kontakt',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Datum',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.date.toDate().toLocaleString()}
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
                  successNotification={false}
                  onSuccess={() => {
                      notification.success({
                          message: "Rezervacija je uspješno izbrisana.",
                          description: "Uspješno!",
                      });
                  }}
                  confirmCancelText="Odustani"
                  confirmOkText="Izbriši"
                  confirmTitle="Jeste li sigurni?"
              />
          </Space>
      )
    },
  ];

    return (
    <>
        {show === '1' ? (
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
  ) : (
        <div
            className='pb-10'
        >
            <ConfigProvider
                theme={{
                    token: {
                        colorBgBase: '#fff',
                        colorBgContainer: '#cda9ac',
                        colorPrimary: '#785151',
                        controlItemBgActive: '#bab0b0',
                        colorText: '#000000',
                        colorBgTextActive: '#ffffff',
                        colorBgContainerDisabled: '#ffffff',
                        colorTextDisabled: '#605e5e',
                        colorTextSecondary: '#ffffff',
                    },
                    components: {
                        Calendar: {
                            fullBg: '#dfdede',
                            controlItemBgHover: 'transparent'
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
    )}
    </>
  )
}

export default ShowReserve