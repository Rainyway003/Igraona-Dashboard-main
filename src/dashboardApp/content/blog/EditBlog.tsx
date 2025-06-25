import React, {useEffect, useState} from 'react'
import {Button, Form, Input, Layout, theme} from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate, useOutletContext} from 'react-router';
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

const EditBlog = () => {
  const {formProps, formLoading} = useForm();

  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <CreateButton
          type="primary"
          className="antbutton"
          onClick={() => navigate('/blog')}
          icon={<ArrowLeftOutlined/>}
        >
          Nazad
        </CreateButton>

        <Button
          type="primary"
          htmlType="submit"
          className="antbutton"
          form='edit'
          disabled={formLoading}
          icon={<PlusSquareOutlined/>}
        >
          Potvrdi
        </Button>
      </div>
    );
  }, [navigate, setHeaderActions, formLoading]);

  useEffect(() => {
    if (formProps.initialValues?.blog) {
      setValue(formProps.initialValues.blog);
    }
  }, [formProps.initialValues?.blog]);

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = async (values: any) => {
    await formProps.onFinish?.({
      ...values,
      blog: value,
    });
    navigate('/blog');
  };


  return (
    <>
      <Form layout="vertical" {...formProps} onFinish={onFinish} id='edit'>
        <Form.Item label={'Naziv'} name="title" rules={[{required: true}]}>
          <Input placeholder="Naziv bloga"/>
        </Form.Item>
        <Form.Item name="blog" rules={[{required: true}]}>
          <ReactQuill
            style={{height: '300px', minWidth: '100%'}}
            theme="snow" value={value} onChange={setValue} modules={modules}/>
        </Form.Item>
      </Form>
    </>
  )
}

export default EditBlog