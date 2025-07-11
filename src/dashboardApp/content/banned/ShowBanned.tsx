import React, {FC, useState} from 'react'
import {Input, notification, Space, Table} from "antd";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import {useOutletContext} from "react-router-dom";

const ShowBanned: FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex justify-between w-full">
          <Input
              rootClassName={'w-96'}
              placeholder="Pretraži banove"
              className='shadow-md'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CreateButton
              className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
              resource="tournaments"
              onClick={() => navigate('/banned/new')}
          >Stvori</CreateButton>

        </div>
    );
  }, [navigate, searchTerm, setHeaderActions ]);

  const {data, isLoading} = useList({
    resource: "banned",
    filters: [
      ...(searchTerm ? [{field: "faceit", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })

  const columns = [
    {
      title: 'Faceit igrača',
      dataIndex: 'faceit',
      key: 'faceit',
      render: (_: any, record: any) => (
        <Space>
          <a href={record.faceit}>{record.faceit}</a>
        </Space>
      ),
    },
    {
      title: 'Razlog',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
            <DeleteButton hideText size="small" confirmCancelText={"Odustani"} confirmOkText={"Izbriši"} confirmTitle={"Jeste li sigurni?"} resource="banned" recordItemId={record.id} meta={{
                bannedId: record.id
            }}
                          successNotification={false}
                          onSuccess={() => {
                              notification.success({
                                  message: "Banana osoba je uspješno izbrisana.",
                                  description: "Uspješno!",
                              });
                          }}
            />

        </Space>
      ),
    },
  ];

  return (
    <>
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
    </>
  )
}

export default ShowBanned