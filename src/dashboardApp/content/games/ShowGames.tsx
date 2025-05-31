import React, {FC} from 'react'
import {Avatar, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";

const {Content} = Layout;

const ShowGames: FC = () => {
    const navigate = useNavigate()

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const {data, isLoading} = useList({
        resource: "games",
    })

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: () => <Avatar/>,
        },
        {
            title: 'Naziv Igre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Akcije',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {/*<EditButton hideText size="small" resource="tournaments" recordItemId={record.id}/>*/}
                    <DeleteButton hideText size="small" resource="games" recordItemId={record.id}/>
                </Space>
            ),
        },
    ];

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
                    <div style={{marginBottom: 16}} className='text-right'>
                        <CreateButton
                            type="primary"
                            className="antbutton"
                            onClick={() => navigate('/games/new')}
                        >
                            Create
                        </CreateButton>
                    </div>

                    <Table
                        loading={isLoading}
                        dataSource={data?.data}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 5,
                            position: ['bottomCenter'],
                        }}
                        onRow={(record) => ({
                            onClick: (event) => {
                                const target = event.target as HTMLElement;
                                if (target.closest('button')) return;
                                navigate(`/tournaments/${record.id}`);
                            },
                        })}
                    />
                </Content>
            </Layout>
        </Layout>
    )
}

export default ShowGames