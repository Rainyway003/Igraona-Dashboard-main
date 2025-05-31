import React, {FC} from 'react'
import {Avatar, Layout, List, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";

const {Content} = Layout;

const ShowRules: FC = () => {
  const navigate = useNavigate();

  const {data, isLoading} = useList({
    resource: "rules",
  });


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  if (isLoading) {
    return <div>...Loading</div>;
  }

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
          <div style={{marginBottom: 16}} className='text-right'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/rules/new')}
            >
              Create
            </CreateButton>
          </div>

          <List
            itemLayout="horizontal"
            loading={isLoading}
            dataSource={data?.data}
            renderItem={(rule, index) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  backgroundColor: 'lightgray',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'darkgray')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'lightgray')}
              >
                <List.Item.Meta
                  title={<span style={{color: '#8D151F', fontWeight: "bold"}}>{rule.name}</span>}
                  description={<span style={{color: '#a83a44'}}><BlogPost rule={rule.rule}/></span>}
                  className="text-center"
                />
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

function BlogPost({rule}) {
  return (
    <div dangerouslySetInnerHTML={{__html: rule}}/>
  );
}

export default ShowRules