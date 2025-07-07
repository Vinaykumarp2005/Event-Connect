import React from 'react'
import { useLocation } from 'react-router-dom'

function EventsById() {
  const {state}=useLocation();
  return (
    <div>EventsById</div>
  )
}

export default EventsById