// components/Dashboard/Charts/ResourceCostUsageDataComponent.jsx
'use client'
import { useSession } from 'next-auth/react'
import DashboardHero from "@/components/Dashboard/Common/DashboardHero.jsx"
import { FRONTEND_URL } from '@/config/site'
import useSWR from 'swr'
import { fetchDataWithToken, filterL4Data, filterL3AndL4Data } from '@/lib/crud/pubsetDataFetcher'
import ResourceCostUsagePie from '@/components/Dashboard/Charts/ResourceCostUsagePie'
import IndicatorCards from '@/components/Dashboard/Cards/IndicatorCards'

const ResourceCostUsageDataComponent = () => {
  // auth
  const { data: session, status } = useSession()
  
  // get pubset data
  const fetcher = async () => {
    if (session && status === 'authenticated') {
      return await fetchDataWithToken(session)
    }
    return null;
  }

  const { data, error } = useSWR(status === 'authenticated' ? 'fetchData' : null, fetcher)

  if (status === 'loading' || !data) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Failed to load data: {error.message}</div>
  }

  // Make sure resCalcs exists and is an array
  const { resCalcs = [] } = data;
  
  // Only process if resCalcs is available and not empty
  if (!resCalcs || !Array.isArray(resCalcs) || resCalcs.length === 0) {
    return <div>No data available</div>;
  }

  const processedRows = (() => {
    try {
      // Create an object to store unique values and their totals
      const fieldTotals = {
        tbL2: { label: 'Project', values: {} },
        tbName: { label: 'Resource Name', values: {} },
        tbMDLocation: { label: 'Location', values: {} },
        tbMDDepartment: { label: 'Department', values: {} },
        tbMDPrimaryRole: { label: 'Role', values: {} },
        tbMDPrimarySkill: { label: 'Skill', values: {} }
      };
  
      // Calculate totals for each unique value in each field
      resCalcs.forEach(row => {
        Object.keys(fieldTotals).forEach(fieldName => {
          const value = row[fieldName];
          if (!fieldTotals[fieldName].values[value]) {
            fieldTotals[fieldName].values[value] = {
              hours: 0,
              cost: 0
            };
          }
          fieldTotals[fieldName].values[value].hours += Number(row.tbResCalcHours) || 0;
          fieldTotals[fieldName].values[value].cost += Number(row.tbResCalcCost) || 0;
        });
      });
  
      // Convert to array format
      const results = [];
      Object.entries(fieldTotals).forEach(([fieldName, field]) => {
        Object.entries(field.values).forEach(([fieldValue, totals]) => {
          // Add hours entry
          results.push({
            value: Math.round(totals.hours),
            unit: 'Hours',
            label: field.label,
            fieldName: fieldName,
            fieldValue: fieldValue
          });
          
          // Add cost entry
          results.push({
            value: Math.round(totals.cost),
            unit: 'Cost',
            label: field.label,
            fieldName: fieldName,
            fieldValue: fieldValue
          });
        });
      });
  
      // Sort by value in descending order within each field and unit type
      return results.sort((a, b) => {
        if (a.fieldName === b.fieldName) {
          if (a.unit === b.unit) {
            return b.value - a.value;
          }
          return a.unit.localeCompare(b.unit);
        }
        return a.fieldName.localeCompare(b.fieldName);
      });
  
    } catch (err) {
      console.error('Error processing rows:', err);
      return [];
    }
  })();

  const costOnlyRows = processedRows?.filter(row => row.unit === 'Cost') || [];

  // Debug logging
 // console.log('resCalcs:', resCalcs);
 // console.log('processedRows:', costOnlyRows);

  return (
    <div>

        <IndicatorCards currentRows={costOnlyRows} />


      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <ResourceCostUsagePie 
              data={resCalcs} 
              fieldName="tbL2" 
              fieldLabel="Project (L2)"
            />
          </div>
          <div className="w-full">
            <ResourceCostUsagePie 
              data={resCalcs} 
              fieldName="tbMDPrimaryRole" 
              fieldLabel="Resource Role"
            />
          </div>
          <div className="w-full">
            <ResourceCostUsagePie 
              data={resCalcs} 
              fieldName="tbMDLocation" 
              fieldLabel="Resource Location"
            />
          </div>
          <div className="w-full">
            <ResourceCostUsagePie 
              data={resCalcs} 
              fieldName="tbMDDepartment" 
              fieldLabel="Department"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceCostUsageDataComponent;