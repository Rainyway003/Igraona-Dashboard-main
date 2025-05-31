import {Button, Checkbox, DatePicker, Form, Input, Layout, Modal, Select, Space, theme} from 'antd'
import {useNavigate, useParams} from 'react-router'
import React, {useState} from 'react';
import {useCreate, useOne, useUpdate} from '@refinedev/core';
import ShowTeams from '../ShowTeams';
import CreateTeamForm from './CreateTeamForm';
import {CreateButton} from "@refinedev/antd";
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  StarOutlined
} from "@ant-design/icons";
import FormInput from "../../../../landingPage/components/forms/FormInput";

const {Content} = Layout

type CreateTeamFormValues = {
  name: string
  number: number
}


const CreateTeam = () => {
  const {id} = useParams()
  const {mutate, isLoading: loading} = useCreate()

  const {data, isLoading, isError} = useOne({
    resource: 'tournaments',
    id: id ?? "",
  })

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const tournament = data?.data

  console.log(tournament)


  const navigate = useNavigate();

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = (values: CreateTeamFormValues) => {
    const numberOfPlayers = Number(tournament?.teamSizeOptional ?? 0) + Number(tournament?.teamSizeRequired ?? 0);
    
    const players = Array.from({length: numberOfPlayers}, (_, i) => {
      const key = `player${i + 1}`;
      return {[key]: values[key] || ""};
    });

    const playerFields = Object.assign({}, ...players);

    mutate({
      resource: "participants",
      values: cleanObject({
        ...values,
        ...playerFields,
        id: tournament?.id,
      })
    });
    navigate(`/tournaments/${id}`);
  }

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item>
              <div className="flex justify-between w-full">
                <CreateButton
                  type="primary"
                  className="antbutton"
                  onClick={() => navigate('/tournaments')}
                  icon={<ArrowLeftOutlined/>}
                >
                  Back
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
            </Form.Item>
            <Form.Item
              label={"Ime tima"}
              name={'name'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Ime tima'}/>
            </Form.Item>
            <Form.Item
              label={"Kontakt telefon"}
              name={'number'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Kontakt telefon'} type={"number"}/>
            </Form.Item>
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
          </Form>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CreateTeam