import React, {useState} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined, SaveOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {useForm} from "@refinedev/antd";

const {Content} = Layout;

const EditGame = () => {
  const {formProps, saveButtonProps, query, formLoading} = useForm({
    resource: 'games',
  });
  console.log(formProps)
  const navigate = useNavigate();
  const {id} = useParams();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageUrl(URL.createObjectURL(event.target.files[0]))
    }
  }

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();


  return (
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
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
          <Form layout="vertical" {...formProps}>
            <Form.Item>
              <div className="flex justify-between w-full">
                <CreateButton
                  type="primary"
                  className="antbutton"
                  onClick={() => navigate('/games')}
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
              label={"Ime igre"}
              name={'name'}
            >
              <Input placeholder={'Ime igre'}/>
            </Form.Item>
            <Form.Item
              label={"Slika igre"}
              name={'imageUrl'}
            >
              <Input type={'file'} onChange={uploadFile}/>
            </Form.Item>
            <Avatar src={imageUrl} size={100}/>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditGame;