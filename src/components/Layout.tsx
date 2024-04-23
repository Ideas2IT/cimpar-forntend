import Main from "./Main";
import Sidebar from "./Sidebar";

const Layout = () => {
    return (
        <div className="flex h-full">
            <Sidebar />
            <Main />
        </div>
    );
}
 
export default Layout;