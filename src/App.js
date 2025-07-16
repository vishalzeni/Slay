import './App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ClothingGallery from './components/ClothingGallery.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewArrivalsCarousel from './components/NewArrivalsCarousel.jsx';
import CustomerReviews from './components/CustomerReviews.jsx';
import Footer from './components/Footer.jsx';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';


function App() {
  return (
    <div className="App">
      <Header/>
       <Hero/>
      <ClothingGallery/>
      <NewArrivalsCarousel/>
      <CustomerReviews/>
      <Footer/> 
    </div>
  );
}

export default App;
