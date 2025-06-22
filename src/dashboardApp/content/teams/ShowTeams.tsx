import React, {PropsWithChildren, useEffect, useState} from 'react';
import {Layout, theme, Table, Avatar, Space, Input, Form, Button} from 'antd';
import {EyeOutlined, ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

const {Content} = Layout;

import {useCreate, useList, useOne} from "@refinedev/core"
import {CreateButton, DeleteButton} from '@refinedev/antd';
import {useNavigate, useParams} from 'react-router';
import ShowPlayers from "../players/ShowPlayers";

interface ShowPlayersProps {
  children?: React.ReactNode;
}

const ShowTeams: React.FC<ShowPlayersProps> = ({children}) => {
  const {id} = useParams();
  const {mutate} = useCreate()

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreate, setIsCreate] = useState(false);

  const navigate = useNavigate()

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data: tournamentData} = useOne({
    resource: "tournaments",
    id: id,
  })

  const tournament = tournamentData?.data;
  console.log(tournament)

  const {data, isLoading} = useList<any>({
    resource: "participants",
    meta: {
      tournamentId: id,
    },
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ]
  })

  const onFinish = async () => {
    const totalPlayers = tournament?.teamSizeRequired + tournament?.teamSizeOptional;

    const players: Record<string, string> = {};
    for (let i = 1; i <= totalPlayers; i++) {
      players[`player${i}`] = "";
    }

    mutate({
      resource: "participants",
      values: {
        tournamentId: tournament?.id,
        ...players,
      },
      successNotification: false,
      errorNotification: false,
    }, {
      onSuccess: (response) => {
        const newTeamId = response?.data?.id;
        if (newTeamId) {
          console.log(newTeamId, "expanded")
          console.log(expandedRowKeys)
          setExpandedRowKeys([newTeamId]);
        }
      }
    });
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
      title: <Form className={'flex justify-end'} onFinish={onFinish}>
        <Button
          type="primary"
          htmlType="submit"
          className="antbutton"
          onClick={() => setIsCreate(true)}
          icon={<PlusSquareOutlined/>}
        >
          Dodaj tim
        </Button>
      </Form>,
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <DeleteButton hideText
                        size="small"
                        resource="participants"
                        recordItemId={record.id}
                        meta={{
                          tournamentId: id
                        }}/>
        </Space>
      ),
    },
  ];

  const handleExpand = (expanded: boolean, record: any) => {
    const keys = expanded ? [record.id] : [] as string[];
    setExpandedRowKeys(keys)
  }

  const expandable = {
    expandedRowRender: (record: any, expanded: any) => (
      <div style={{margin: 0}}>
        <ShowPlayers teamId={record.id} create={isCreate}/>
      </div>
    ),
    expandedRowKeys,
    onExpand: handleExpand,
  };


  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row', overflowX: "hidden"}}>
      <Layout style={{
        height: expandedRowKeys.length === 1 ? '145vh' : '10vh',
        background: '#f0f2f5'
      }}>
        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
          <div className={'flex gap-4'}>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/tournaments')}
              icon={<ArrowLeftOutlined/>}
              style={{marginBottom: 10, marginTop: 10}}
            >
              Back
            </CreateButton>
            <Input
              rootClassName={'w-96'}
              placeholder="Search teams"
              className='shadow-md'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{marginBottom: 10, marginTop: 10}}
            />
          </div>
        </div>
        <Content
          style={{
            margin: '2px 14px',
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