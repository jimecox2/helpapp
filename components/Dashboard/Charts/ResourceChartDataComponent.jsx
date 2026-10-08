// components/Dashboard/Charts/ResourceChartDataComponent.jsx
'use client'
import { useSession } from 'next-auth/react'
import DashboardHero from "@/components/Dashboard/Common/DashboardHero.jsx"

import { FRONTEND_URL } from '@/config/site'

import useSWR from 'swr'
import { fetchDataWithToken, filterL4Data, filterL3AndL4Data } from '@/lib/crud/pubsetDataFetcher'
import ResourceUsageChart from '@/components/Dashboard/Charts/ResourceUsageChart'

const ResourceChartDataComponent = () => {
    // auth
    let currrentUser = null
  const { data: session, status } = useSession()
  //const { user: { name, email }, jwt } = session;
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
  if (status === 'loading' || !data) {
    return <div>Loading...</div> // Show a loading state while data is being fetched
  }
  if (error) {
    return <div>Failed to load data: {error.message}</div>
  }
  // deconstruct data
  const {allRows, resCalcs, allPlannedRows } = data;
//console.log("tbResCalcs2 ", resCalcs);

  return (
    <div>
      <div className="container mx-auto p-4">

<ResourceUsageChart data={resCalcs} fieldName="tbName" fieldLabel="Resource Name" />
<ResourceUsageChart data={resCalcs} fieldName="tbL2" fieldLabel="Project (L2)"/>
<ResourceUsageChart data={resCalcs} fieldName="tbMDPrimaryRole" fieldLabel="Resource Role" />
<ResourceUsageChart data={resCalcs} fieldName="tbMDPrimarySkill" fieldLabel="Primary Skill"/>

<ResourceUsageChart data={resCalcs} fieldName="tbMDLocation" fieldLabel="Resource Location" />
<ResourceUsageChart data={resCalcs} fieldName="tbMDDepartment" fieldLabel="Department" />


      </div>
    </div>
  )
}

export default ResourceChartDataComponent
