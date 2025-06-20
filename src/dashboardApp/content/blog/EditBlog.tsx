import React, {useState} from 'react'
import {Button, Form, Input, Layout, theme} from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate} from 'react-router';
import '../../../App.css'

const {Content} = Layout;

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

const EditBlog = () => {
  const {formProps} = useForm();

  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = async (values: any) => {

    await formProps.onFinish?.(values)
    navigate('/blog')
  }


  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row', overflow: 'hidden'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" {...formProps} onFinish={onFinish}>
          <div className='sticky top-[19px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/blog')}
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
              paddingBottom: 600,
              marginTop: 38,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Form.Item label={'Title'} name="title" rules={[{required: true}]}>
              <Input placeholder="Title"/>
            </Form.Item>
            <Form.Item name="blog" rules={[{required: true}]}>
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

export default EditBlog