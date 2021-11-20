import React from 'react'
import './App.scss'
import { getHash } from 'lowpass/src/app'

const App = () => {
  return <h1>Welcome to the web app! {getHash('hello world')}</h1>
}

export default App
