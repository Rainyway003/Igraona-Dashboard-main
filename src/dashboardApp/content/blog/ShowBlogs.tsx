import React from 'react'
import {Layout, List, theme, Typography} from "antd";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {useList} from "@refinedev/core";

const {Content} = Layout;
const {Title} = Typography;

const ShowBlogs = () => {
  const navigate = useNavigate();

  const {data, isLoading} = useList({
    resource: "blog",
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

        <div className='sticky top-[7px] pr-6 pl-6 z-10 flex justify-end'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/blog/new')}
          >
            Create
          </CreateButton>
        </div>

        <Content
          style={{
            margin: '14px 14px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >

          <List
            itemLayout="horizontal"
            loading={isLoading}
            dataSource={data?.data}
            renderItem={(blog, index) => (
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
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <List.Item.Meta
                  title={<span style={{color: '#8D151F', fontWeight: "bold"}}>{blog.title}</span>}
                  description={<span style={{color: '#a83a44'}}><BlogPost blog={blog.blog}/></span>}
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

function BlogPost({blog}) {
  return (
    <div dangerouslySetInnerHTML={{__html: blog}}/>
  );
}

export default ShowBlogs