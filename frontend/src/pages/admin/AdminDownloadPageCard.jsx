import React from 'react'
import AdminDownloadPage from "./AdminDownloadPage"
import Searchbar from "../../components/SearchBar";


export default function AdminDownloadPageCard() {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white ">
    <Searchbar/>
      <AdminDownloadPage />
    </div>
  )
}
