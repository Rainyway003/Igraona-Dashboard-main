import React, {FC, useState} from 'react'
import {Avatar, Layout, List, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import ShowRuleView from "./ShowRuleView";

const {Content} = Layout;

const ShowRules: FC = () => {
  const navigate = useNavigate();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const {data, isLoading} = useList({
    resource: "rules",
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

  const handleExpand = (expanded: boolean, record: any) => {
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
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>

      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <div className='sticky top-[7px] pr-[14px] pl-[14px] z-10 flex justify-end mb-4'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/rules/new')}
          >
            Create
          </CreateButton>
        </div>

        <Content
          style={{
            margin: '0px 14px',
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

function BlogPost({rule}) {
  return (
    <div dangerouslySetInnerHTML={{__html: rule}}/>
  );
}

export default ShowRules