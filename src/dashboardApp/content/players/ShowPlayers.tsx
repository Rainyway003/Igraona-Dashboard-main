import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Space, Form, Button, Input} from 'antd';

const {Content} = Layout;

import {useOne} from "@refinedev/core"
import {useParams} from 'react-router';

import BanPlayer from './BanPlayer';
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined, StarOutlined} from "@ant-design/icons";

const ShowPlayers: React.FC<PropsWithChildren<{}>> = ({children, teamId}) => {
  const {id} = useParams();
  const [isEdit, setIsEdit] = useState<boolean>(false);


  const {data: tData,} = useOne({
    resource: 'tournaments',
    id: id ?? "",
  })
  const tournament = tData?.data
  console.log(id)
  console.log(teamId)
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

  console.log(teamId)
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
  console.log(isEdit)

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = async (values: any) => {
    const cleanValues = cleanObject(values);

    await formProps.onFinish?.(cleanValues);
  }

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
          <Form.Item>
            <div className="flex justify-end w-full p-2">
              {isEdit ?
                <div className="flex gap-1">
                  <CreateButton
                    type="primary"
                    className="antbutton"
                    onClick={handleEditClick}
                    icon={<ArrowLeftOutlined/>}
                  >
                    Cancel
                  </CreateButton>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="antbutton"
                    icon={<PlusSquareOutlined/>}
                  >
                    Submit
                  </Button>
                </div>
                :
                <CreateButton
                  type="primary"
                  className="antbutton"
                  onClick={handleEditClick}
                  icon={<ArrowLeftOutlined/>}
                >
                  Edit
                </CreateButton>
              }

            </div>
          </Form.Item>

          {isEdit ?
            <div className={'flex flex-col'}>
              {Array.from({length: tournament?.teamSizeRequired || 0}).map((_, index) => (
                <Form.Item
                  key={index}
                  name={`player${index + 1}`}
                  rules={[{required: true}]}
                >
                  <Input placeholder={`Igrač ${index + 1} Faceit link`}
                         prefix={<StarOutlined className={'text-red-500'}/>}/>
                </Form.Item>
              ))}
              {Array.from({length: tournament?.teamSizeOptional || 0}).map((_, index) => (
                <Form.Item
                  key={index}
                  name={`player${index + 1 + Number(tournament?.teamSizeRequired)}`}
                >
                  <Input
                    placeholder={`Rezerva ${index + 1 + Number(tournament?.teamSizeRequired)} Faceit link`}/>
                </Form.Item>
              ))}
            </div>
            :
            <div>
              {team && Object.entries(team)
                .filter(([key, value]) => key.startsWith('player') && value)
                .map(([key, value], index) => (
                  <p key={key} id={key}>
                    <StarOutlined className="text-red-500"/> {value}
                  </p>
                ))}
            </div>
          }
          {children}
        </Content>
      </Layout>
    </Form>
  );
};

export default ShowPlayers;