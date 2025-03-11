import BottomNavbar from "./components/BottomNavbar";
import HomePage from "./components/Home";
import Logo from "./components/logo/Logo";
import Sidebar from "./components/Sidebar";
import { UserProvider } from "./contaxt/userContaxt";
export default function Home() {

  return (
    <UserProvider>
      <div className="">
        <Logo />
        <Sidebar />
        <HomePage/>
        <BottomNavbar />
      </div>
    </UserProvider>
  );
}
