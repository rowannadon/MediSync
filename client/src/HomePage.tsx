import NavMenu from './NavMenu';
import MyCarousel from './Carousel';

const HomePage = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <MyCarousel />
    </div>
  );
};

export default HomePage;
