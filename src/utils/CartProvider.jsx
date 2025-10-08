// src/context/CartProvider.jsx
import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContextDefinition"; // CartContext এখানে ইম্পোর্ট করা হয়েছে

const CartProvider = ({ children }) => {
  // localStorage থেকে কার্ট আইটেম লোড করা হচ্ছে
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("shoppingCart");
      return localCart ? JSON.parse(localCart) : []; // যদি localCart থাকে, তবে পার্স করে রিটার্ন করো, না হলে খালি অ্যারে
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error); // ত্রুটি হলে কনসোলে দেখানো হবে
      return []; // ত্রুটি হলে খালি অ্যারে দাও
    }
  });

  // cartItems পরিবর্তন হলে, localStorage এ সেভ করো
  useEffect(() => {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]); // cartItems পরিবর্তন হলেই এই effect রান হবে

  // নতুন আইটেম যোগ করার ফাংশন
  const addToCart = (itemToAdd) => {
    setCartItems((prevItems) => {
      // existingItem = prevItems.find((item) => item.id === itemToAdd.id);
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id); //

      if (existingItem) {
        // যদি আইটেমটি ইতিমধ্যেই কার্টে থাকে, তার quantity বৃদ্ধি করুন
        return prevItems.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // যদি আইটেমটি কার্টে না থাকে, নতুন quantity 1 সহ যোগ করুন
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // কার্ট থেকে আইটেম সরানোর ফাংশন
  const removeFromCart = (idToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== idToRemove),
    );
  };

  // কার্ট খালি করার ফাংশন (ঐচ্ছিক, যদি প্রয়োজন হয়)
  const clearCart = () => {
    setCartItems([]);
  };

  // Subtotal গণনা করা হচ্ছে
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Shipping, Tax এবং Total (এগুলো আপনার প্রয়োজন অনুযায়ী সেট করুন)
  const shipping = 4.0; // উদাহরণ মূল্য
  const taxRate = 0.05; // 5% ট্যাক্স
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart, // clearCart ফাংশনও প্রদান করা হচ্ছে
        subtotal,
        shipping,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
