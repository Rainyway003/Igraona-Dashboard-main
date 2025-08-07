import React, {FC, useState} from 'react'
import {Input, Space, Table, notification} from "antd";
import {DeleteButton, EditButton} from "@refinedev/antd";
import {useList, useDelete} from "@refinedev/core";
import {Dayjs} from "dayjs";
import {useNavigate, useOutletContext} from "react-router";
import {EyeOutlined} from '@ant-design/icons';


const ShowPlayMonths: FC = () => {

  const navigate = useNavigate()

  const [sorters, setSorters] = useState([
    {field: "id", order: "desc"},
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");


  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();


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
      </div>
    );
  }, [navigate, searchTerm, setHeaderActions]);

  const {data, isLoading} = useList<any>({
    resource: "plays",
    sorters: sorters,
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })


  const columns = [
    {
      title: 'Mjesec',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.id}
        </Space>
      ),
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="tournaments" icon={<EyeOutlined/>}
                      recordItemId={record.id}
                      onClick={() => navigate(`/plays/${record.id}`)}></EditButton>
          <DeleteButton
            hideText
            size="small"
            resource="plays"
            recordItemId={record.id}
            successNotification={false}
            onSuccess={() => {
              notification.success({
                message: "Mjesec je uspješno izbrisan.",
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
          pageSize: 12,
          position: ['bottomCenter'],
        }}
      />
    </>
  )
}

export default ShowPlayMonths