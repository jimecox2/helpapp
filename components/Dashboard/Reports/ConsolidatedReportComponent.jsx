// components/Dashboard/Reports/ConsolidatedReportComponent.jsx
'use client'
import ItemDetailsDataTable from '@/components/Dashboard/Reports/ItemDetailsDataTable'

const ConsolidatedReportComponent = ({ data, pubsets, token, userEmail }) => {
  // Data is already merged and filtered on server
  const consolidatedData = Array.isArray(data) ? data : [];

  console.log('ConsolidatedReportComponent received:', {
    itemCount: consolidatedData.length,
    pubsetCount: pubsets.length,
    firstItem: consolidatedData[0] || null
  });

  return (
    <div>
      <ItemDetailsDataTable
        data={consolidatedData}
        allPlannedRows={[]}
        currrentUser={null}
        token={token}
        userEmail={userEmail}
        reportType="pubset"
      />
    </div>
  )
}

export default ConsolidatedReportComponent
