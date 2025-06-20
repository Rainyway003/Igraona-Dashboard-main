import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Avatar, Space, Progress, Select, Input} from 'antd';
import {AntDesignOutlined, EyeOutlined} from '@ant-design/icons';

const {Content} = Layout;

import {useList, useOne} from "@refinedev/core"
import {CreateButton, DeleteButton, EditButton, useSelect} from '@refinedev/antd';
import {useNavigate} from 'react-router';

const ShowTournaments: React.FC<PropsWithChildren> = ({children}) => {
  const navigate = useNavigate()

  const [selectedGame] = useState<string | undefined>(undefined);
  const [sorters, setSorters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {selectProps} = useSelect({
    resource: 'games',
    optionLabel: "name",
    optionValue: "name",
  })

  const tournamentId = window.location.pathname.split('/')[2]

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const {data, isLoading} = useList<any>({
    resource: "tournaments",
    meta: {
      tournamentId,
    },
    filters: [
      ...(selectedGame ? [{field: "game", operator: "contains" as const, value: selectedGame}] : []),
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ],
    sorters: sorters,
    queryOptions: {
      queryKey: ["tournaments", selectedGame, searchTerm, sorters],
    },
  });

  const {data: allGamesData} = useList({
    resource: "games",
    pagination: {
      mode: "off",
    },
  });

  const gameIdToNameMap = allGamesData?.data.reduce((acc: any, game: any) => {
    acc[game.id] = game.name;
    return acc;
  }, {}) || {};

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: () => <Avatar icon={<AntDesignOutlined/>}/>,
    },
    {
      title: 'Naziv turnira',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      filteredValue: null
    },
    {
      title: 'Igra',
      dataIndex: 'game',
      key: 'game',
      render: (gameId: string) => gameIdToNameMap[gameId] || "Nepoznata igra",
    },
    {
      title: 'Prijave',
      dataIndex: 'numberOfParticipants',
      key: 'numberOfParticipants',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.numberOfParticipants || 0} / {record.maxNumberOfParticipants || 0}
        </Space>
      ),
    },
    {
      title: 'Prijavljeni',
      dataIndex: 'numberOfParticipants',
      key: 'numberOfParticipants',
      render: (_: any, record: any) => (
        <Progress
          percent={Math.floor(record.numberOfParticipants / record.maxNumberOfParticipants * 100)}></Progress>
      ),
    },
    {
      title: 'Početak',
      dataIndex: 'startingAt',
      key: 'startingAt',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.startingAt.toDate().toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Kraj',
      dataIndex: 'endingAt',
      key: 'endingAt',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.endingAt.toDate().toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Početak Prijava',
      dataIndex: 'signUpStartingAt',
      key: 'signUpStartingAt',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.signUpStartingAt.toDate().toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Kraj Prijava',
      dataIndex: 'signUpEndingAt',
      key: 'signUpEndingAt',
      sorter: true,
      render: (_: any, record: any) => (
        <Space>
          {record.signUpEndingAt.toDate().toLocaleString()}
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
                      onClick={() => navigate(`/tournaments/${record.id}`)}></EditButton>
          <EditButton hideText size="small" resource="tournaments" recordItemId={record.id}/>
          <DeleteButton hideText size="small" resource="tournaments" recordItemId={record.id}/>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>

      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between'>
          <Input
            rootClassName={'w-96'}
            className='shadow-md'
            placeholder="Search tournaments"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{marginBottom: 12, marginTop: 12}}
          />
          <CreateButton
            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
            resource="tournaments"
            onClick={() => navigate('/tournaments/new')}
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
              pageSize: 10,
              position: ['bottomCenter'],
            }}
            onChange={(pagination, filters, sorter) => {
              const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
              const formattedSorters = sorterArray
                .filter((s) => s.order)
                .map((s) => ({
                  field: s.field,
                  order: s.order === "ascend" ? "asc" : "desc",
                }));
              setSorters(formattedSorters);
            }}
          />

          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default ShowTournaments;