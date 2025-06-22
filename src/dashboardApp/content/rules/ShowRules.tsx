import React, {FC, useState} from 'react'
import {Input, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import ShowRuleView from "./ShowRuleView";

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

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  if (isLoading) {
    return <div>...Loading</div>;
  }

  const columns = [
    {
      title: 'Ime pravila',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="rules" recordItemId={record.id}/>
          <DeleteButton hideText size="small" resource="reserve" recordItemId={record.id}></DeleteButton>
        </Space>
      ),
    },
  ];

  const handleExpand = (expanded: boolean, record: { id: number }) => {
    const keys = expanded ? [record.id] : [];
    setExpandedRowKeys(keys)
  }

  const expandable = {
    expandedRowRender: (record: any, expanded: any) => (
      <div style={{margin: 0}}>
        <ShowRuleView rule={rule}/>
      </div>
    ),
    expandedRowKeys,
    onExpand: handleExpand,
  };

  return (
    <Layout className="h-screen overflow-y-hidden" style={{display: 'flex', flexDirection: 'row'}}>

      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between'>
          <Input
            rootClassName={'w-96'}
            placeholder="Search rules"
            className='shadow-md'
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 12, marginTop: 12}}
          />
          <CreateButton
            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
            resource="tournaments"
            onClick={() => navigate('/rules/new')}
            style={{marginBottom: 12, marginTop: 12}}
          />
        </div>

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
            pagination={{
              pageSize: 5,
              position: ['bottomCenter'],
            }}
            expandable={expandable}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

export default ShowRules