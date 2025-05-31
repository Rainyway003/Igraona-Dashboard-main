import { Outlet } from "react-router"
import Sidebar from "../Sidebar"


const AppLayout = () => {
    return (
        <div className="h-screen w-screen flex">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default AppLayout