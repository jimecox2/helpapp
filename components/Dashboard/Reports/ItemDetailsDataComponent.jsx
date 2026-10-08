// components/Dashboard/ItemDetailsDataComponent.jsx
'use client'
import { useSession } from 'next-auth/react'
import ItemDetailsDataTable from '@/components/Dashboard/Reports/ItemDetailsDataTable'
import useSWR from 'swr'
import { fetchDataWithToken, filterL4Data, filterL3AndL4Data } from '@/lib/crud/pubsetDataFetcher'

const ItemDetailsDataComponent = ({token, reportType}) => {
    // auth
    let currrentUser = null
    let userEmail = null

  const { data: session, status } = useSession()
  //const { user: { name, email }, jwt } = session;
  if (status === 'authenticated') {
     currrentUser = session.user.name
     userEmail = session.user.email
  }

//console.log(" session: ", session)

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
  // deconstruct data from fetcher
  const { allRows, allPlannedRows, pfRows, pjRows, workPackageRows, wpL4Rows, pjL3And4Rows, pfRowsPlanned, pjRowsPlanned, workPackageRowsPlanned } = data;
  const { l4Tasks, l4Risks, l4Issues } = filterL4Data(wpL4Rows, null);
  const { l3L4Tasks, l3L4Risks, l3L4Issues } = filterL3AndL4Data(pjL3And4Rows, null);
  //console.log("all rows ", allRows);
  return (
    <div>
        <ItemDetailsDataTable data={allRows} allPlannedRows={allPlannedRows} currrentUser={currrentUser} token={token} userEmail={userEmail} reportType={reportType}></ItemDetailsDataTable>

    </div>
  )
}

export default ItemDetailsDataComponent
