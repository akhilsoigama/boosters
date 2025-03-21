import BottomNavbar from "./components/BottomNavbar";
import HomePage from "./components/Home";
import Logo from "./components/logo/Logo";
import Sidebar from "./components/Sidebar";
export default function Home() {

  return (
      <div className="">
        
        <Logo />
        <Sidebar />
        <HomePage/>
        <BottomNavbar />
      </div>
  );
}
