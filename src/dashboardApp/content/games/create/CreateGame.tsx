import React, {FC} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core";
import {useNavigate} from "react-router";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";

const {Content} = Layout

const CreateGame: FC = () => {
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
                resource: 'games',
                values: {
                    name: values.name,
                    imageUrl: values.imageUrl,
                },
            }
        )
        navigate('/games')
    }

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
                    <Form layout="vertical" onFinish={onFinish}>
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
                            rules={[{required: true}]}
                        >
                            <Input placeholder={'Ime igre'}/>
                        </Form.Item>
                        <Form.Item
                            label={"Slika igre"}
                            name={'imageUrl'}
                            rules={[{required: true}]}
                        >
                            <Input type={'file'} onChange={uploadFile}/>
                        </Form.Item>
                        <Avatar src={imageUrl} size={100}/>
                    </Form>
                </Content>
            </Layout>
        </Layout>
    )
}

export default CreateGame