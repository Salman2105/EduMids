import React from 'react'
import SearchBar from "../../components/SearchBar";
import Footer from "../Footer";

function PaymentSummary() {
  return (
  <>  <div className="p-6">
            <SearchBar />
      <h2 className="text-xl font-bold">Admin payments</h2>
      <p>This page displays system payments.</p>
    </div>
        <Footer />
    </> 
  )
}

export default PaymentSummary
