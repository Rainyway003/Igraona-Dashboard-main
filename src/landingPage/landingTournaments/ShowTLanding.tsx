import React, {PropsWithChildren} from 'react';
import {Layout, theme, List, Avatar, Typography} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';

const {Content} = Layout;
const {Title} = Typography;

import {useList} from "@refinedev/core";
import {useNavigate} from 'react-router';

const ShowTLanding: React.FC<PropsWithChildren<{}>> = ({children}) => {
    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const {data, isLoading} = useList({
        resource: "tournaments",
    });

    if (isLoading) {
        return <div>...Loading</div>;
    }

    return (
        <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
            <Layout style={{flex: 1, backgroundColor: '#161616'}}>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#242424',
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        <Title level={2} style={{color: '#8D151F'}}>Turniri</Title>
                    </div>

                    <List
                        loading={isLoading}
                        itemLayout="horizontal"
                        dataSource={data?.data}
                        renderItem={(turnir, index) => (
                            <List.Item
                                onClick={() => navigate(`/t/${turnir.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    backgroundColor: '#333333',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#424242')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                            >
                                <List.Item.Meta
                                    title={<span style={{color: '#8D151F', fontWeight: "bold"}}>{turnir.name}</span>}
                                    description={<span style={{color: '#a83a44'}}>{`ID turnira: ${turnir.id}`}</span>}
                                    className="text-center"
                                />
                            </List.Item>
                        )}
                    />

                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ShowTLanding;