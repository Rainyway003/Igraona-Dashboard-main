import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Space, Form, Button, Input} from 'antd';

const {Content} = Layout;

import {useOne} from "@refinedev/core"
import {useParams} from 'react-router';

import BanPlayer from './BanPlayer';
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";

const ShowPlayers: React.FC<PropsWithChildren<{}>> = ({children, teamId}) => {
  const {id} = useParams();
  const [isEdit, setIsEdit] = useState<boolean>(false);


  const {data: tData,} = useOne({
    resource: 'tournaments',
    id: id ?? "",
  })
  const tournament = tData?.data


  const {formProps, saveButtonProps, query} = useForm({
    resource: "participants",
    id: id,
    action: "edit",
    meta: {
      teamId: teamId
    },
    onMutationSuccess: () => {
      setIsEdit(!isEdit)
    }
  });


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();


  const {data, isLoading} = useOne({
    resource: "participants",
    id: id,
    meta: {
      teamId: teamId,
    },
  })
  const team = data?.data

  console.log(team)

  const handleEditClick = () => {
    setIsEdit(!isEdit)
  }

  const onFinish = async (values: any) => {
    const numberOfPlayers = Number(tournament?.teamSizeOptional ?? 0) + Number(tournament?.teamSizeRequired ?? 0);

    const players = Array.from({length: numberOfPlayers}, (_, i) => {
      const key = `player${i + 1}`;
      return values[key] || "";
    });

    const teamValues = {
      name: values?.name,
      number: values?.number,
      players
    };

    await formProps.onFinish?.(teamValues)
  }

  const columns = [
    {
      title: isEdit ?
        <Form.Item className={'m-0'} name="name" initialValue={team?.name}>
          <Input placeholder={'Ime tima'}/>
        </Form.Item>
        :
        <div>{team?.name}</div>,
      render: (_: any, record: any, index: number) => (
        isEdit ?
          <Form.Item className={'m-0'} name={`player${index + 1}`} initialValue={record}>
            <Input placeholder={`${index + 1}`}/>
          </Form.Item>
          :
          <Space>
            {record}
          </Space>
      ),
    },
    {
      title: isEdit ?
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
        {isEdit ?
          <div className="flex gap-2">
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={handleEditClick}
              icon={null}
            >
              Cancel
            </CreateButton>
            <Button
              type="primary"
              htmlType="submit"
              className="antbutton"
            >
              Submit
            </Button>
          </div>
          :
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={handleEditClick}
            icon={null}
          >
            Edit
          </CreateButton>
        }
      </Form.Item>,
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {/* <DeleteButton hideText size="small" resource="tournaments" recordItemId={record.id} /> */}
          {isEdit ?
            null
            :
            <BanPlayer player={record}></BanPlayer>
          }
        </Space>
      ),
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
            dataSource={isEdit ? data?.data.players : data?.data.players.filter((player) => !isBlank(player))}
            columns={columns}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: (event) => {
                const target = event.target as HTMLElement;
                if (
                  target.closest('button') ||
                  target.closest('input') ||
                  target.closest('.ant-modal')
                ) {
                  return;
                }
                window.location.replace(`${record.name}`)
              },
            })}
          />
          {children}
        </Content>
      </Layout>
    </Form>
  );
};

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

export default ShowPlayers;