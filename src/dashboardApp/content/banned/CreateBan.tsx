import React, {FC} from 'react'
import {Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";

const {Content} = Layout

const CreateBan: FC = () => {
  const navigate = useNavigate()
  const {mutate} = useCreate()

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = (values: { name: string; imageUrl: string }) => {
    mutate({
        resource: 'banned',
        values: {
          name: values.name,
          imageUrl: values.imageUrl,
        },
      }
    )
    navigate('/banned')
  }

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>
          <div className='sticky top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/banned')}
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

          <Content
            style={{
              margin: '0px 14px',
              padding: 24,
              paddingBottom: 836,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Form.Item
              label={"Ime igrača"}
              name={'name'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Ime igrača'}/>
            </Form.Item>
            <Form.Item
              label={"Razlog bana"}
              name={'reason'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Ime igrača'}/>
            </Form.Item>
          </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default CreateBan