import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import {
  Home,
  WhatBK,
  Shop,
  Error,
  Product,
  Blogs,
  Profile,
  Contact,
} from './pages';
import { ForgotPassword } from './components';
import {
  AppAdmin,
  LoginAdmin,
  UsersAdmin,
  ProductsAdmin,
  ProductReviewsAdmin,
  BlogsAdmin,
  BlogReviewsAdmin,
  AnalyticsAdmin,
  CartsAdmin,
} from './admin';
import {
  AddBlogAdmin,
  AddProductAdmin,
  BlogReviewInfoAdmin,
  CartInfoAdmin,
  EditBlogAdmin,
  EditProductAdmin,
  ProductReviewInfoAdmin,
  RemovedBlogAdmin,
  RemovedBlogReviewAdmin,
  RemovedProductAdmin,
  RemovedProductReviewAdmin,
  UserInfoAdmin,
} from './admin_components';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<WhatBK />} />
            <Route path="products" element={<Shop />} />
            <Route path="products/:id" element={<Product />} />
            <Route path="profile" element={<Profile />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blogs" element={<Blogs />} />
          </Route>
          <Route path="forgot-password" element={<ForgotPassword />} />
          {/* <Route path="profile" element={<Profile />} /> */}

          {/* protected routes */}
          <Route path="app/admin/login" element={<LoginAdmin />} />
          <Route path="app/admin" element={<AppAdmin />}>
            <Route index element={<AnalyticsAdmin />} />
            <Route path="users" element={<UsersAdmin />}>
              <Route path="info/:id" element={<UserInfoAdmin />} />
            </Route>
            <Route path="products" element={<ProductsAdmin />}>
              <Route path="add" element={<AddProductAdmin />} />
              <Route path="edit/:id" element={<EditProductAdmin />} />
              <Route path="removed" element={<RemovedProductAdmin />} />
            </Route>
            <Route path="product-reviews" element={<ProductReviewsAdmin />}>
              <Route path="info/:id" element={<ProductReviewInfoAdmin />} />
              <Route path="removed" element={<RemovedProductReviewAdmin />} />
            </Route>
            <Route path="blogs" element={<BlogsAdmin />}>
              <Route path="add" element={<AddBlogAdmin />} />
              <Route path="edit/:id" element={<EditBlogAdmin />} />
              <Route path="removed" element={<RemovedBlogAdmin />} />
            </Route>
            <Route path="blog-reviews" element={<BlogReviewsAdmin />}>
              <Route path="info/:id" element={<BlogReviewInfoAdmin />} />
              <Route path="removed" element={<RemovedBlogReviewAdmin />} />
            </Route>
            <Route path="carts" element={<CartsAdmin />}>
              <Route path="info/:id" element={<CartInfoAdmin />} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
