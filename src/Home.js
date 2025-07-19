import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ClothingGallery from './components/ClothingGallery.jsx';
import NewArrivalsCarousel from './components/NewArrivalsCarousel.jsx';
import CustomerReviews from './components/CustomerReviews.jsx';
import Footer from './components/Footer.jsx';
export default function Home ()  {
    return (
        <>
       <Header/>
       <Hero/>
      <ClothingGallery/>
      <NewArrivalsCarousel/>
      <CustomerReviews/>
      <Footer/> 
      </>
    );
    }