/**
 * Configuration des routes de l'application
 * Centralise toutes les routes pour faciliter la maintenance
 */

export const ROUTES = {
  // Routes publiques
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  
  // Routes client
  CLIENT: {
    HOME: "/",
    PRODUCT_LIST: "/products",
    PRODUCT_DETAIL: "/products/:id",
    PROFILE: "/profile",
    UPDATE_PROFILE: "/profile/update",
    WISHLIST: "/wishlist",
    CHECKOUT: "/checkout",
    PAYMENT: "/checkout/payment",
    CHECKOUT_SUCCESS: "/checkout/success",
  },
  
  // Routes seller
  SELLER: {
    HOME: "/seller",
    PRODUCTS: "/seller/products",
    PRODUCT_DETAIL: "/seller/products/:id",
    ADD_PRODUCT: "/seller/products/add",
    UPDATE_PRODUCT: "/seller/products/:id/update",
    PROFILE: "/seller/profile",
    UPDATE_PROFILE: "/seller/profile/update",
  },
  
  // Routes admin
  ADMIN: {
    DASHBOARD: "/admin",
    CLIENTS: "/admin/clients",
    SELLERS: "/admin/sellers",
    PRODUCTS: "/admin/products",
    CATEGORIES: "/admin/categories",
  },
};

export default ROUTES;
