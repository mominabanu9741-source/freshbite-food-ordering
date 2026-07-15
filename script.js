/* ===========================================================
   FreshBite — data layer
   No database: everything lives in JS arrays/objects and
   is optionally persisted to localStorage.
   =========================================================== */

const restaurants = [
  { id: 1, name: "Rajma Ghar",        cuisine: "Indian",  rating: 4.6, price: 1, emoji: "🍛", area: "Koramangala" },
  { id: 2, name: "Nonna's Table",     cuisine: "Italian", rating: 4.4, price: 2, emoji: "🍝", area: "Indiranagar" },
  { id: 3, name: "Wok This Way",      cuisine: "Chinese", rating: 4.2, price: 1, emoji: "🥡", area: "HSR Layout" },
  { id: 4, name: "The Sweet Spot",    cuisine: "Desserts",rating: 4.8, price: 2, emoji: "🍰", area: "Jayanagar" },
  { id: 5, name: "Tandoor Junction",  cuisine: "Indian",  rating: 4.3, price: 2, emoji: "🍢", area: "Whitefield" },
  { id: 6, name: "Basil & Vine",      cuisine: "Italian", rating: 4.7, price: 3, emoji: "🍕", area: "MG Road" },
];

const foodItems = [
  { id: 101, restaurantId: 1, name: "Rajma Chawal",        price: 149, diet: "veg",    desc: "Slow-cooked kidney beans, steamed rice, ghee tempering.", emoji: "🍛" },
  { id: 102, restaurantId: 1, name: "Paneer Butter Masala", price: 199, diet: "veg",   desc: "Cottage cheese in a rich tomato-cashew gravy.", emoji: "🧈" },
  { id: 103, restaurantId: 1, name: "Chicken Curry",        price: 229, diet: "nonveg", desc: "Home-style chicken curry with roti or rice.", emoji: "🍗" },
  { id: 201, restaurantId: 2, name: "Margherita Pizza",     price: 299, diet: "veg",   desc: "San Marzano tomato, fior di latte, fresh basil.", emoji: "🍕" },
  { id: 202, restaurantId: 2, name: "Spaghetti Aglio Olio", price: 259, diet: "vegan", desc: "Garlic, chilli flakes, olive oil, parsley.", emoji: "🍝" },
  { id: 203, restaurantId: 2, name: "Chicken Alfredo",      price: 329, diet: "nonveg", desc: "Creamy alfredo, grilled chicken, parmesan.", emoji: "🍗" },
  { id: 301, restaurantId: 3, name: "Veg Hakka Noodles",    price: 179, diet: "veg",   desc: "Wok-tossed noodles, crunchy vegetables.", emoji: "🍜" },
  { id: 302, restaurantId: 3, name: "Chilli Chicken",       price: 239, diet: "nonveg", desc: "Indo-Chinese classic, sweet-spicy glaze.", emoji: "🌶️" },
  { id: 303, restaurantId: 3, name: "Veg Dumplings",        price: 159, diet: "vegan", desc: "Steamed dumplings, chilli-garlic oil.", emoji: "🥟" },
  { id: 401, restaurantId: 4, name: "Belgian Chocolate Cake", price: 189, diet: "veg", desc: "Dense chocolate sponge, ganache drip.", emoji: "🍰" },
  { id: 402, restaurantId: 4, name: "Vegan Brownie",        price: 169, diet: "vegan", desc: "Fudgy cocoa brownie, no dairy, no eggs.", emoji: "🍫" },
  { id: 403, restaurantId: 4, name: "Gulab Jamun (4pc)",    price: 99,  diet: "veg",   desc: "Milk-solid dumplings in cardamom syrup.", emoji: "🍮" },
  { id: 501, restaurantId: 5, name: "Seekh Kebab",          price: 219, diet: "nonveg", desc: "Char-grilled minced lamb skewers.", emoji: "🍢" },
  { id: 502, restaurantId: 5, name: "Tandoori Aloo",        price: 169, diet: "vegan", desc: "Smoky char-grilled potatoes, mint chutney.", emoji: "🥔" },
  { id: 601, restaurantId: 6, name: "Truffle Mushroom Pizza", price: 349, diet: "veg", desc: "Wild mushrooms, truffle oil, mozzarella.", emoji: "🍄" },
  { id: 602, restaurantId: 6, name: "Caprese Salad",        price: 209, diet: "vegan", desc: "Heirloom tomato, basil, olive oil.", emoji: "🥗" },
];

const coupons = { FRESH50: 0.15, WELCOME10: 0.10 };
const DELIVERY_FEE = 30;

/* ===========================================================
   State
   =========================================================== */
let cart = JSON.parse(localStorage.getItem("fb_cart") || "[]");
let selectedRestaurantId = null;
let activeCuisine = "all";
let activeDiet = "all";
let appliedDiscount = 0;
let user = JSON.parse(localStorage.getItem("fb_user") || "null");
let orderHistory = JSON.parse(localStorage.getItem("fb_orders") || "[]");
let wishlist = JSON.parse(localStorage.getItem("fb_wishlist") || "[]");

function saveCart(){ localStorage.setItem("fb_cart", JSON.stringify(cart)); }
function saveOrders(){ localStorage.setItem("fb_orders", JSON.stringify(orderHistory)); }

/* ===========================================================
   Render: Restaurants
   =========================================================== */
function renderRestaurants(){
  const grid = document.getElementById("restaurantGrid");
  const cuisine = document.getElementById("cuisineFilter").value;
  const minRating = parseFloat(document.getElementById("ratingFilter").value);
  const price = document.getElementById("priceFilter").value;

  const filtered = restaurants.filter(r =>
    (cuisine === "all" || r.cuisine === cuisine) &&
    r.rating >= minRating &&
    (price === "0" || r.price === parseInt(price))
  );

  grid.innerHTML = filtered.map(r => `
    <div class="restaurant-card" data-id="${r.id}">
      <div class="restaurant-img">${r.emoji}</div>
      <div class="restaurant-body">
        <h3>${r.name}</h3>
        <div class="restaurant-meta">
          <span class="rating-pill">★ ${r.rating}</span>
          <span>${r.cuisine}</span>
          <span>${r.area}</span>
          <span class="price-dots" data-price="${'₹'.repeat(r.price)}"></span>
        </div>
      </div>
    </div>
  `).join("") || `<p>No restaurants match those filters.</p>`;

  grid.querySelectorAll(".restaurant-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedRestaurantId = parseInt(card.dataset.id);
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
      renderMenu();
    });
  });
}

/* ===========================================================
   Render: Menu
   =========================================================== */
function renderMenu(){
  const grid = document.getElementById("menuGrid");
  const heading = document.getElementById("menuHeading");
  const note = document.getElementById("menuRestaurantNote");

  let items = foodItems;
  if (selectedRestaurantId){
    const r = restaurants.find(x => x.id === selectedRestaurantId);
    heading.textContent = `${r.name}'s menu`;
    note.textContent = `Showing dishes from ${r.name} · ${r.area}`;
    items = items.filter(f => f.restaurantId === selectedRestaurantId);
  } else {
    heading.textContent = "Full menu";
    note.textContent = "Browse everything, or pick a restaurant above.";
  }

  if (activeDiet !== "all"){
    items = items.filter(f => f.diet === activeDiet);
  }

  grid.innerHTML = items.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const dietClass = item.diet === "nonveg" ? "nonveg" : item.diet === "vegan" ? "vegan" : "veg";
    return `
    <div class="food-card">
      <div class="food-img">
        <span class="diet-dot ${dietClass}"></span>
        ${item.emoji}
      </div>
      <div class="food-body">
        <h4>${item.name}</h4>
        <p class="food-desc">${item.desc}</p>
        <div class="food-footer">
          <span class="food-price">₹${item.price}</span>
          <div class="qty-area" data-id="${item.id}">
            ${inCart
              ? `<div class="qty-control">
                   <button class="qty-minus">−</button>
                   <span>${inCart.qty}</span>
                   <button class="qty-plus">+</button>
                 </div>`
              : `<button class="add-btn">Add</button>`}
          </div>
        </div>
      </div>
    </div>`;
  }).join("") || `<p>No dishes match this filter.</p>`;

  grid.querySelectorAll(".qty-area").forEach(area => {
    const id = parseInt(area.dataset.id);
    const addBtn = area.querySelector(".add-btn");
    if (addBtn) addBtn.addEventListener("click", () => addToCart(id));
    const minus = area.querySelector(".qty-minus");
    const plus = area.querySelector(".qty-plus");
    if (minus) minus.addEventListener("click", () => changeQty(id, -1));
    if (plus) plus.addEventListener("click", () => changeQty(id, 1));
  });
}

/* ===========================================================
   Cart logic
   =========================================================== */
function addToCart(id){
  const item = foodItems.find(f => f.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  saveCart();
  renderMenu();
  renderCart();
  updateCartCount();
  flashCartIcon();
}

function changeQty(id, delta){
  const existing = cart.find(c => c.id === id);
  if (!existing) return;
  existing.qty += delta;
  if (existing.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
  renderMenu();
  renderCart();
  updateCartCount();
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderMenu();
  renderCart();
  updateCartCount();
}

function cartSubtotal(){
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function updateCartCount(){
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

function flashCartIcon(){
  const btn = document.getElementById("cartBtn");
  btn.style.transform = "scale(1.15)";
  setTimeout(() => { btn.style.transform = ""; }, 150);
}

function renderCart(){
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");

  if (cart.length === 0){
    container.innerHTML = `<p class="cart-empty">Your cart is empty. Go find something delicious.</p>`;
    summary.innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">₹${c.price} × ${c.qty}</div>
      </div>
      <button class="remove-btn" data-id="${c.id}">Remove</button>
    </div>
  `).join("");

  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)));
  });

  const subtotal = cartSubtotal();
  summary.innerHTML = `
    <div><span>Subtotal</span><span>₹${subtotal}</span></div>
    <div><span>Delivery fee</span><span>₹${DELIVERY_FEE}</span></div>
    <div class="total-row"><span>Total</span><span>₹${subtotal + DELIVERY_FEE}</span></div>
  `;
}

/* ===========================================================
   Checkout
   =========================================================== */
function renderCheckoutSummary(){
  const summary = document.getElementById("checkoutSummary");
  const subtotal = cartSubtotal();
  const discount = Math.round(subtotal * appliedDiscount);
  const total = subtotal - discount + DELIVERY_FEE;
  summary.innerHTML = `
    <div><span>Subtotal</span><span>₹${subtotal}</span></div>
    ${discount > 0 ? `<div><span>Discount</span><span>−₹${discount}</span></div>` : ""}
    <div><span>Delivery fee</span><span>₹${DELIVERY_FEE}</span></div>
    <div style="font-weight:700;border-top:1px dashed rgba(45,27,18,.2);padding-top:6px;margin-top:2px;">
      <span>Total</span><span>₹${total}</span>
    </div>
  `;
  return total;
}

function applyCoupon(){
  const code = document.getElementById("couponInput").value.trim().toUpperCase();
  const msg = document.getElementById("couponMsg");
  if (coupons[code]){
    appliedDiscount = coupons[code];
    msg.textContent = `Applied! ${coupons[code] * 100}% off your order.`;
  } else {
    appliedDiscount = 0;
    msg.textContent = code ? "That code isn't valid." : "";
  }
  renderCheckoutSummary();
}

function placeOrder(){
  if (cart.length === 0) return;
  const total = renderCheckoutSummary();
  const order = {
    id: "FB" + Date.now().toString().slice(-6),
    items: [...cart],
    total,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    address: document.getElementById("deliveryAddress").value,
  };
  orderHistory.unshift(order);
  saveOrders();
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  renderMenu();

  document.getElementById("checkoutStep1").classList.add("hidden");
  document.getElementById("checkoutStep2").classList.remove("hidden");
  document.getElementById("orderConfirmText").textContent =
    `Order ${order.id} is confirmed — ₹${total} · delivering to ${order.address}.`;

  simulateTracking();
}

function simulateTracking(){
  const stages = ["Preparing your order…", "Out for delivery…", "Arriving in 5 minutes…", "Delivered ✓"];
  let i = 0;
  const el = document.getElementById("orderTrackStatus");
  el.textContent = stages[0];
  const interval = setInterval(() => {
    i++;
    if (i >= stages.length){ clearInterval(interval); return; }
    el.textContent = stages[i];
  }, 1800);
}

/* ===========================================================
   Login / Account (simulated — no backend)
   =========================================================== */
function renderAccount(){
  const loginView = document.getElementById("loginView");
  const accountView = document.getElementById("accountView");
  if (user){
    loginView.classList.add("hidden");
    accountView.classList.remove("hidden");
    document.getElementById("accountName").textContent = user.name;
    document.getElementById("wishlistCount").textContent = wishlist.length;
    const historyEl = document.getElementById("orderHistory");
    historyEl.innerHTML = orderHistory.length
      ? orderHistory.map(o => `<div class="order-history-item">${o.id} · ${o.date} · ₹${o.total}</div>`).join("")
      : `<div class="order-history-item">No orders yet.</div>`;
  } else {
    loginView.classList.remove("hidden");
    accountView.classList.add("hidden");
  }
}

/* ===========================================================
   Wiring up events
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderRestaurants();
  renderMenu();
  renderCart();
  updateCartCount();

  // filters
  ["cuisineFilter","ratingFilter","priceFilter"].forEach(id =>
    document.getElementById(id).addEventListener("change", renderRestaurants)
  );

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      document.getElementById("cuisineFilter").value = chip.dataset.cuisine;
      renderRestaurants();
      document.getElementById("restaurants").scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll(".diet-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".diet-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeDiet = chip.dataset.diet;
      renderMenu();
    });
  });

  document.getElementById("heroSearch").addEventListener("submit", e => {
    e.preventDefault();
    const q = document.getElementById("heroSearchInput").value.trim().toLowerCase();
    if (!q) return;
    selectedRestaurantId = null;
    activeDiet = "all";
    document.querySelectorAll(".diet-chip").forEach(c => c.classList.remove("active"));
    document.querySelector('.diet-chip[data-diet="all"]').classList.add("active");
    renderMenuFiltered(q);
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });

  // nav toggle
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });

  // cart drawer
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  document.getElementById("cartBtn").addEventListener("click", () => {
    drawer.classList.add("open"); backdrop.classList.add("open");
  });
  document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
  backdrop.addEventListener("click", closeCartDrawer);
  function closeCartDrawer(){ drawer.classList.remove("open"); backdrop.classList.remove("open"); }

  // checkout modal
  const checkoutBackdrop = document.getElementById("checkoutBackdrop");
  document.getElementById("goToCheckout").addEventListener("click", () => {
    if (cart.length === 0) return;
    closeCartDrawer();
    document.getElementById("checkoutStep1").classList.remove("hidden");
    document.getElementById("checkoutStep2").classList.add("hidden");
    appliedDiscount = 0;
    document.getElementById("couponInput").value = "";
    document.getElementById("couponMsg").textContent = "";
    renderCheckoutSummary();
    checkoutBackdrop.classList.add("open");
  });
  document.getElementById("closeCheckout").addEventListener("click", () => checkoutBackdrop.classList.remove("open"));
  checkoutBackdrop.addEventListener("click", e => { if (e.target === checkoutBackdrop) checkoutBackdrop.classList.remove("open"); });
  document.getElementById("applyCoupon").addEventListener("click", applyCoupon);
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
  document.getElementById("closeSuccess").addEventListener("click", () => checkoutBackdrop.classList.remove("open"));

  // login modal
  const loginBackdrop = document.getElementById("loginBackdrop");
  document.getElementById("accountBtn").addEventListener("click", () => {
    renderAccount();
    loginBackdrop.classList.add("open");
  });
  document.getElementById("closeLogin").addEventListener("click", () => loginBackdrop.classList.remove("open"));
  loginBackdrop.addEventListener("click", e => { if (e.target === loginBackdrop) loginBackdrop.classList.remove("open"); });
  document.getElementById("loginSubmit").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    if (!email) return;
    user = { name: email.split("@")[0], email };
    localStorage.setItem("fb_user", JSON.stringify(user));
    renderAccount();
  });
  document.getElementById("showRegister").addEventListener("click", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim() || "friend@example.com";
    user = { name: email.split("@")[0], email };
    localStorage.setItem("fb_user", JSON.stringify(user));
    renderAccount();
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    user = null;
    localStorage.removeItem("fb_user");
    renderAccount();
  });

  // contact form (simulated submit)
  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("contactNote").textContent = "Thanks — we'll reply within 24 hours.";
    e.target.reset();
  });
});

function renderMenuFiltered(query){
  const grid = document.getElementById("menuGrid");
  const heading = document.getElementById("menuHeading");
  const note = document.getElementById("menuRestaurantNote");
  heading.textContent = `Results for "${query}"`;
  const matches = foodItems.filter(f =>
    f.name.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query)
  );
  const cuisineMatches = restaurants.filter(r => r.cuisine.toLowerCase().includes(query) || r.name.toLowerCase().includes(query));
  const combined = cuisineMatches.length
    ? foodItems.filter(f => cuisineMatches.some(r => r.id === f.restaurantId))
    : matches;
  note.textContent = `${combined.length} dish${combined.length === 1 ? "" : "es"} found`;

  grid.innerHTML = combined.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const dietClass = item.diet === "nonveg" ? "nonveg" : item.diet === "vegan" ? "vegan" : "veg";
    return `
    <div class="food-card">
      <div class="food-img"><span class="diet-dot ${dietClass}"></span>${item.emoji}</div>
      <div class="food-body">
        <h4>${item.name}</h4>
        <p class="food-desc">${item.desc}</p>
        <div class="food-footer">
          <span class="food-price">₹${item.price}</span>
          <div class="qty-area" data-id="${item.id}">
            ${inCart
              ? `<div class="qty-control"><button class="qty-minus">−</button><span>${inCart.qty}</span><button class="qty-plus">+</button></div>`
              : `<button class="add-btn">Add</button>`}
          </div>
        </div>
      </div>
    </div>`;
  }).join("") || `<p>No dishes matched your search.</p>`;

  grid.querySelectorAll(".qty-area").forEach(area => {
    const id = parseInt(area.dataset.id);
    const addBtn = area.querySelector(".add-btn");
    if (addBtn) addBtn.addEventListener("click", () => addToCart(id));
    const minus = area.querySelector(".qty-minus");
    const plus = area.querySelector(".qty-plus");
    if (minus) minus.addEventListener("click", () => changeQty(id, -1));
    if (plus) plus.addEventListener("click", () => changeQty(id, 1));
  });
}
