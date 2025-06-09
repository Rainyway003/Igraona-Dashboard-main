import React, {FC} from 'react'
import {Avatar, Layout, Space, Table, theme} from "antd";
import {CreateButton, DeleteButton, EditButton} from "@refinedev/antd";
import {useNavigate} from 'react-router';
import {useList} from "@refinedev/core";
import {AntDesignOutlined, ArrowLeftOutlined} from "@ant-design/icons";

const {Content} = Layout;

const ShowBanned: FC = () => {
    const navigate = useNavigate()

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const {data, isLoading} = useList({
        resource: "banned",
    })

    const columns = [
        {
            title: 'Faceit Igrača',
            dataIndex: 'faceit',
            key: 'faceit',
            render: (_: any, record: any) => (
                <Space>
                    <a href={record.faceit}>{record.faceit}</a>
                </Space>
            ),
        },
        {
            title: 'Razlog Bana',
            dataIndex: 'reason',
            key: 'reason',
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
                    <DeleteButton hideText size="small" resource="banned" recordItemId={record.id}></DeleteButton>
                </Space>
            ),
        },
    ];

    return (
        <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
            <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

                <div className='sticky top-[7px] pr-6 pl-6 z-10 flex justify-end'>
                    <CreateButton
                      type="primary"
                      className="antbutton"
                      onClick={() => navigate('/banned/new')}
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

                    <Table
                        loading={isLoading}
                        dataSource={data?.data}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 5,
                            position: ['bottomCenter'],
                        }}
                    />
                </Content>
            </Layout>
        </Layout>
    )
}

export default ShowBanned