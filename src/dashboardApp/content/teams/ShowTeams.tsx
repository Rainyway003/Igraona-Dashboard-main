import React, { useState} from 'react';
import { Table, Space, Input, Form, Button} from 'antd';
import { ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

import {useCreate, useList, useOne} from "@refinedev/core"
import {CreateButton, DeleteButton} from '@refinedev/antd';
import {useNavigate, useParams} from 'react-router';
import ShowPlayers from "../players/ShowPlayers";
import {useOutletContext} from "react-router-dom";
import BanTeamButton from "./BanTeam";

interface ShowPlayersProps {
  children?: React.ReactNode;
}

const ShowTeams: React.FC<ShowPlayersProps> = ({children}) => {

  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex w-full gap-4">
          <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/tournaments')}
              icon={<ArrowLeftOutlined/>}
          >
            Nazad
          </CreateButton>
          <Input
              rootClassName={'w-96'}
              placeholder="Pretraži timove"
              className='shadow-md'
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
    );

    return () => setHeaderActions(null);
  }, [setHeaderActions, navigate, searchTerm]);

  const {id} = useParams();
  const {mutate} = useCreate()

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isCreate, setIsCreate] = useState(false);

  const {data: tournamentData} = useOne({
    resource: "tournaments",
    id: id,
  })

  const tournament = tournamentData?.data;

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
          <BanTeamButton  resource="participants"
                          teamId={record.id}
                          ></BanTeamButton>
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
            expandable={expandable}
          />

          {children}
    </>
  );
};

export default ShowTeams;