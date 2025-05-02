import { Button } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { MutateUserLogin } from './mutation'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { isLoading, mutate } = useMutation({ 
    mutationKey: ['Login'], 
    mutationFn: MutateUserLogin,
    onSuccess: (data) => {
      // Save session ID to localStorage for future API calls
      localStorage.setItem('tmdb_session_id', data.session_id)
      // Navigate to home page after successful login
      navigate('/')
    },
    onError: (error) => {
      setError(error.message || 'Login failed. Please check your credentials.')
    }
  })

  // Form submission handler
  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }
    
    setError('')
    
    await mutate({ username, password })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login to TMDB</h1>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter TMDb username"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Auth