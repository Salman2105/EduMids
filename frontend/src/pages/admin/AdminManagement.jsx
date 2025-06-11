import React, { useState } from 'react'
import StudentCard from './AdminStudentsCard'
import AdminReportCard from './AdminReportCard'
import QnA from './AdminQnaCard'
import AdminpaymentCard from './AdminpaymentCard'
import AdminCertificateCard from './AdminCertificateCard'

export default function AdminManagement() {
  const [tab, setTab] = useState('users')

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Management Panel</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded ${
            tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`px-4 py-2 rounded ${
            tab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Reports
        </button>
        <button
          onClick={() => setTab('qna')}
          className={`px-4 py-2 rounded ${
            tab === 'qna' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Q&amp;A
        </button>
        <button
          onClick={() => setTab('payments')}
          className={`px-4 py-2 rounded ${
            tab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setTab('certificates')}
          className={`px-4 py-2 rounded ${
            tab === 'certificates' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Certificates
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {tab === 'users' && <StudentCard />}
        {tab === 'reports' && <AdminReportCard />}
        {tab === 'qna' && <QnA />}
        {tab === 'payments' && <AdminpaymentCard />}
        {tab === 'certificates' && <AdminCertificateCard />}
      </div>
    </div>
  )
}
