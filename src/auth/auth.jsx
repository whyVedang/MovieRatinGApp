import { Button } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { MutateLogin } from './mutation'
function Auth() {
  const { data, mutate } = useMutation({ mutationKey: ['Login'], mutationFn: MutateLogin })
  const handleLogin = async () => {
    await mutate();
  }
  return (
    <div>
      <Button onClick={handleLogin} variant="primary">Login</Button>
    </div>
  )
}

export default Auth