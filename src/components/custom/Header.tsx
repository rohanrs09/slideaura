import React from 'react'
import logo from '../../assets/logo.png'
import { Button } from '../ui/button'

function Header() { 
  return (
    <div className='flex items-center justify-between px-10 py-3  shadow'>
      <img src={logo}   alt="logo" width={50} height={50}/>
      <Button>Get Started</Button>

    </div> 
  )
}

export default Header