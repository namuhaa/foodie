import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FoodMenu from './components/FoodMenu';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AdminModal from './components/AdminModal';
import Toast from './components/Toast';
import { api } from './services/api';

export default function App() {
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active order data
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [trackerOrderId, setTrackerOrderId] = useState('');

  // Fetch foods
  const fetchFoods = async (cat = selectedCategory, search = searchQuery) => {
    setLoadingFoods(true);
    try {
      const res = await api.getFoods(cat, search);
      if (res.success && res.data) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoadingFoods(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      if (res.success && res.counts) {
        setCategoryCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    fetchFoods(selectedCategory, searchQuery);
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleOrderPlaced = (newOrder) => {
    setLastPlacedOrder(newOrder);
    setTrackerOrderId(newOrder.orderId);
    setIsConfirmationOpen(true);
  };

  const handleTrackSpecificOrder = (orderId) => {
    setTrackerOrderId(orderId);
    setIsConfirmationOpen(false);
    setIsTrackerOpen(true);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Global Toast */}
      <Toast />

      {/* Navigation Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderId(lastPlacedOrder ? lastPlacedOrder.orderId : '');
          setIsTrackerOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onOrderNow={scrollToMenu}
          onExploreCategories={scrollToCategories}
        />

        {/* Menu Section with Search, Categories & Sorters */}
        <FoodMenu
          foods={foods}
          loading={loadingFoods}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={() => {
            fetchFoods(selectedCategory, searchQuery);
            fetchCategories();
          }}
        />

        {/* Features / Why Choose Us */}
        <Features />

        {/* Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        order={lastPlacedOrder}
        onClose={() => setIsConfirmationOpen(false)}
        onTrackOrder={handleTrackSpecificOrder}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        initialOrderId={trackerOrderId}
        onClose={() => setIsTrackerOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onFoodsUpdated={() => {
          fetchFoods(selectedCategory, searchQuery);
          fetchCategories();
        }}
      />
    </div>
  );
}
