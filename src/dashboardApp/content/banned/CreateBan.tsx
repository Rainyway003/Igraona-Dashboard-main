import React, {FC} from 'react'
import {Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useOutletContext} from "react-router-dom";

const {Content} = Layout

const CreateBan: FC = () => {
  const navigate = useNavigate()
  const {mutate} = useCreate()

    const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

    React.useEffect(() => {
        setHeaderActions(
            <div className="flex justify-between w-full">
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
                    form='create'
                    icon={<PlusSquareOutlined/>}
                >
                    Submit
                </Button>
            </div>
        );
    }, [navigate, setHeaderActions ]);

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
    <>
        <Form layout="vertical" onFinish={onFinish} id='create'>
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
              <Input placeholder={'Razlog bana'}/>
            </Form.Item>
        </Form>
    </>
  )
}

export default CreateBan