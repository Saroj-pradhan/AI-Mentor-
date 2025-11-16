import { useState } from 'react'
import ResourceFinder from "./components/ResourceFinder"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import HomePage from './components/HomePage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       

      <SignedIn>
        <ResourceFinder/>
      </SignedIn>

      <SignedOut>
        <HomePage/>
      </SignedOut>
      

      
    </>
  )
}

export default App
