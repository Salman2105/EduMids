import React from 'react'
import SearchBar from "../../components/SearchBar";
import AdminpaymentCard from "./AdminpaymentCard";
function PaymentSummary() {
  return (
  <>  <div className="p-6 h-full">
      <SearchBar />
      <AdminpaymentCard />
    </div>
    </> 
  )
}

export default PaymentSummary
