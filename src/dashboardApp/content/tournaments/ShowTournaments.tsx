import React, {PropsWithChildren, useState} from 'react';
import {Table, Avatar, Space, Progress, Input} from 'antd';
import {AntDesignOutlined, EyeOutlined} from '@ant-design/icons';

import {useList} from "@refinedev/core"
import {CreateButton, DeleteButton, EditButton, useSelect} from '@refinedev/antd';
import {useNavigate, useOutletContext} from 'react-router';

const ShowTournaments: React.FC<PropsWithChildren> = ({children}) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <Input
          placeholder="Pretraži turnire"
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 shadow-md"
        />
        <CreateButton
          resource="tournaments"
          onClick={() => navigate('/tournaments/new')}
          className="antbutton"
        >Stvori</CreateButton>
      </div>
    );

    return () => setHeaderActions(null);
  }, [searchTerm]);


  const [selectedGame, setSelectedGame] = useState<string | undefined>(undefined);
  const [sorters, setSorters] = useState([
    {field: "startingAt", order: "asc"},
  ]);

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

  const {selectProps} = useSelect({
    resource: 'games',
    optionLabel: "name",
    optionValue: "id",
  })

  const tournamentId = window.location.pathname.split('/')[2]

  const {data, isLoading} = useList<any>({
    resource: "tournaments",
    meta: {
      tournamentId,
    },
    filters: [
      ...(selectedGame ? [{field: "game", operator: "eq", value: selectedGame}] : []),
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ],
    sorters: sorters,
    queryOptions: {
      queryKey: ["tournaments", selectedGame, searchTerm, sorters],
    },
  });

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: () => <Avatar icon={<AntDesignOutlined/>}/>,
    },
    {
      title: 'Naziv',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      filteredValue: null
    },
    {
      title: 'Igra',
      dataIndex: 'game',
      key: 'game',
      filters: selectProps.options?.map((option: any) => ({
        text: option.label,
        value: option.value,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.game === value,
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
      title: 'Početak prijava',
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
      title: 'Kraj prijava',
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
          <DeleteButton hideText size="small" resource="tournaments" recordItemId={record.id}/>
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
          pageSize: 10,
          position: ['bottomCenter'],
        }}
        onChange={(pagination, filters, sorter) => {
          if (filters.game && filters.game.length > 0) {
            setSelectedGame(filters.game[0]);
          } else {
            setSelectedGame(undefined);
          }

          let sorterArray = [];

          if (Array.isArray(sorter)) {
            sorterArray = sorter;
          } else if (sorter && sorter.field) {
            sorterArray = [sorter];
          }

          const formattedSorters = sorterArray
            .filter((s) => s.order)
            .map((s) => ({
              field: s.field,
              order: s.order === "ascend" ? "asc" : "desc",
            }));

          if (formattedSorters.length === 0) {
            setSorters([{field: "startingAt", order: "asc"}]);
          } else {
            setSorters(formattedSorters);
          }
        }}
      />

      {children}
    </>
  )
}

export default ShowTournaments;