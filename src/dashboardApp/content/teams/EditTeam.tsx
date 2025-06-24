import {useOne} from "@refinedev/core";
import {useNavigate, useParams} from "react-router";
import {Button, Form, Layout, theme} from "antd";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";

const {Content} = Layout;

const EditTeam = () => {
  const {id} = useParams();
  const navigate = useNavigate();


  const {data} = useOne({
    resource: "participants",
    id: id
  })

  const tournament = data?.data

  console.log(tournament)

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
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
          <Form layout="vertical">
            <Form.Item>
              <div className="flex justify-between w-full">
                <CreateButton
                  type="primary"
                  className="antbutton"
                  onClick={() => navigate('/tournaments')}
                  icon={<ArrowLeftOutlined/>}
                >
                  Nazad
                </CreateButton>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="antbutton"
                  icon={<PlusSquareOutlined/>}
                >
                  Potvrdi
                </Button>

              </div>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  )
}

export default EditTeam