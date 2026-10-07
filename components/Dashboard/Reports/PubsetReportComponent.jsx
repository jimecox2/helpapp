// components/Dashboard/Reports/PubsetReportComponent.jsx
'use client'
import ItemDetailsDataTable from '@/components/Dashboard/Reports/ItemDetailsDataTable'

const PubsetReportComponent = ({ data, token, userEmail }) => {
  // Check if data is already parsed (object/array) or needs parsing (string)
  let pubsetData = [];

  console.log('PubsetReportComponent received data:', {
    type: typeof data,
    isArray: Array.isArray(data),
    isNull: data === null,
    length: data?.length,
    firstItem: Array.isArray(data) ? data[0] : null
  });

  if (!data) {
    pubsetData = [];
  } else if (typeof data === 'string') {
    // Data is a JSON string, parse it
    try {
      pubsetData = JSON.parse(data);
      console.log('Successfully parsed JSON string, got', pubsetData.length, 'items');
    } catch (error) {
      console.error('Error parsing pubset data:', error);
      pubsetData = [];
    }
  } else if (Array.isArray(data)) {
    // Data is already an array
    pubsetData = data;
    console.log('Data is already an array with', pubsetData.length, 'items');
  } else {
    // Data is some other type
    console.error('Unexpected data type:', typeof data, data);
    pubsetData = [];
  }

  return (
    <div>
      <ItemDetailsDataTable
        data={pubsetData}
        allPlannedRows={[]}
        currrentUser={null}
        token={token}
        userEmail={userEmail}
        reportType="pubset"
      />
    </div>
  )
}

export default PubsetReportComponent
