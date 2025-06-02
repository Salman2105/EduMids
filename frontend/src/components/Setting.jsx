import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Setting() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Get token from localStorage (adjust if you store it elsewhere)
  const token = localStorage.getItem('token')
  console.log('Token:', token)
  const username = localStorage.getItem('user')
  console.log('User:', username)


  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data && res.data.user) {
          setUser(res.data.user)
          setForm(f => ({
            ...f,
            name: res.data.user.name || '',
            email: res.data.user.email || ''
          }))
        } else {
          setError('User data not found')
        }
      } catch (err) {
        setError('Failed to load user info')
      }
    }
    if (token) fetchUser()
  }, [token])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async e => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile', // changed from '/api/auth/profile'
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message)
      setForm({ ...form, password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await axios.delete('http://localhost:5000/api/auth/delete-profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage(res.data.message)
      // Optionally, log out user after deletion
      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Profile </h2>
      {user && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <div><b>Current Name:</b> {user.name}</div>
          <div><b>Current Email:</b> {user.email}</div>
          <div><b>Role:</b> {user.role}</div>
        </div>
      )}
      {message && <div className="mb-2 text-green-600">{message}</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1"> New Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1"> New Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <button type="submit" disabled={!!loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <hr className="my-6" />
      <button onClick={handleDelete} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">
        {loading ? 'Processing...' : 'Delete Account'}
      </button>
    </div>
  )
}
