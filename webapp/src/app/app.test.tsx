import React from 'react'
import { render } from '@testing-library/react'
import App from './app'

test('Default component returns default text', () => {
  const { getByText } = render(<App />)
  
  expect(getByText(/Welcome to the web app/)).toBeTruthy()
})
