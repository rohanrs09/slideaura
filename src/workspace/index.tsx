import React from 'react'
import { Outlet } from 'react-router-dom'

function WorkSpace() {
  return (
    <div>
      WorkSpace
      <Outlet/>
    </div>
  )
}

export default WorkSpace