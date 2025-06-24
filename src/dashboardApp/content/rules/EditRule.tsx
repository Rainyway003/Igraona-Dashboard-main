import React, {useEffect, useState} from 'react'
import {Button, Form, Input, Layout, theme} from 'antd'
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import ReactQuill from "react-quill";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../providers/firebase";
import {useOutletContext} from "react-router-dom";

const {Content} = Layout

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

    const storageRef = ref(storage, `rule/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const quill = this.quill;
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", downloadURL);
  };
}

const EditRule = () => {
  const {formProps} = useForm();

  const navigate = useNavigate()
  const [value, setValue] = useState('');

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex justify-between w-full">
          <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/rules')}
              icon={<ArrowLeftOutlined/>}
          >
            Nazad
          </CreateButton>

          <Button
              type="primary"
              htmlType="submit"
              className="antbutton"
              form='edit'
              icon={<PlusSquareOutlined/>}
          >
            Potvrdi
          </Button>
        </div>
    );
  }, [navigate, setHeaderActions ]);

  useEffect(() => {
    if (formProps.initialValues?.rule) {
      setValue(formProps.initialValues.rule);
    }
  }, [formProps.initialValues?.rule]);

  const onFinish = async (values: any) => {
    await formProps.onFinish?.({
      ...values,
      rule: value,
    });
    navigate('/rule');
  };


  return (
    <>
        <Form layout="vertical" {...formProps} onFinish={onFinish} id='edit'>

            <Form.Item label={'Naziv pravila'} name="name" rules={[{required: true}]}>
              <Input placeholder="Naziv pravila"/>
            </Form.Item>
            <Form.Item name="rule" rules={[{required: true}]}>
              <ReactQuill
                style={{height: '300px', minWidth: '100%'}}
                theme="snow" value={value} onChange={setValue} modules={modules}/>
            </Form.Item>
        </Form>
    </>
  )
}

export default EditRule