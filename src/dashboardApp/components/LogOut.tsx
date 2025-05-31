import {LogoutOutlined} from "@ant-design/icons";
import {useLogout} from "@refinedev/core";
import {Button, Spin} from "antd";
import React from "react";

interface LogOutProps {
    collapsed: boolean;
}

const LogOut: React.FC<LogOutProps> = ({collapsed}) => {
    const {mutate, isLoading} = useLogout();

    const handleLogout = () => {
        try {
            mutate();
        } catch (error) {
            console.error("Neće", error);
        }
    };

    if (isLoading) {
        return (
            <div style={{textAlign: "center", paddingTop: "20px"}}>
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <Button
            type="text"
            onClick={handleLogout}
            className=" hover:scale-105 hover:brightness-50 transition-all duration-300"
        >
            <LogoutOutlined
                className={`transition-all duration-300 text-[#8D151F] ${
                    collapsed ? "text-2xl" : "text-xl"
                }`}
            />
            {!collapsed && (
                <h1 className="text-[#8D151F] font-bold text-md ml-3 transition-all duration-300">
                    Log out
                </h1>
            )}
        </Button>
    );
};

export default LogOut;