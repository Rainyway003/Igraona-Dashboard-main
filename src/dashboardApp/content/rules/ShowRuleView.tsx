import React, {FC} from 'react'
import {Layout, theme} from "antd";

const {Content} = Layout;

interface ShowRuleViewProps {
  rule: any;
}

const ShowRuleView: FC<ShowRuleViewProps> = ({rule}) => {
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  console.log(rule)

  return (
    <Layout className="h-fit" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 20,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <BlogPost rule={rule[0]?.rule}/>
        </Content>
      </Layout>
    </Layout>
  )
}

interface BlogPostProps {
  rule: string;
}

function BlogPost({rule}: BlogPostProps) {
  return (
    <div dangerouslySetInnerHTML={{__html: rule}}/>
  );
}

export default ShowRuleView