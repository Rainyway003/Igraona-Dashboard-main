import React, {useState} from 'react';
import {Table, Space, Input, Form, Button, Card, Progress, notification} from 'antd';
import {ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

import {useCreate, useList, useOne, useUpdate} from "@refinedev/core"
import {CreateButton, DeleteButton} from '@refinedev/antd';
import {useNavigate, useParams} from 'react-router';
import ShowPlayers from "../players/ShowPlayers";
import {useOutletContext} from "react-router-dom";
import BanTeamButton from "./BanTeam";
import {Timestamp} from "firebase/firestore";

interface ShowPlayersProps {
  children?: React.ReactNode;
}

const ShowTeams: React.FC<ShowPlayersProps> = ({children}) => {

  const navigate = useNavigate()
  const {id} = useParams();
  const {mutate, isLoading: createLoading} = useCreate()
  const {mutate: mutateEdit, isLoading: editLoading} = useUpdate()
  const [searchTerm, setSearchTerm] = useState('')

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  const {data: tournamentData} = useOne({
    resource: "tournaments",
    id: id,
  })

  const tournament = tournamentData?.data;

  const handlePublish = () => {
    mutateEdit({
      resource: "tournaments",
      id: id,
      values: {
        visible: !tournament?.visible,
      }
    })
  }

  React.useEffect(() => {
    if (!tournament) return;

    setHeaderActions(
        <div className="flex w-full justify-between">
          <div className={'flex gap-4'}>
            <CreateButton
                type="primary"
                className="antbutton"
                onClick={() => navigate('/tournaments')}
                icon={<ArrowLeftOutlined />}
            >
              Nazad
            </CreateButton>
            <Input
                rootClassName={'w-96'}
                placeholder="Pretraži timove"
                className="shadow-md"
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={'flex gap-4'}>
            <CreateButton
                type="primary"
                className="antbutton"
                onClick={() => navigate(`/tournaments/edit/${id}`)}
            >
              Uredi turnir
            </CreateButton>
            <CreateButton
                type="primary"
                className="antbutton"
                disabled={editLoading}
                onClick={handlePublish}
            >
              {tournament.visible ? "Sakrij turnir" : "Objavi"}
            </CreateButton>
          </div>
        </div>
    );

    return () => setHeaderActions(null);
  }, [tournament, searchTerm, setHeaderActions, navigate, editLoading]);


  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isCreate, setIsCreate] = useState(false);


  const {data: gameData} = useOne({
    resource: "games",
    id: tournament?.game,
  })
  const game = gameData?.data;

  const tournamentArray = tournament ? [
    {
      label: "Naziv turnira",
      value: tournament?.name
    },
    {
      label: "Igra",
      value: `${game?.name}`
    },
    {
      label: "Maksimalan broj timova",
      value: `${tournament?.maxNumberOfParticipants}`
    },
    {
      label: "Prijave počinju",
      value: tournament.signUpStartingAt?.toDate().toLocaleString() ?? "N/A",
    },
    {
      label: "Prijave završavaju",
      value: tournament.signUpEndingAt?.toDate().toLocaleString() ?? "N/A",
    },
    {
      label: "Turnir počinje",
      value: tournament.startingAt?.toDate().toLocaleString() ?? "N/A",
    },
    {
      label: "Turnir završava",
      value: tournament.endingAt?.toDate().toLocaleString() ?? "N/A",
    },
    {
      label: "Vidljiv",
      value: tournament.visible ? "Da" : "Ne",
    }
  ] : [];

  const {data, isLoading} = useList<any>({
    resource: "participants",
    meta: {
      tournamentId: id,
    },
    filters: [
      ...(searchTerm ? [{field: "name", operator: "contains" as const, value: searchTerm}] : []),
    ],
    sorters: [
      { field: "createdAt", order: "desc" }
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
        createdAt: Timestamp.fromDate(new Date()),
        ...players,
      },
      successNotification: false,
      errorNotification: false,
    }, {
      onSuccess: (response) => {
        const newTeamId = response?.data?.id;
        if (newTeamId) {
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
          disabled={createLoading}
          icon={<PlusSquareOutlined/>}
        >
          Dodaj tim
        </Button>
      </Form>,
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <DeleteButton hideText size="small"
                        confirmCancelText={"Odustani"}
                        confirmOkText={"Izbriši"}
                        confirmTitle={"Jeste li sigurni?"}
                        resource="participants"
                        recordItemId={record.id}
                        meta={{
                          tournamentId: id
                        }}
                        successNotification={false}
                        onSuccess={() => {
                          notification.success({
                            message: "Tim je uspješno izbrisan.",
                            description: "Uspješno!",
                          });
                        }}
          />

          <BanTeamButton resource="participants"
                         teamId={record.id}
          ></BanTeamButton>
        </Space>
      ),
    },
  ];

  const tournamentColumns = [
    {
      dataIndex: "label",
      key: "label",
    },
    {
      dataIndex: "value",
      key: "value",
    },
  ]

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
      <div className="w-full flex gap-4">
        <Table
          loading={isLoading}
          dataSource={tournamentArray}
          columns={tournamentColumns}
          rowKey="id"
          pagination={false}
          showHeader={false}
          bordered={true}
          style={{width: '50%', marginBottom: '10px'}}
        />
        <Space direction="vertical" style={{width: '50%', gap: '1rem'}}>
          <Card style={{width: '100%', height: '135px'}}>
            {tournament?.prizes?.length ? (
              tournament.prizes.map((prize, index) => (
                <p key={index}>{prize}</p>
              ))
            ) : (
              <p>Nema nagradi</p>
            )}
          </Card>
          <Card
            className="flex justify-center items-center"
            style={{width: '100%', height: '290px'}}>
            <Progress
              type={'circle'}
              size={250}
              percent={Math.floor(tournament?.numberOfParticipants / tournament?.maxNumberOfParticipants * 100)}/>
          </Card>
        </Space>
      </div>
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