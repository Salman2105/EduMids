import React from 'react'
import SearchBar from "../../components/SearchBar";
function PaymentSummary() {
  return (
  <>  <div className="p-6 h-full">
            <SearchBar />
      <h2 className="text-xl font-bold">Admin payments</h2>
      <p>This page displays system payments.</p>
    </div>
    </> 
  )
}

export default PaymentSummary
