# FreshBite — Online Food Ordering

A frontend-only food ordering web app built for the **Free Web Development Internship Online** (Task ID: WD-EC-001, Data Alcott Systems).

🔗 Task link: https://www.freeinternships.in/blog/

## Live Site

*🔗 https://mominabanu9741-source.github.io/freshbite-food-ordering/*

## Overview

FreshBite lets users browse restaurants, filter by cuisine/rating/price, view menus with dietary tags, add items to a cart, apply coupons, and complete a simulated checkout with delivery tracking. Login/account and order history are also simulated client-side.

## Tech Stack

* HTML5, CSS3, vanilla JavaScript (no frameworks, no build step)
* No database — all data lives in JS arrays/objects (`script.js`)
* `localStorage` used to persist cart, login session, and order history across page reloads

## Features

**Core**

* Restaurant listing with cuisine, rating, and price filters
* Full menu + per-restaurant menu view
* Add to cart, quantity adjustment, live price calculation
* Cart drawer with subtotal, delivery fee, and total
* Checkout: delivery address, delivery time, payment method selection, order summary
* Simulated login/register and account panel

**Bonus**

* Dietary filters (Veg / Non-Veg / Vegan) with colored indicators
* Coupon codes (`FRESH50` for 15% off, `WELCOME10` for 10% off)
* Simulated order tracking (Preparing → Out for delivery → Arriving → Delivered)
* Order history stored per session
* Search bar (matches dish name, description, restaurant, or cuisine)
* Fully responsive: mobile nav, responsive grids, full-width cart drawer on mobile

## File Structure

```
freshbite/
├── index.html      # Page structure — home, restaurants, menu, about, contact, cart, checkout, login
├── style.css        # Design system (tokens, layout, responsive rules)
├── script.js         # Data (restaurants + menu items), cart logic, filters, checkout, auth simulation
└── README.md
```

## Data Model (JavaScript only, no backend)

```js
const restaurants = \[{ id, name, cuisine, rating, price, area, emoji }, ...];
const foodItems   = \[{ id, restaurantId, name, price, diet, desc, emoji }, ...];
let cart           = \[{ id, name, price, qty }, ...];   // persisted to localStorage
let orderHistory   = \[{ id, items, total, date, address }, ...];
```

## Running Locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 5500
```

## Design Notes

Palette follows the brief: warm orange `#FF6B35`, cream `#FFF8F0`, dark brown `#2D1B12`, with green/red/gold accents for diet tags, ratings, and the awards ticket. Display type is Fraunces (warm, appetizing serif); body type is Work Sans. Signature detail: a perforated "ticket stub" card in the About section and a subtle rising-steam animation in the hero.

## Learning Outcomes

* Structuring a multi-view single-page app with vanilla JS state management (no framework)
* Building cart logic (add/remove/quantity) without a backend
* Using `localStorage` to persist state across sessions
* Designing a cohesive visual identity from a brief (color, type, layout, signature element)
* Responsive design with CSS Grid, Flexbox, and mobile navigation patterns

## Challenges

* Keeping cart state in sync across three different render surfaces (menu grid, cart drawer, checkout summary) without a framework
* Simulating realistic flows (login, order tracking, coupons) using only client-side JS

\---

Submitted for: Free Web Development Internship Online — Data Alcott Systems (www.freeinternships.in)

