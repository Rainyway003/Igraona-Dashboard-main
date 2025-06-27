import React, {FC} from 'react'
import {Button, Form, Input, Layout, notification, theme} from 'antd'
import {useCreate} from "@refinedev/core";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useOutletContext} from "react-router-dom";
import {Timestamp} from "firebase/firestore";

const CreateBan: FC = () => {
  const navigate = useNavigate()
  const {mutate, isLoading} = useCreate({
      successNotification: false,
  })

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <CreateButton
          type="primary"
          className="antbutton"
          onClick={() => navigate('/banned')}
          icon={<ArrowLeftOutlined/>}
        >
          Nazad
        </CreateButton>
        <Button
          type="primary"
          htmlType="submit"
          className="antbutton"
          form='create'
          disabled={isLoading}
          icon={<PlusSquareOutlined/>}
        >
          Potvrdi
        </Button>
      </div>
    );
  }, [navigate, setHeaderActions, isLoading,]);

  const onFinish = (values: { name: string; imageUrl: string; reason: string }) => {
    mutate({
        resource: 'banned',
        values: {
          faceit: values.faceit,
            reason: values.reason,
            timestamp: Timestamp.fromDate(new Date()),
        },
        successNotification: () => ({
            message: "Ban je uspješno kreiran.",
            description: "Uspješno!",
            type: "success",
        }),
        errorNotification: (error) => ({
            message: "Došlo je do greške pri kreiranju bana.",
            description: "Greška!",
            type: "error",
        }),
      }
    )
    navigate('/banned')
  }

  return (
    <>
      <Form layout="vertical" onFinish={onFinish} id='create'>
        <Form.Item
          label={"Ime igrača"}
          name={'faceit'}
          rules={[{required: true}]}
        >
          <Input placeholder={'Ime igrača'}/>
        </Form.Item>
        <Form.Item
          label={"Razlog"}
          name={'reason'}
          rules={[{required: true}]}
        >
          <Input placeholder={'Razlog bana'}/>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateBan