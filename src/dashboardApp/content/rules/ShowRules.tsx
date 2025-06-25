import React, {FC, useState} from 'react'
import {Input, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import ShowRuleView from "./ShowRuleView";
import {useOutletContext} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";

const {Content} = Layout;

const ShowRules: FC = () => {
  const navigate = useNavigate();
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {data, isLoading} = useList<any>({
    resource: "rules",
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
  });

  const rule = data?.data;

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <Input
          rootClassName={'w-96'}
          placeholder="Pretraži pravila"
          className='shadow-md'
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CreateButton
          className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
          resource="tournaments"
          onClick={() => navigate('/rules/new')}
        >Stvori</CreateButton>
      </div>
    );
  }, [navigate, searchTerm, setHeaderActions]);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  const columns = [
    {
      title: 'Naziv',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="blog" icon={<EyeOutlined/>}
                      recordItemId={record.id}
                      onClick={() => navigate(`/rules/${record.id}`)}></EditButton>
          <EditButton hideText size="small" resource="rules" recordItemId={record.id}/>
            <DeleteButton hideText size="small" recordItemId={record.id} resource="rules" meta={{
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

export default ShowRules