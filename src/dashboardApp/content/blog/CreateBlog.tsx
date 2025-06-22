import React, {useState} from 'react'
import {Button, Form, Input, Layout, theme} from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate} from 'react-router';
import {useCreate} from "@refinedev/core";
import '../../../App.css'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {storage} from '../../providers/firebase';

const {Content} = Layout;

const modules = {
  toolbar: {
    container: [
      [{header: [1, 2, 3, false]}],
      ['bold', 'italic', 'underline', 'strike'],
      [{color: []}, {background: []}],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{align: []}],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

function imageHandler(this: any) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `blog/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const quill = this.quill;
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", downloadURL);
  };
}

const CreateBlog = () => {
  const {mutate} = useCreate();

  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();


  const onFinish = (values: any) => {
    mutate({
      resource: 'blog',
      values: {
        ...values
      },
    })
    navigate('/blog')
  }

  return (
    <Layout className="h-screen overflow-hidden" style={{display: 'flex', flexDirection: 'row', overflow: 'hidden'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>
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

export default CreateBlog