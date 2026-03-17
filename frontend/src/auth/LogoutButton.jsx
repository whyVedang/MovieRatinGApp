import { Button } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { MutateLogout } from './mutation'
import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const navigate = useNavigate()
  
  // Setup mutation for logout
  const { isLoading, mutate } = useMutation({
    mutationKey: ['Logout'],
    mutationFn: MutateLogout,
    onSuccess: () => {
      // Redirect to login screen after successful logout
      navigate('/login')
    },
    onError: (error) => {
      console.error('Logout error:', error)
      alert('Failed to logout. Please try again.')
    }
  })
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      mutate()
    }
  }
  
  return (
    <Button 
      onClick={handleLogout} 
      variant="solid" 
      color="red" 
      disabled={isLoading}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}

export default LogoutButton