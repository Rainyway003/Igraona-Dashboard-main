import React, {useEffect, useState} from 'react'
import {Button, Form, Input, notification} from 'antd'
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import ReactQuill from "react-quill";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../providers/firebase";
import {useOutletContext} from "react-router-dom";

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
  const {formProps, formLoading} = useForm({
    successNotification: false,
  });

  const navigate = useNavigate()
  const [value, setValue] = useState('');

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

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
          disabled={formLoading}
          icon={<PlusSquareOutlined/>}
        >
          Potvrdi
        </Button>
      </div>
    );
  }, [navigate, setHeaderActions, formLoading]);

  useEffect(() => {
    if (formProps.initialValues?.rule) {
      setValue(formProps.initialValues.rule);
    }
  }, [formProps.initialValues?.rule]);

  const onFinish = async (values: any) => {
    try {
      await formProps.onFinish?.({
        ...values,
        rule: value,
      });
      notification.success({
        message: "Pravilo je uspješno ažurirano.",
        description: "Uspješno!",
      });
      navigate('/rules');
    } catch (error) {
      notification.error({
        message: "Došlo je do greške prilikom ažuriranja pravila.",
        description: "Greška!",
      });
    }
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