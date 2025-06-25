import React, {useState} from 'react'
import {Input, Space, Table, theme} from "antd";
import {useNavigate, useOutletContext} from "react-router";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";
import { EyeOutlined} from "@ant-design/icons";


const ShowBlogs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

    const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

    React.useEffect(() => {
        setHeaderActions(
            <div className="flex justify-between w-full">
                <Input
                    rootClassName={'w-96'}
                    placeholder="Pretraži blogove"
                    className='shadow-md'
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CreateButton
                    className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
                    resource="tournaments"
                    onClick={() => navigate('/blog/new')}
                >Stvori</CreateButton>
            </div>
        );
    }, [navigate, searchTerm, setHeaderActions ]);

  const {data, isLoading} = useList<any>({
    resource: "blog",
    filters: [
      ...(searchTerm ? [{field: "title", operator: "contains" as const, value: searchTerm}] : []),
    ]
  });

  if (isLoading) {
    return <div>...Loading</div>;
  }

  const columns = [
    {
      title: 'Naziv',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="blog" icon={<EyeOutlined/>}
                      recordItemId={record.id}
                      onClick={() => navigate(`/blog/${record.id}`)}></EditButton>
          <EditButton hideText size="small" resource="blog" recordItemId={record.id}/>
            <DeleteButton hideText size="small" recordItemId={record.id} resource="blog" meta={{
                bannedId: record.id
            }}></DeleteButton>
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

export default ShowBlogs