import React from 'react';
import { Layout, theme } from 'antd';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

const Home: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="h-screen" style={{ display: 'flex', flexDirection: 'row' }}>
            <Layout style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
                <Content
                    style={{
                        margin: '0px 14px',
                      marginTop: '48px',
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Hello Admin!
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
