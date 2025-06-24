import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Space, Form, Button, Input} from 'antd';

const {Content} = Layout;

import {useDelete, useOne} from "@refinedev/core"
import {useParams} from 'react-router';

import BanPlayer from './BanPlayer';
import {CreateButton, useForm} from "@refinedev/antd";

interface ShowPlayersProps {
  teamId: string;
  create: boolean;
  children?: React.ReactNode;
}

const ShowPlayers: React.FC<PropsWithChildren<ShowPlayersProps>> = ({children, teamId, create}) => {
  const {id} = useParams();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(create);

  const {mutate} = useDelete()

  console.log(teamId, 'JPOO')

  const {data: tData,} = useOne({
    resource: 'tournaments',
    id: id ?? "",
  })
  const tournament = tData?.data

  const {formProps} = useForm({
    resource: "participants",
    id: teamId,
    action: "edit",
    meta: {
      tournamentId: id,
    },
    onMutationSuccess: () => {
      setIsEdit(false);
      setIsCreate(false);
    },
  });


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();


  const {data, isLoading} = useOne({
    resource: "participants",
    id: teamId,
    meta: {
      tournamentId: id,
    },
  });

  function getPlayersArray(teamData: any, tournament?: any) {
    if (!teamData) return [];

    const numberOfPlayers = Number(tournament?.teamSizeOptional ?? 0) + Number(tournament?.teamSizeRequired ?? 0);

    const playersArray = [];

    for (let i = 1; i <= numberOfPlayers; i++) {
      const key = `player${i}`;
      playersArray.push(teamData[key] ?? null);
    }

    return playersArray;
  }

  const team = data?.data
  console.log(team?.player1)
  const handleEditClick = () => {
    if (isCreate && team?.player1 === "") {
      mutate({
        resource: "participants",
        id: teamId,
        meta: {
          tournamentId: id,
        },
        successNotification: () => false,
      })
      setIsCreate(false);
      setIsEdit(false);
    } else if (isEdit || isCreate) {
      setIsEdit(false);
      setIsCreate(false);
    } else {
      setIsEdit(true);
      setIsCreate(true)
    }
  }

  const onFinish = async (values: any) => {
    console.log("onFinish values:", values);
    console.log("tournament:", tournament);

    const numberOfPlayers = Number(tournament?.teamSizeOptional ?? 0) + Number(tournament?.teamSizeRequired ?? 0);

    const playerFields: Record<string, string> = {};
    for (let i = 0; i < numberOfPlayers; i++) {
      playerFields[`player${i + 1}`] = values[`player${i + 1}`] || "";
    }

    const teamValues = {
      name: values?.name || "",
      number: values?.number || "",
      ...playerFields,
    };

    formProps.onFinish?.(teamValues);
  }



  const columns = [
    {
      title: isEdit || isCreate ?
        <Form.Item className={'m-0'} name="name">
          <Input placeholder={'Ime tima'}/>
        </Form.Item>
        :
        <div>{team?.name}</div>,
      render: (_: any, record: any, index: number) => (
        isEdit || isCreate ?
          <Form.Item className={'m-0'} name={`player${index + 1}`}>
            <Input placeholder={`${index + 1}`}/>
          </Form.Item>
          :
          <Space>
            {record}
          </Space>
      ),
    },
    {
      title: isEdit || isCreate ?
        <Form.Item className={'m-0'} name={'number'} initialValue={team?.number}>
          <Input placeholder={'Kontakt'}/>
        </Form.Item>
        :
        <div>{team?.number}</div>,
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: <Form.Item className={'flex justify-end m-0'}>
        {isEdit || isCreate ?
          <div className="flex gap-2">
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={handleEditClick}
              icon={null}
            >
              Odustani
            </CreateButton>
            <Button
              type="primary"
              htmlType="submit"
              className="antbutton"
            >
              Potvrdi
            </Button>
          </div>
          :
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={handleEditClick}
            icon={null}
          >
            Uredi
          </CreateButton>
        }
      </Form.Item>,
      key: 'actions',
      render: (_: any, record: any, index: number) => (
        <Space>
          {!isEdit && !isCreate && (
            <BanPlayer
              player={record}
              teamId={teamId}
              tournamentId={id}
            />
          )}
        </Space>
      )
    },
  ];


  return (
    <Form {...formProps} layout="vertical" onFinish={onFinish}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '1px 1px',
            width: '100%',
            padding: 4,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >

          <Table
            loading={isLoading}
            pagination={false}
            dataSource={
              isEdit || isCreate
                ? getPlayersArray(data?.data, tournament)
                : getPlayersArray(data?.data, tournament).filter((p) => !isBlank(p))
            }
            columns={columns}
            rowKey="id"
          />
          {children}
        </Content>
      </Layout>
    </Form>
  );
};

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}

export default ShowPlayers;