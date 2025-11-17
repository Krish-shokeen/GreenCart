import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <header className="hero fade-in">
      <h2 className="hero-title pop-in">
        Local. Sustainable. <span>Conscious Shopping.</span>
      </h2>
      <p className="hero-desc">
        Discover eco-friendly, handmade, and recycled products from
        local sellers in your city.
      </p>
      <button 
        className="cta-btn pulse" 
        onClick={() => navigate('/shop')}
      >
        Explore Marketplace
      </button>
    </header>
  );
}
