import { Outlet } from 'react-router-dom'


const ProtectedRoute = ({children }) => {

    return <Outlet />
}

export default ProtectedRoute;