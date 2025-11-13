import { useState } from 'react'
import ResourceFinder from "./components/ResourceFinder"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ResourceFinder/>
    </>
  )
}

export default App
