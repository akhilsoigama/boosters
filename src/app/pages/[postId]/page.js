import BottomNavbar from '@/app/components/BottomNavbar';
import Logo from '@/app/components/logo/Logo';
import ViewPost from '@/app/components/posts/viewPost';

const ViewPostPage = ({ params }) => {
  return (
    <>
      <Logo />
      <ViewPost params={params} />
      <BottomNavbar />
    </>
  )
};

export default ViewPostPage;
