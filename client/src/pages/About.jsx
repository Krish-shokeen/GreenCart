export default function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">About GreenCart</h1>
        <p className="about-subtitle">
          Building a sustainable future, one purchase at a time
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="about-text">
            <h2>🌿 Our Mission</h2>
            <p>
              GreenCart is more than just a marketplace—it's a movement towards conscious consumption. 
              We connect eco-conscious buyers with local sellers who share our passion for sustainability, 
              handmade craftsmanship, and environmental responsibility.
            </p>
            <p>
              Every product on our platform tells a story of care, creativity, and commitment to our planet. 
              From recycled materials to organic ingredients, we're building a community that values quality 
              over quantity and sustainability over convenience.
            </p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">🌍</div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3>Sustainability</h3>
              <p>
                We prioritize eco-friendly products and practices that minimize environmental impact 
                and promote a circular economy.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community</h3>
              <p>
                Supporting local artisans and small businesses to create meaningful connections 
                between makers and buyers.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Quality</h3>
              <p>
                Every product is carefully curated to ensure it meets our high standards for 
                craftsmanship and sustainability.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Transparency</h3>
              <p>
                We believe in honest communication about product origins, materials, and 
                environmental impact.
              </p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Local Sellers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Products Sold</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Eco-Friendly</div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              GreenCart was born from a simple idea: what if shopping could be a force for good? 
              Founded in 2024, we started as a small community of eco-conscious individuals who 
              wanted to make sustainable living accessible to everyone.
            </p>
            <p>
              Today, we're proud to be a thriving marketplace that connects thousands of buyers 
              with local artisans, organic farmers, and sustainable brands. Every purchase on 
              GreenCart supports small businesses, reduces carbon footprint, and contributes to 
              a healthier planet.
            </p>
            <p>
              Join us in creating a greener tomorrow—because every choice matters, and together, 
              we can make a difference.
            </p>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community of conscious consumers and sustainable sellers</p>
          <div className="cta-buttons">
            <button className="cta-btn-primary" onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </button>
            <button className="cta-btn-secondary" onClick={() => window.location.href = '/signup'}>
              Become a Seller
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
