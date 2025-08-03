'use client'
import React, { useEffect, useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Form, Alert } from 'antd'

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  if (!isLoaded) return null

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault()
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
          setError('')
        } else if (result.status === 'complete') {
          setActive({ session: result.createdSessionId })
          setError('')
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600">Enter your details to reset your password</p>
        </div>

        <form onSubmit={!successfulCreation ? create : reset} className="space-y-6">
          {!successfulCreation ? (
            <>
              <Form.Item label="Email address" className="mb-4">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-10 font-medium"
              >
                Send password reset code
              </Button>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="mt-4"
                />
              )}
            </>
          ) : (
            <>
              <Form.Item label="New password" className="mb-4">
                <Input.Password
                  required
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Reset code" className="mb-4">
                <Input
                  type="text"
                  required
                  placeholder="Enter the reset code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-10 font-medium"
              >
                Reset Password
              </Button>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="mt-4"
                />
              )}
            </>
          )}

          {secondFactor && (
            <Alert
              message="2FA is required, but this UI does not handle that."
              type="warning"
              showIcon
              className="mt-4"
            />
          )}
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          <Link
            href="/sign-in"
            className="font-medium text-black hover:text-gray-800"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage