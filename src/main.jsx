import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createRoot } from 'react-dom/client';
import './styles.css';

const supabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY ? createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) : null;

const products = [
  { id: 'cloud-veil', name: 'Cloud Veil Cleanser', category: 'Cleanse', type: 'Cream cleanser', price: 28, size: '150 ml', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=88', copy: 'A soft, cushiony daily cleanser that leaves skin fresh without the tight-after feeling.', tags: ['oat', 'ceramide', 'rose water'] },
  { id: 'petal-dew', name: 'Petal Dew Serum', category: 'Treat', type: 'Hydrating serum', price: 42, size: '30 ml', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=88', copy: 'A lightweight glow serum for skin that looks rested, bouncy and comfortably hydrated.', tags: ['niacinamide', 'peptide', 'glycerin'] },
  { id: 'rosewater-cream', name: 'Rosewater Barrier Cream', category: 'Moisturize', type: 'Barrier moisturizer', price: 36, size: '50 ml', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=88', copy: 'A rich-but-light cream made for everyday barrier care and a soft, dewy finish.', tags: ['squalane', 'panthenol', 'ceramide'] },
  { id: 'moon-milk', name: 'Moon Milk Essence', category: 'Prep', type: 'Milky essence', price: 32, size: '120 ml', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=88', copy: 'A silky first layer that helps the rest of your ritual glide on beautifully.', tags: ['rice extract', 'betaine', 'allantoin'] },
  { id: 'soft-focus-spf', name: 'Soft Focus SPF 40', category: 'Protect', type: 'Daily sunscreen', price: 30, size: '50 ml', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=88', copy: 'A comfortable daily SPF with a sheer finish for the final step of your morning routine.', tags: ['zinc oxide', 'vitamin e', 'green tea'] },
  { id: 'night-bloom', name: 'Night Bloom Oil', category: 'Restore', type: 'Face oil', price: 46, size: '30 ml', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=88', copy: 'A few drops of botanical oils to finish an evening ritual with softness and luminosity.', tags: ['rosehip', 'camellia', 'jojoba'] },
];

const journal = [
  { title: 'A calm morning routine, in five steps', type: 'Guide', time: '5 min read', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=88' },
  { title: 'The art of giving your skin less, but better', type: 'Ritual', time: '4 min read', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=88' },
  { title: 'What barrier-first skincare really means', type: 'Science', time: '6 min read', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=88' },
];

const icon = (name, size = 20) => {
  const paths = {
    bag: <><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>,
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    close: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
    heart: <path d="M20 8.5c0 5.5-8 9.5-8 9.5S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('lunea-cart') || '[]'));
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [adminProduct, setAdminProduct] = useState({ name:'', category:'Treat', type:'', price:'', size:'', stock:'', image_url:'', description:'', tags:'' });
  const [adminProducts, setAdminProducts] = useState(products);

  useEffect(() => {
    localStorage.setItem('lunea-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { if (data.session) loadProfile(data.session.user); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) loadProfile(session.user); else { setSessionUser(null); setProfile(null); } });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProfile = async (user) => {
    setSessionUser(user);
    if (!supabase) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
  };

  const signInOrUp = async (event) => {
    event.preventDefault();
    if (!supabase) { setNotice('Secure accounts are ready for Supabase activation.'); return; }
    const result = authMode === 'signup' ? await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { data: { full_name: authName } } }) : await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (result.error) setNotice(result.error.message); else { setNotice(authMode === 'signup' ? 'Account created. Check your email if confirmation is enabled.' : 'Welcome back.'); setAccountOpen(false); }
  };
  const signOut = async () => { if (supabase) await supabase.auth.signOut(); setSessionUser(null); setProfile(null); setAdminOpen(false); setNotice('You have been signed out.'); };
  const publishProduct = async (event) => {
    event.preventDefault();
    if (!supabase || profile?.role !== 'admin') { setNotice('Admin database access is not configured.'); return; }
    const payload = { name: adminProduct.name, slug: adminProduct.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'), category: adminProduct.category, type: adminProduct.type, price: Number(adminProduct.price), size: adminProduct.size, stock: Number(adminProduct.stock || 0), image_url: adminProduct.image_url, description: adminProduct.description, tags: adminProduct.tags.split(',').map(x => x.trim()).filter(Boolean), published: true };
    const { data, error } = await supabase.from('products').insert(payload).select().single();
    if (error) { setNotice(error.message); return; }
    setAdminProducts(prev => [data, ...prev]); setAdminProduct({ name:'', category:'Treat', type:'', price:'', size:'', stock:'', image_url:'', description:'', tags:'' }); setNotice('Product published to the storefront.');
  };


  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const visibleProducts = useMemo(() => activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory), [activeCategory]);

  const addToCart = (product) => {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id);
      if (found) return items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...items, { ...product, qty: 1 }];
    });
    setNotice(`${product.name} added to your bag.`);
    window.setTimeout(() => setNotice(''), 2400);
  };

  const updateQty = (id, delta) => setCart((items) => items.flatMap((item) => item.id === id ? [{ ...item, qty: item.qty + delta }].filter((x) => x.qty > 0) : [item]));
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const recommended = quizAnswer === 'dry' ? products.find((p) => p.id === 'rosewater-cream') : quizAnswer === 'oily' ? products.find((p) => p.id === 'petal-dew') : products.find((p) => p.id === 'moon-milk');

  return <div className="site-shell">
    <div className="announcement">Complimentary shipping on orders over $75 <span>·</span> Thoughtful skincare, always.</div>
    <header className="nav">
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
      <a className="logo" href="#top" onClick={() => setMenuOpen(false)}>LUNÉA</a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <button onClick={() => scrollTo('shop')}>Shop</button>
        <button onClick={() => scrollTo('ritual')}>Ritual</button>
        <button onClick={() => scrollTo('story')}>Our Story</button>
        <button onClick={() => scrollTo('journal')}>Journal</button>
      </nav>
      <div className="nav-actions"><button className="account-btn" onClick={() => setAccountOpen(true)}>{sessionUser ? (profile?.full_name || 'Account') : 'Account'}</button>{profile?.role === 'admin' && <button className="admin-link" onClick={() => setAdminOpen(true)}>Admin</button>}<button className="icon-btn" aria-label="Open bag" onClick={() => setBagOpen(true)}>{icon('bag')}<span>{itemCount}</span></button></div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SKINCARE, REIMAGINED</p>
          <h1>Soft skin.<br/><em>Quiet confidence.</em></h1>
          <p className="lead">Thoughtful formulas for a slower, simpler ritual — designed to leave skin comfortable, luminous and cared for.</p>
          <div className="hero-actions"><button className="button dark" onClick={() => scrollTo('shop')}>Explore the collection {icon('arrow', 18)}</button><button className="text-link" onClick={() => setQuizOpen(true)}>Find my ritual {icon('arrow', 16)}</button></div>
          <div className="hero-note"><span>01</span> Barrier-first essentials <span>02</span> No-fuss routines <span>03</span> Softly luminous finish</div>
        </div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1500&q=90" alt="Minimal skincare bottles arranged on a soft pink surface"/><div className="floating-card"><span>New ritual</span><strong>Rosewater Barrier Cream</strong><small>Comfort-first hydration</small></div></div>
      </section>

      <section id="shop" className="section shop-section">
        <div className="section-head"><div><p className="eyebrow">THE EDIT</p><h2>Everyday essentials</h2><p className="section-copy">A considered collection for cleansing, treating, moisturizing and protecting.</p></div><button className="text-link" onClick={() => setActiveCategory('All')}>View all {icon('arrow', 16)}</button></div>
        <div className="category-row">{categories.map((cat) => <button key={cat} className={activeCategory === cat ? 'category active' : 'category'} onClick={() => setActiveCategory(cat)}>{cat}</button>)}</div>
        <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
          <div className="product-media"><img src={product.image} alt={product.name} loading="lazy"/><button className="favorite" aria-label={`Save ${product.name}`}>{icon('heart', 19)}</button><button className="quick-add" onClick={() => addToCart(product)}>Add to bag</button></div>
          <button className="product-text" onClick={() => setSelected(product)}><div><p className="product-type">{product.type}</p><h3>{product.name}</h3></div><strong>${product.price}</strong></button>
        </article>)}</div>
      </section>

      <section id="ritual" className="ritual-section">
        <div className="ritual-image"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1400&q=90" alt="Soft pink skincare ritual arrangement" loading="lazy"/><div className="ritual-badge">3–5 MIN<br/><span>daily ritual</span></div></div>
        <div className="ritual-copy"><p className="eyebrow">YOUR RITUAL</p><h2>Three minutes.<br/><em>A little more you.</em></h2><p>Cleanse. Layer. Protect. Keep the routine simple enough to love and deliberate enough to matter.</p><div className="steps"><div><span>01</span><strong>Cleanse gently</strong><p>Start fresh without stripping your comfort.</p></div><div><span>02</span><strong>Hydrate + treat</strong><p>Choose one serum or essence that fits your skin today.</p></div><div><span>03</span><strong>Seal + protect</strong><p>Finish with moisturizer, then SPF every morning.</p></div></div><button className="button outline" onClick={() => setQuizOpen(true)}>Build my routine {icon('arrow', 18)}</button></div>
      </section>

      <section id="story" className="story-section"><div className="story-inner"><p className="eyebrow">OUR STORY</p><h2>Beauty that feels<br/><em>unhurried.</em></h2><p>Born from the belief that skincare can be both considered and uncomplicated, Lunéa pairs modern actives with a softer point of view: fewer decisions, beautiful textures, and rituals you can return to.</p><div className="story-stats"><div><strong>06</strong><span>core formulas</span></div><div><strong>03</strong><span>ritual steps</span></div><div><strong>01</strong><span>clear purpose</span></div></div></div></section>

      <section id="journal" className="section journal-section"><div className="section-head"><div><p className="eyebrow">THE JOURNAL</p><h2>Notes for your ritual</h2></div><button className="text-link" onClick={() => setNotice('Journal library is coming soon.')}>Read the journal {icon('arrow', 16)}</button></div><div className="journal-grid">{journal.map((entry) => <article className="journal-card" key={entry.title}><img src={entry.image} alt={entry.title} loading="lazy"/><div className="journal-meta"><span>{entry.type}</span><span>{entry.time}</span></div><h3>{entry.title}</h3><button className="text-link" onClick={() => setNotice('Article preview opened — full editorial is coming soon.')}>Read note {icon('arrow', 16)}</button></article>)}</div></section>

      <section className="newsletter"><div><p className="eyebrow">A LITTLE LUNÉA</p><h2>Quiet notes for your inbox.</h2><p>New rituals, product drops and useful skincare notes — sent occasionally.</p></div><form onSubmit={(e) => { e.preventDefault(); setNotice(email ? 'You are on the list.' : 'Enter an email to join.'); setEmail(''); }}><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" aria-label="Email address"/><button className="button dark" type="submit">Join {icon('arrow', 18)}</button></form></section>
    </main>

    <footer><div className="footer-top"><div><div className="logo">LUNÉA</div><p>Elevated skincare for everyday rituals.</p></div><div className="footer-links"><div><span>Explore</span><button onClick={() => scrollTo('shop')}>Shop</button><button onClick={() => scrollTo('ritual')}>Ritual</button><button onClick={() => scrollTo('journal')}>Journal</button></div><div><span>Support</span><button onClick={() => setNotice('Shipping: complimentary over $75.')}>Shipping</button><button onClick={() => setNotice('Returns: 30 days on unopened items.')}>Returns</button><button onClick={() => setNotice('Contact: hello@luneaskin.com')}>Contact</button></div></div></div><div className="footer-bottom"><small>© 2026 Lunéa Skin</small><small>Made for slower routines.</small></div></footer>

    {notice && <div className="toast" role="status">{notice}</div>}

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="product-modal" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setSelected(null)}>{icon('close', 22)}</button><img src={selected.image} alt={selected.name}/><div className="modal-copy"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><div className="modal-price">${selected.price} <span>· {selected.size}</span></div><p>{selected.copy}</p><div className="ingredient-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="button dark full" onClick={() => { addToCart(selected); setSelected(null); setBagOpen(true); }}>Add to bag {icon('bag', 17)}</button></div></div></div>}

    {bagOpen && <div className="modal-backdrop" onClick={() => setBagOpen(false)}><aside className="bag-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR BAG</p><h2>{itemCount} item{itemCount === 1 ? '' : 's'}</h2></div><button className="close-btn" onClick={() => setBagOpen(false)}>{icon('close', 22)}</button></div>{cart.length ? <><div className="bag-items">{cart.map((item) => <div className="bag-item" key={item.id}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>${item.price}</small><div className="qty"><button onClick={() => updateQty(item.id, -1)}>−</button><span>{item.qty}</span><button onClick={() => updateQty(item.id, 1)}>+</button></div></div></div>)}</div><div className="bag-summary"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><small>Taxes and shipping calculated at checkout.</small><button className="button dark full" onClick={() => setNotice('Checkout is ready for your payment gateway integration.')}>Checkout {icon('arrow', 18)}</button></div></> : <div className="empty-bag"><p>Your bag is waiting.</p><button className="button outline" onClick={() => { setBagOpen(false); scrollTo('shop'); }}>Explore products {icon('arrow', 17)}</button></div>}</aside></div>}

    {quizOpen && <div className="modal-backdrop" onClick={() => setQuizOpen(false)}><div className="quiz-modal" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setQuizOpen(false)}>{icon('close', 22)}</button>{quizStep === 0 && <><p className="eyebrow">MINI ROUTINE QUIZ</p><h2>How does your skin feel most days?</h2><div className="quiz-options">{[['dry','Dry or tight'],['balanced','Mostly balanced'],['oily','Oily or shiny']].map(([value,label]) => <button key={value} onClick={() => { setQuizAnswer(value); setQuizStep(1); }}>{label}{icon('arrow', 17)}</button>)}</div></>}{quizStep === 1 && recommended && <><p className="eyebrow">YOUR STARTING POINT</p><h2>Meet your ritual match.</h2><img className="quiz-product" src={recommended.image} alt={recommended.name}/><strong className="quiz-name">{recommended.name}</strong><p>{recommended.copy}</p><button className="button dark full" onClick={() => { addToCart(recommended); setQuizOpen(false); setBagOpen(true); }}>Add the match to my bag {icon('bag', 17)}</button><button className="text-link center" onClick={() => setQuizStep(0)}>Retake quiz</button></>}</div></div>}
    {accountOpen && <div className="modal-backdrop" onClick={() => setAccountOpen(false)}><div className="account-modal" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setAccountOpen(false)}>{icon('close', 22)}</button>{sessionUser ? <><p className="eyebrow">MY LUNÉA</p><h2>Welcome back.</h2><div className="account-card"><span>{sessionUser.email}</span><strong>{profile?.role === 'admin' ? 'Store administrator' : 'Customer account'}</strong></div>{profile?.role === 'admin' && <button className="button dark full" onClick={() => { setAccountOpen(false); setAdminOpen(true); }}>Open admin studio {icon('arrow', 18)}</button>}<button className="button outline full" onClick={signOut}>Log out</button></> : <><p className="eyebrow">LUNÉA ACCOUNT</p><h2>{authMode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2>{!supabase && <div className="setup-note">Secure customer accounts are wired for Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and apply supabase/schema.sql.</div>}<form className="auth-form" onSubmit={signInOrUp}>{authMode === 'signup' && <input required value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Full name" />}<input required type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email address" /><input required minLength="8" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password (8+ characters)" /><button className="button dark full">{authMode === 'login' ? 'Sign in' : 'Create account'}</button></form><button className="text-link center" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>{authMode === 'login' ? 'Create a new account' : 'I already have an account'}</button></>}</div></div>}
    {adminOpen && <div className="modal-backdrop" onClick={() => setAdminOpen(false)}><div className="admin-panel" onClick={(e) => e.stopPropagation()}><button className="close-btn" onClick={() => setAdminOpen(false)}>{icon('close', 22)}</button><p className="eyebrow">LUNÉA STUDIO</p><h2>Store administration</h2><p className="admin-intro">List and manage products without editing the website source code.</p>{profile?.role !== 'admin' ? <div className="setup-note">Admin access requires a profile with role <b>admin</b>. Apply supabase/schema.sql, then promote your owner account in the Supabase SQL editor.</div> : <div className="admin-grid"><form className="product-form" onSubmit={publishProduct}><h3>List a product</h3><input required value={adminProduct.name} onChange={(e) => setAdminProduct({...adminProduct,name:e.target.value})} placeholder="Product name" /><input required value={adminProduct.category} onChange={(e) => setAdminProduct({...adminProduct,category:e.target.value})} placeholder="Category" /><input value={adminProduct.type} onChange={(e) => setAdminProduct({...adminProduct,type:e.target.value})} placeholder="Product type" /><div className="two"><input required type="number" step="0.01" value={adminProduct.price} onChange={(e) => setAdminProduct({...adminProduct,price:e.target.value})} placeholder="Price" /><input type="number" value={adminProduct.stock} onChange={(e) => setAdminProduct({...adminProduct,stock:e.target.value})} placeholder="Stock" /></div><input value={adminProduct.size} onChange={(e) => setAdminProduct({...adminProduct,size:e.target.value})} placeholder="Size" /><input required value={adminProduct.image_url} onChange={(e) => setAdminProduct({...adminProduct,image_url:e.target.value})} placeholder="Product image URL" /><input value={adminProduct.tags} onChange={(e) => setAdminProduct({...adminProduct,tags:e.target.value})} placeholder="Tags, comma separated" /><textarea required value={adminProduct.description} onChange={(e) => setAdminProduct({...adminProduct,description:e.target.value})} placeholder="Product description" /><button className="button dark full">Publish product</button></form><div className="admin-products"><h3>Catalogue</h3>{adminProducts.map(p => <div className="admin-row" key={p.id}><img src={p.image_url} alt="" /><div><strong>{p.name}</strong><small>{p.category} · $</small></div></div>)}</div></div>}</div></div>}

  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
