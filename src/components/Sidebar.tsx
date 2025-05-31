import React, {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import {Layout, Menu, Button} from 'antd';
import {useLocation, useNavigate} from 'react-router';

const {Sider} = Layout;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = ({key}: { key: string }) => {
        const routes: { [key: string]: string } = {
            '1': '/dashboard',
            '2': '/tournaments',
            '3': '/dodatno',
        };

        navigate(routes[key]);
    };

    const getSelectedKey = () => {
        const currentPath = location.pathname;
        if (currentPath.includes('/dashboard')) return '1';
        if (currentPath.includes('/tournaments')) return '2';
        if (currentPath.includes('/dodatno')) return '3';
        return '1';
    };

    return (
        <Sider trigger={null} collapsible collapsed={collapsed} width={240} className="bg-[#161616]">
            <div
                style={{
                    padding: '0 16px',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#161616',
                    borderBottom: '1px solid #333',
                }}
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '18px',
                        color: '#fff',
                    }}
                />
            </div>

            <Menu
                theme="dark"
                mode="inline"
                className="pt-4 p-1 bg-[#161616]"
                selectedKeys={[getSelectedKey()]}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined/>,
                        label: 'Početna',
                    },
                    {
                        key: '2',
                        icon: <VideoCameraOutlined/>,
                        label: 'Turniri',
                    },
                    {
                        key: '3',
                        icon: <UploadOutlined/>,
                        label: 'Dodatno',
                    },
                ]}
                onSelect={handleNavigation}
            />
        </Sider>
    );
};

export default Sidebar;