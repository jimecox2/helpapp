// components/Dashboard/CommonFilteredLights.jsx
'use client'

import React from 'react';
import GreenYellowRedButtons from "./GreenYellowRedButtons";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link'

const TabularFilteredLights = ({ allRows }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'tbSelfKey2', headerName: 'Parent', width: 20 },
    { field: 'tbSubType', headerName: 'Type', width: 90 },
    { field: 'tbL2', headerName: 'Project', width: 90 },
    { field: 'tbL3', headerName: 'Work Package', width: 90 },
    { field: 'tbName', headerName: 'Name', width: 210 },
    { field: 'tbMDHealthOverall', headerName: 'Health Overall', width: 80 },
    { field: 'tbOwner', headerName: 'Owner', width: 80 },
    { field: 'tbStart', headerName: 'Start', width: 120 },
    { field: 'tbFinish', headerName: 'Finish', width: 120 },
    { field: 'tbAStart', headerName: 'A Start', width: 120 },
    { field: 'tbAFinish', headerName: 'A Finish', width: 120 },
    { field: 'tbDuration', headerName: 'Dur', width: 80 },
    { field: 'tbRemainingDuration', headerName: 'Rem Dur', width: 80 },
    { field: 'tbWork', headerName: 'Work', width: 80 },
    { field: 'tbAWork', headerName: 'Awork', width: 80 },
    { field: 'tbWorkRemaining', headerName: 'Rem Work', width: 80 },

  ];
/* Add this in to show all lignts in the table
    { field: 'tbMDHealthCost', headerName: 'Cost', width: 80 },
    { field: 'tbMDHealthSchedule', headerName: 'Schedule', width: 80 },
    { field: 'tbMDHealthRisk', headerName: 'Risk', width: 80 },
    { field: 'tbMDHealthScope', headerName: 'Scope', width: 80 },
    { field: 'tbMDHealthIssues', headerName: 'Issues', width: 80 },
*/
 //console.log("allRows ", allRows);

  return (
    <div className="overflow-x-auto">

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.field}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allRows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.field} className="px-6 py-4 whitespace-nowrap">
                  {/* changes starts with to tbMDHealth to show all  */}
                  {column.field.startsWith('tbMDHealthOverall') ? (
                    <GreenYellowRedButtons
                      buttonColor={row[column.field]}
                      execSummary={column.field === 'tbMDHealthOverall' ? row.tbMDExecutiveSummary : "see Overall column!"}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{row[column.field]}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabularFilteredLights;