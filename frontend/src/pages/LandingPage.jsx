import React from "react";
// import { Search } from "lucide-react";
// import { Link } from "react-router-dom";
import Header from "./Header";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Category from "../components/Category";
import Cta from "../components/Cta";
import Std from "../components/Std";
import Feature from "../components/Feature";
import Footer from "./Footer";const LandingPage = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-800">
      <Header />
      <Hero />
      <Std />
      <Feature />
      <Category />
      <Banner />
      <Cta />
    </div>
      <Footer />
</>
  );
};

export default LandingPage;
