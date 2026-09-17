import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const products = [
  { name: 'Cloud Veil Cleanser', type: 'Gentle Cleanser', price: '$28', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85' },
  { name: 'Petal Dew Serum', type: 'Brightening Serum', price: '$42', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85' },
  { name: 'Rosewater Barrier Cream', type: 'Daily Moisturizer', price: '$36', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85' },
];

function App() {
  return <>
    <header className="nav"><a className="logo" href="#home">LUNÉA</a><nav><a href="#shop">Shop</a><a href="#ritual">Ritual</a><a href="#story">Our Story</a><a href="#journal">Journal</a></nav><button className="bag">Bag (0)</button></header>
    <main>
      <section id="home" className="hero">
        <div className="hero-copy"><p className="eyebrow">SKINCARE, REIMAGINED</p><h1>Soft skin.<br/><i>Quiet confidence.</i></h1><p className="lead">Thoughtful formulas designed to make your everyday ritual feel beautiful, simple and effective.</p><a className="button" href="#shop">Explore the collection</a></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1400&q=88" alt="Lunéa skincare ritual"/></div>
      </section>
      <section id="shop" className="section"><div className="section-head"><div><p className="eyebrow">THE EDIT</p><h2>Everyday essentials</h2></div><a href="#shop">View all products →</a></div><div className="grid">{products.map((p)=><article className="product" key={p.name}><div className="product-img"><img src={p.image} alt={p.name}/><button>Add to bag</button></div><div className="product-info"><div><h3>{p.name}</h3><p>{p.type}</p></div><strong>{p.price}</strong></div></article>)}</div></section>
      <section id="ritual" className="ritual"><div><p className="eyebrow">YOUR RITUAL</p><h2>Three minutes.<br/><i>A little more you.</i></h2><p>Build a simple routine around hydration, barrier support and a healthy-looking glow.</p><a className="text-link" href="#shop">Build my routine →</a></div><img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=85" alt="Skincare products arranged on a vanity"/></section>
      <section id="story" className="story"><p className="eyebrow">OUR STORY</p><h2>Beauty that feels<br/><i>unhurried.</i></h2><p>Born from the belief that skincare can be both considered and uncomplicated, Lunéa pairs modern actives with a softer approach to daily care.</p></section>
      <section id="journal" className="journal"><div className="section-head"><div><p className="eyebrow">THE JOURNAL</p><h2>Notes for your ritual</h2></div></div><div className="journal-grid"><article><img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1000&q=85" alt="Skincare bottles"/><p>GUIDE · 5 MIN READ</p><h3>How to build a calm morning routine</h3></article><article><img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=85" alt="Self-care ritual"/><p>RITUAL · 4 MIN READ</p><h3>The art of giving your skin less, but better</h3></article></div></section>
    </main>
    <footer><div className="logo">LUNÉA</div><p>Elevated skincare for everyday rituals.</p><small>© 2026 Lunéa Skin</small></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
