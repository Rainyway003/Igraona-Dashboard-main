import React from "react";
import {
    Button,
    Form,
    Grid,
    Input,
    Spin,
    theme,
    Typography,
} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";

import logo from '../../items/logo.png'
import {useLogin} from "@refinedev/core";
import {useNavigate} from "react-router";

const {useToken} = theme;
const {useBreakpoint} = Grid;
const {Title} = Typography;

export default function Login() {
    const {mutate, isLoading} = useLogin();
    const navigate = useNavigate();
    const {token} = useToken();
    const screens = useBreakpoint();

    const onFinish = (data: any) => {
        console.log(data);
        const {email, password} = data;
        mutate({email, password});
        navigate('/dashboard')
    };

    const admin = {
        email: 'admin@igraona.gg',
        password: 'igraona123',
    };

    if (isLoading) {
        return <div style={{textAlign: "center", paddingTop: "20px"}}><Spin size="large"/></div>;
    }

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md
                ? `${token.paddingXL}px`
                : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px",
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: "center",
            width: "100%",
        },
        forgotPassword: {
            float: "right",
        },
        header: {
            marginBottom: token.marginXL,
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
        },
        text: {
            color: token.colorTextSecondary,
        },
        title: {
            fontSize: screens.md
                ? token.fontSizeHeading2
                : token.fontSizeHeading3,
        },
    };

    return (
        <section style={styles.section}>
            <div style={styles.container} className="bg-slate-100 rounded-xl ">
                <div style={{
                    ...styles.header,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <img src={logo} alt="Loading..." className="w-[30%] h-[30%]"/>
                    <Title style={{
                        ...styles.title,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }} className="mt-4">Prijavi se!</Title>
                </div>
                <Form
                    name="normal_login"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[{type: "email", required: true, message: "Molimo, upišite svoj Email!"}]}
                    >
                        <Input prefix={<MailOutlined className="pr-1"/>} placeholder="Email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: "Molimo, upišite svoju Šifru!"}]}
                    >
                        <Input.Password prefix={<LockOutlined className="pr-1"/>} placeholder="Šifra"/>
                    </Form.Item>
                    <Form.Item style={{marginBottom: "0px"}}>
                        <Button block type="primary" htmlType="submit" className="mb-4">
                            Prijavi se
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
}