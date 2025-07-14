import './App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ClothingGallery from './components/ClothingGallery.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NewArrivalsCarousel from './components/NewArrivalsCarousel.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="App">
      <Header/>
      <Hero/>
      <ClothingGallery/>
      <NewArrivalsCarousel/>
      <Footer/>
    </div>
  );
}

export default App;
