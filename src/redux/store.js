import { configureStore } from '@reduxjs/toolkit';

// client
import loginReducer from '../components/Login/loginSlice';
import usersReducer from '../components/Profile/profileSlice';
import productsReducer from '../components/Product/productSlice';
import productReviewsReducer from '../components/Product/productReviewSlice';
import blogsReducer from '../components/Blog/blogSlice';
import blogReviewsReducer from '../components/Blog/blogReviewSlice';
import cartsReducer from '../components/Cart/cartSlice';

// admin
import adminNavbarReducer from '../admin_components/Navbar/navbarSlice';
import adminLoginReducer from '../admin_components/Login/loginSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    users: usersReducer,
    products: productsReducer,
    productReviews: productReviewsReducer,
    blogs: blogsReducer,
    blogReviews: blogReviewsReducer,
    carts: cartsReducer,

    adminNavbar: adminNavbarReducer,
    adminLogin: adminLoginReducer,
  },
});
