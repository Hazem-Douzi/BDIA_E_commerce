/**
 * Configuration de l'API
 * URL de base et configuration des appels API
 */

export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8080/api",
  
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
    },
    
    // Products
    PRODUCTS: {
      ALL: "/product/All",
      BY_ID: "/product/:id",
      SEARCH: "/product/search",
      BY_SELLER: "/product/spec/:sellerId",
    },
    
    // Categories
    CATEGORIES: {
      ALL: "/category",
      BY_ID: "/category/:id",
    },
    
    // Cart
    CART: {
      GET: "/cart/",
      ADD: "/cart/add",
      UPDATE: "/cart/update",
      DELETE: "/cart/:itemId",
    },
    
    // Wishlist
    WISHLIST: {
      GET: "/wishlist/",
      COUNT: "/wishlist/count",
      ADD: "/wishlist/:productId",
      DELETE: "/wishlist/:productId",
      CHECK: "/wishlist/:productId/check",
    },
    
    // Orders
    ORDERS: {
      CREATE: "/order/create",
      BY_ID: "/order/:id",
      MY_ORDERS: "/order/my-orders",
    },
    
    // Payment
    PAYMENT: {
      STRIPE_CREATE: "/payment/stripe/create-checkout",
      STRIPE_VERIFY: "/payment/stripe/verify/:sessionId",
      STRIPE_CONFIG: "/payment/stripe/config",
    },
  },
};

export default API_CONFIG;
