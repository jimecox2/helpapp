// components/Dashboard/Graphs/BurndownDataComponent.jsx

'use client'
import React from 'react';
import { useSession } from 'next-auth/react'
import BurndownChart from '@/components/Dashboard/Graphs/BurndownChart'
import useSWR from 'swr'
import { fetchDataWithToken, filterL4Data, filterL3AndL4Data } from '@/lib/crud/pubsetDataFetcher'

const BurndownDataComponent = () => {
  // auth
  let currrentUser = null
  const { data: session, status } = useSession()
  if (status === 'authenticated') {
    currrentUser = session.user.name
  }
 
  // get pubset data
  const fetcher = async () => {
    if (session && status === 'authenticated') {
      return await fetchDataWithToken(session)
    }
    return null;
  }
  
  const { data, error } = useSWR(status === 'authenticated' ? 'fetchData' : null, fetcher)
  
  // Add loading state check first
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  // Then check if data exists
  if (!data) {
    return <div>No Data, did you publish the Active Pubset? Did you run the Burndown in the Agilebars Client first.</div>
  }
  
  // Check for error
  if (error) {
    return <div>Failed to load data: {error.message}</div>
  }
  
  // Now that we know data exists, we can safely destructure it
  const { bdCharts, resCalcs } = data;
  
  // Check bdCharts
  if (!bdCharts || bdCharts.length === 0) {
    return <div>Cannot Generate Burndown Chart. You may have published but did not run it in the Agilebars Client first.</div>
  }
  
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Agilebars Burndown Chart</h1>
        {/* Using the first chart in the array */}
        <BurndownChart chartData={bdCharts[0]}/> 
      </div>
    </div>
  )
}

export default BurndownDataComponent