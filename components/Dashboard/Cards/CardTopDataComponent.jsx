
//components/Dashboard/Cards/CardTopDataComponent.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronRight } from 'lucide-react';
import CollapsibleCardLights from '@/components/Dashboard/Cards/CollapsibleCardLights'
import TabsBelowCardsComponent from '@/components/Dashboard/Cards/TabsBelowCardsComponent'

import useSWR from 'swr'
import { fetchDataWithToken, filterL4Data, filterL3AndL4Data } from '@/lib/crud/pubsetDataFetcher'


const CardTopDataComponent = () => {

  const [projid, setProjid] = useState(null)
  const [subprojid, setSubprojid] = useState(null)
  const [l4Id, setL4Id] = useState(null)
  const [tbL2, settbL2] = useState(null)

  const { data: session, status } = useSession()

  let currrentUser = null
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
  let { allRows, allPlannedRows, pfRows, pjRows, workPackageRows, wpL4Rows, pjL3And4Rows, pfRowsPlanned, pjRowsPlanned, workPackageRowsPlanned } = data;
  let { l4Tasks, l4Risks, l4Issues } = filterL4Data(wpL4Rows, l4Id);
  let { l3L4Tasks, l3L4Risks, l3L4Issues } = filterL3AndL4Data(pjL3And4Rows, tbL2);

  pfRows // this is all pf rows already, no filtering needed
  pjRows = pjRows.filter(row => (row.tbSelfKey2 === projid))
  workPackageRows = workPackageRows.filter(row => (row.tbSelfKey2 === subprojid))
  wpL4Rows = wpL4Rows.filter(row => (row.tbSelfKey2 === l4Id))
  let tasksRisksIssuesForProject = pjL3And4Rows.filter(row => (row.tbL2 === tbL2))

  //console.log("tasksRisksIssuesForProject ", tasksRisksIssuesForProject);
  //console.log("all rows ", allRows);

  // card click events
  const handleClickOnPfCard = (id, tbL2 = null) => {
    setProjid(id);
    if (tbL2 !== null) {
      settbL2(tbL2);
    }
  };
  const handleClickOnPjCard = (id, tbL2 = null) => {
    setSubprojid(id);
    if (tbL2 !== null) {
      settbL2(tbL2);
    }
  };
  const handleClickOnWpCard = (id, tbL2 = null) => {
    setL4Id(id);
    if (tbL2 !== null) {
      settbL2(tbL2);
    }
  };

  // unhide the cards and components
  const handleHideProjid = () => setProjid(null);
  const handleHideSubprojid = () => setSubprojid(null);
  const handleHideL4Id = () => setL4Id(null);

  // console.log("tbL2", tbL2);
  //console.log("pjL3And4Rows", pjL3And4Rows);
  // console.log("l3L4Issues", l3L4Issues);

  return (
    <div className="p-5">
      <div className="overflow-hidden rounded-lg shadow-md">
        {/* Pf cards */}
        <div className="bg-gradient-to-r from-brown-100 to-brown-50 p-6">
          <h2 className="text-2xl font-semibold text-brown-800 mb-4">Level 1 - Portfolio</h2>
          <CollapsibleCardLights
            currentRows={pfRows}
            plannedRows={pfRowsPlanned}
            handleClickOnCard={handleClickOnPfCard}
            type="portfolio"
          />
        </div>
        {/* Project cards and l3 and l4 rows */}
        <div className="bg-gradient-to-r from-green-50 to-green-10 p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-green-800">Level 2 - Projects</h2>
            {projid !== null && (
              <button
                onClick={handleHideProjid}
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200 ml-5"
              >
                Hide cards
              </button>
            )}
          </div>

          {projid === null && (
            <div className="text-gray-600 italic mb-4">Level 2 Cards show here!</div>
          )}

          <CollapsibleCardLights
            currentRows={pjRows}
            plannedRows={pjRowsPlanned}
            handleClickOnCard={handleClickOnPjCard}
            type="project"
          />



          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-800 mb-1">Level 3 & 4 Tasks, Risks and Issues</h2>
            {subprojid !== null && (
              <button
                onClick={handleHideSubprojid}
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200 ml-5"
              >
                Hide Panel
              </button>
            )}
          </div>

          {workPackageRows.length ? (
            /* card path */
            <div>
              <div className="flex items-center space-x-2">
                <span className="py-2">Card Path: {workPackageRows[0].tbL1}</span>
                <ChevronRight className="h-5 w-5 text-green-500" />
                <span className="">{workPackageRows[0].tbL2}</span>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-10  p-2 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <TabsBelowCardsComponent tasks={l3L4Tasks} risks={l3L4Risks} issues={l3L4Issues} tasksRisksIssues={tasksRisksIssuesForProject} allPlannedRows={allPlannedRows} currrentUser={currrentUser} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 italic">
              To show the associated Project and Workpackage Risks, Issues and Tasks, click a Level 1 Card {" > "}   Level 2 Card!
            </div>
          )}
        </div>

        {/* WP cards and l4 rows */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-10 p-6">

          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-orange-800 mb-4">Level 3 - Work Packages</h2>
            {subprojid !== null && (
              <button
                onClick={handleHideSubprojid}
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200 ml-5"
              >
                Hide cards
              </button>
            )}
          </div>
          {subprojid === null && (
            <div className="text-gray-600 italic">Level 3 Cards show here!</div>
          )}
          <CollapsibleCardLights
            currentRows={workPackageRows}
            plannedRows={workPackageRowsPlanned}
            handleClickOnCard={handleClickOnWpCard}
            type="subproject"
          />

          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-800 mb-1">Level 4 - Tasks, Risks and Issues</h2>
            {subprojid !== null && (
              <button
                onClick={handleHideL4Id}
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200 ml-5"
              >
                Hide Panel
              </button>
            )}
          </div>
          {l4Id ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="py-2">Card Path: {workPackageRows[0].tbL1}</span>
                <ChevronRight className="h-5 w-5 text-green-500" />
                <span className="">{workPackageRows[0].tbL2}</span>
                <ChevronRight className="h-5 w-5 text-orange-500" />
                <span className="">{workPackageRows[0].tbL3}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-600 italic">
              To show the associated Project Risks, Issues and Tasks, click a Level 1 Card {" > "}   Level 2 Card {" > "} Level 3 Card!
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-10 p-6">
          {l4Id ? (
            <div className="space-y-4">
              <TabsBelowCardsComponent tasks={l4Tasks} risks={l4Risks} issues={l4Issues} tasksRisksIssues={wpL4Rows} allPlannedRows={allPlannedRows} currrentUser={currrentUser} />
            </div>
          ) : (
            <div className="text-gray-600 italic">

            </div>
          )}
        </div>
      </div>
    </div>

  )
}
export default CardTopDataComponent




/* 
<TabularFilteredLights childRows={childRows} childRowsPlanned={childRowsPlanned} />




*/
