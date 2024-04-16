import Sidebar from "./Sidebar";
import Main from "./Main";

const Layout = () => {
    return (
        <div className="flex h-full">
            <Sidebar />
            <Main />
        </div>
    );
}
 
export default Layout;