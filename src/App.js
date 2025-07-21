import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import Home from './Home';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';


function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
<Route path="/category/:categoryName" element={<CategoryPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
