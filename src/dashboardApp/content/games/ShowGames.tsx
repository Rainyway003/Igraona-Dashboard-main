import React, {FC, useState} from 'react'
import {Avatar, Input, Layout, notification, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate, useOutletContext} from 'react-router';
import {useList} from "@refinedev/core";

const {Content} = Layout;

const ShowGames: FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <Input
          rootClassName={'w-96'}
          placeholder="Pretraži igre"
          className='shadow-md'
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CreateButton
          className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
          resource="tournaments"
          onClick={() => navigate('/games/new')}
        >Stvori</CreateButton>
      </div>
    );

    return () => setHeaderActions(null);
  }, [ setHeaderActions, navigate, searchTerm]);

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
      render: (_: any, record: any) => <Avatar src={record.imageUrl}/>,
    },
    {
      title: 'Naziv igre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="games" recordItemId={record.id}/>
            <DeleteButton hideText size="small" confirmCancelText={"Odustani"} confirmOkText={"Izbriši"} confirmTitle={"Jeste li sigurni?"}  resource="games" recordItemId={record.id}
                          successNotification={false}
                          onSuccess={() => {
                              notification.success({
                                  message: "Igra je uspješno izbrisana.",
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

export default ShowGames