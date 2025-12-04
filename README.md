 E-Commerce Platform
1/description:
We are building a complete e-commerce web platform where users can interact as clients (buyers) or as sellers, and where the system also provides an admin dashboard for global management.The platform contains multiple categories, each with sub-categories, and each sub-category contains products from different sellers.
2/👤 User Types
1. Client (Buyer)
A client can:
Create a client account and log in securely


Edit their profile and upload a photo


Browse all categories and sub-categories


Search for products and filter by:


price


brand


rating


Add items to:


Cart (Panier)


Wishlist


Comparator (Comparateur) — limited to two products from the same sub-category


Make secure payments using Stripe


View order history


Rate and review products they purchased



2. Seller
A seller can:
Create a seller account and log in securely


Edit their profile and manage their account information


Add new products with:


images


price


stock


description


Update or delete their products


Manage inventory (stock, pricing updates)


View ratings and feedback on their products


⚠️ Note: Logging in as seller is required; logging in as client is optional (depending on whether they want to sell).

3. Admin
The admin dashboard allows:
Secure admin login


Management of all registered:


clients


sellers


Creation and modification of main categories and sub-categories


Management of all products on the platform
manage comments
3/🧩 Platform Features Overview
General Features
Multi-category structure


Sub-categories with products from different sellers


Product comparison limited to two items from the same sub-category


Full product search and filtering (price, brand, rating)


Modern UI following the provided Figma design
Technical Features
Built with a modern full-stack setup (React front-end + flask for backend and mysql for database)


Stripe integration for real, secure payments


Photo upload for user profiles and product images(url or upload)


