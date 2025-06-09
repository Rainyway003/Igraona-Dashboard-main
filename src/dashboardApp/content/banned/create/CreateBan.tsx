import React, {FC} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";

const {Content} = Layout

const CreateBan: FC = () => {
    const navigate = useNavigate()
    const {mutate} = useCreate()

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined)

    const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImageUrl(URL.createObjectURL(event.target.files[0]))
        }
    }
    console.log(imageUrl)

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
        <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
            <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item>
                        <div className='sticky pt-2 pr-6 pl-6 z-10 flex justify-between'>
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
                              icon={<PlusSquareOutlined/>}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form.Item>

                <Content
                    style={{
                        margin: '14px 14px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                        <Form.Item
                            label={"Ime igrača"}
                            name={'name'}
                            rules={[{required: true}]}
                        >
                            <Input placeholder={'Ime igrača'}/>
                        </Form.Item>
                        <Form.Item
                            label={"Ime igrača"}
                            name={'name'}
                            rules={[{required: true}]}
                        >
                            <Input placeholder={'Ime igrača'}/>
                        </Form.Item>
                        <Avatar src={imageUrl} size={100}/>
                </Content>
                </Form>
            </Layout>
        </Layout>
    )
}

export default CreateBan