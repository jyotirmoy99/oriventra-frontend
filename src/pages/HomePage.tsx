import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PromoBanners from "../components/home/PromoBanners";
import Newsletter from "../components/home/Newsletter";

// ---------------------------------------------------------------------------
// HomePage
// ---------------------------------------------------------------------------
// Storefront landing page: hero → categories → featured products → promo
// banners → newsletter. Each section fetches its own data (React Query) and
// handles its own loading/empty/error states, so the page itself just composes.
// The page-level entrance animation is provided by AnimatedOutlet (RootLayout).
// ---------------------------------------------------------------------------

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanners />
      <Newsletter />
    </>
  );
};

export default HomePage;
