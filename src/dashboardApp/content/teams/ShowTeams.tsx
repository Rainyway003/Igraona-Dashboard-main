import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Avatar, Space} from 'antd';
import {EyeOutlined, ArrowLeftOutlined} from '@ant-design/icons';

const {Content} = Layout;

import {useList} from "@refinedev/core"
import {CreateButton, DeleteButton, EditButton} from '@refinedev/antd';
import {useNavigate, useParams} from 'react-router';
import ShowPlayers from "../players/ShowPlayers";

interface ShowPlayersProps {
  teamId: any;
}

const ShowTeams: React.FC<ShowPlayersProps> = ({children}) => {
  const {id} = useParams();

  const [teamId, setTeamId] = React.useState<any | undefined>(undefined);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const navigate = useNavigate()

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList({
    resource: "participants",
    meta: {
      tournamentId: id,
    },
  })

  const handleEdit = (record: any) => {
    setTeamId(record.id)
  };

  const columns = [
    {
      title: 'Naziv tima',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kontakt',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" resource="tournaments" icon={<EyeOutlined/>}
                      recordItemId={record.id} onClick={() => handleEdit(record)}></EditButton>
          {/*<EditButton hideText size='small' resource="participants" recordItemId={record.id}/>*/}
          <DeleteButton hideText size="small" resource="participants" recordItemId={record.id} meta={{
            id: id
          }}/>
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
        <ShowPlayers teamId={record.id}/>
      </div>
    ),
    expandedRowKeys,
    onExpand: handleExpand,
  };

  console.log('expand!', expandedRowKeys)

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row', overflowX: "hidden"}}>
      <Layout style={{
        height: expandedRowKeys.length === 1 ? '145vh' : '10vh',
        background: '#f0f2f5'
      }}>
        <div className='sticky top-[7px] pr-6 pl-6 z-10 flex justify-between'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/tournaments')}
            icon={<ArrowLeftOutlined/>}
          >
            Back
          </CreateButton>
          <CreateButton
            resource="tournaments"
            className='antbutton'
            onClick={() => navigate(`/tournaments/${id}/new`)}
          />
        </div>
        <Content
          style={{
            margin: '14px 14px',
            marginBottom: '13px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 48px)',
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

          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShowTeams;