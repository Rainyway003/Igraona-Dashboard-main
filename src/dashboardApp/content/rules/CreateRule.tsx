import React, {useState} from 'react'
import {Button, Form, Input, Layout, theme} from 'antd'
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import ReactQuill from "react-quill";
import {useCreate} from "@refinedev/core";

const {Content} = Layout

const modules = {
  toolbar: [
    [{header: [1, 2, 3, false]}],
    ['bold', 'italic', 'underline', 'strike'],
    [{color: []}, {background: []}],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{align: []}],
    ['link', 'image', 'code-block'],
    ['clean'],
  ],
};

const CreateRule = () => {
  const {mutate, isLoading, isSuccess, error} = useCreate();

  const navigate = useNavigate()
  const [value, setValue] = useState('');

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = (values: any) => {
    mutate({
      resource: 'rules',
      values: {
        ...values
      },
    })
    navigate('/rules')
  }


  return (
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>
      <Form.Item>
        <div className='sticky pt-2 pr-6 pl-6 z-10 flex justify-between'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/rules')}
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

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
            <Form.Item label={'Ime pravila'} name="name" rules={[{required: true}]}>
              <Input placeholder="Ime pravila"/>
            </Form.Item>
            <Form.Item name="rule" rules={[{required: true}]}>
              <ReactQuill
                style={{height: '300px', minWidth: '100%'}}
                theme="snow" value={value} onChange={setValue} modules={modules}/>
            </Form.Item>
        </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default CreateRule