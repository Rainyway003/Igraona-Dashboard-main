import React, {useState} from 'react';
import {
  TrophyOutlined,
  HomeOutlined,
  AimOutlined,
  DeleteOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  ExceptionOutlined
} from '@ant-design/icons';
import {Layout, Menu, Button} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';

import logo from '../items/logo.png'

import LogOut from './LogOut';

const {Sider} = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (key: string) => {
    const routes: { [key: string]: string } = {
      '1': '/dashboard',
      '2': '/tournaments',
      '3': '/games',
      '4': '/banned',
      '5': '/plejke',
      '6': '/blog',
      '7': '/rules',
        '8': '/generation',
    };

    const targetRoute = routes[key];
    const currentPath = location.pathname;

    if (!currentPath.startsWith(targetRoute) || currentPath !== targetRoute) {
      navigate(targetRoute);
    }
  };

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/dashboard')) return '1';
    if (currentPath.includes('/tournaments')) return '2';
    if (currentPath.includes('/games')) return '3';
    if (currentPath.includes('/banned')) return '4';
    if (currentPath.includes('/plejke')) return '5';
    if (currentPath.includes('/blog')) return '6';
    if (currentPath.includes('/rules')) return '7';
      if (currentPath.includes('/generation')) return '8';
    return '1';
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={240} collapsedWidth={90}
           className="bg-[#161616]">
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
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center bg-transparent w-full h-full border-none hover:scale-105 hover:brightness-90 transition-all duration-300"
        >
          <img
            src={logo}
            alt="Loading..."
            className={`${collapsed ? "w-10 h-10" : "w-10 h-10"} object-contain transition-all duration-300`}
          />
          {!collapsed && (
            <h1 className="text-[#8D151F] font-bold text-md ml-3 transition-all duration-300">
              Igraona Igraona
            </h1>
          )}
        </Button>


      </div>

      <Menu
        theme="dark"
        mode="inline"
        className="pt-4 p-1 bg-[#161616] h-[86%]"
        selectedKeys={[getSelectedKey()]}
        items={[
          {
            key: '1',
            icon: <HomeOutlined/>,
            label: 'Početna',
            onClick: () => handleNavigation('1')
          },
          {
            key: '2',
            icon: <TrophyOutlined/>,
            label: 'Turniri',
            onClick: () => handleNavigation('2')
          },
          {
            key: '3',
            icon: <AimOutlined/>,
            label: 'Igre',
            onClick: () => handleNavigation('3')
          },
          {
            key: '4',
            icon: <DeleteOutlined/>,
            label: 'Banovi',
            onClick: () => handleNavigation('4')
          },
          {
            key: '5',
            icon: <CustomerServiceOutlined />,
            label: 'Plejke',
            onClick: () => handleNavigation('5')
          },
          {
            key: '6',
            icon: <ContainerOutlined />,
            label: 'Blog',
            onClick: () => handleNavigation('6')
          },
          {
            key: '7',
            icon: <ExceptionOutlined />,
            label: 'Pravila',
            onClick: () => handleNavigation('7')
          },
            {
                key: '8',
                icon: <ExceptionOutlined />,
                label: 'Generator',
                onClick: () => handleNavigation('8')
            },
        ]}
      />

      <div style={{paddingTop: '20px', textAlign: 'center', borderTop: '1px solid #333'}}>
        <LogOut collapsed={collapsed}/>
      </div>

    </Sider>
  );
};

export default Sidebar;