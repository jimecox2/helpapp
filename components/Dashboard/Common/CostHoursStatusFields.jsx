'use client'
import React from 'react';
import moment from 'moment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CostHoursStatusFields = ({ currentRow, plannedRows }) => {

  const router = useRouter();

  useEffect(() => {
    if (!currentRow) {
      throw new Error("No data available. Have you published valid data from the Timebars Client.");
    }
  }, [currentRow]);


  // get the baseline prefix on the tbID so we can filter a matching baseline row
  let blPrefix
  let plannedRow = []
  if (plannedRows && plannedRows.length > 0) {
    // Get the first row of the dataset
    const firstRow = plannedRows[0];
  
    // Check if tbID exists in the first row
    if (firstRow.tbID) {
      // Split the tbID string by ':' and take the first part
      const [prefix] = firstRow.tbID.split(':');
      // Store the result in a variable
      blPrefix = prefix;
     // console.log('Extracted prefix:', blPrefix);
      plannedRow = plannedRows.filter(row => row.tbID === (blPrefix + ":" + currentRow.tbID))
     plannedRow = plannedRow[0]
    // console.log("plannedRow ", plannedRow)
    } else {
      console.log('tbID not found in the first row');
      plannedRow = []
    }
  } else {
    console.log('Dataset is empty');
    plannedRow = []
  }



  // set delta calcs
  const calculateDelta = (planned, forecast) => {
    const plannedValue = Number(planned);
    const forecastValue = Number(forecast);

    if (isNaN(plannedValue) || isNaN(forecastValue)) {
      return null;
    }

    return plannedValue - forecastValue;
  };

  const formatDelta = (delta, format = 'number') => {
    if (delta === null) {
      return <span className="text-gray-400">N/A</span>;
    }

    let formattedValue;
    switch (format) {
      case 'currency':
        formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(delta);
        break;
      case 'percentage':
        formattedValue = `${Math.round(delta)}%`;
        break;
      default:
        formattedValue = delta.toFixed(2);
    }

    return (
      <span className={delta < 0 ? 'text-red-600' : 'text-green-600'}>
        {formattedValue}
      </span>
    );
  };

  const calculateDateDelta = (planned, forecast) => {
    const plannedDate = new Date(planned);
    const forecastDate = new Date(forecast);

    if (isNaN(plannedDate.getTime()) || isNaN(forecastDate.getTime())) {
      return <span className="text-gray-400">N/A</span>;
    }

    const delta = moment(plannedDate).diff(moment(forecastDate), 'days');
    return (
      <span className={delta < 0 ? 'text-red-600' : 'text-green-600'}>
        {delta}
      </span>
    );
  };
  /* bg-gradient-to-r from-blue-800 to-blue-500 text-white */
  return (

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
                <TableHead className="w-[100px] text-white"></TableHead>
                <TableHead className="text-white">Start</TableHead>
                <TableHead className="text-white">Finish</TableHead>
                <TableHead className="text-white">Dur.</TableHead>
                <TableHead className="text-white">Dur Rem</TableHead>
                <TableHead className="text-white">Cost</TableHead>
                <TableHead className="text-white">Cost Rem</TableHead>
                <TableHead className="text-white">Hours</TableHead>
                <TableHead className="text-white">Hours Rem</TableHead>
                <TableHead className="text-white">% Compl.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-gray-50">
                <TableCell className="font-medium">Planned</TableCell>
                <TableCell>{plannedRow?.tbStart ?? 'N/A'}</TableCell>
                <TableCell>{plannedRow?.tbFinish ?? 'N/A'}</TableCell>
                <TableCell>{Number(plannedRow?.tbDuration ?? 0).toFixed(1)}</TableCell>
                <TableCell>{Number(plannedRow?.tbRemainingDuration ?? 0).toFixed(1)}</TableCell>
                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plannedRow?.tbCost ?? 0)}</TableCell>
                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plannedRow?.tbCostRemaining ?? 0)}</TableCell>
                <TableCell>{Number(plannedRow?.tbWork ?? 0).toFixed(2)}</TableCell>
                <TableCell>{Number(plannedRow?.tbWorkRemaining ?? 0).toFixed(2)}</TableCell>
                <TableCell>{Math.round(plannedRow?.tbPercentComplete ?? 0)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Forecast</TableCell>
                <TableCell>{currentRow.tbStart}</TableCell>
                <TableCell>{currentRow.tbFinish}</TableCell>
                <TableCell>{Number(currentRow.tbDuration).toFixed(1)}</TableCell>
                <TableCell>{Number(currentRow.tbRemainingDuration).toFixed(1)}</TableCell>
                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentRow.tbCost)}</TableCell>
                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentRow.tbCostRemaining)}</TableCell>
                <TableCell>{Number(currentRow.tbWork).toFixed(2)}</TableCell>
                <TableCell>{Number(currentRow.tbWorkRemaining).toFixed(2)}</TableCell>
                <TableCell>{Math.round(currentRow.tbPercentComplete)}%</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="font-medium">Actual</TableCell>
                <TableCell>{currentRow.tbAStart}</TableCell>
                <TableCell>{currentRow.tbAFinish}</TableCell>
                <TableCell>{Number(currentRow.tbDuration - currentRow.tbRemainingDuration).toFixed(1)}</TableCell>
                <TableCell></TableCell>
                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentRow.tbACost)}</TableCell>
                <TableCell></TableCell>
                <TableCell>{Number(currentRow.tbAWork).toFixed(2)}</TableCell>
                <TableCell></TableCell>
                <TableCell>{Math.round(currentRow.tbPercentComplete)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Delta</TableCell>
                <TableCell>{calculateDateDelta(plannedRow?.tbStart, currentRow?.tbStart)}</TableCell>
                <TableCell>{calculateDateDelta(plannedRow?.tbFinish, currentRow?.tbFinish)}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbDuration, currentRow?.tbDuration))}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbRemainingDuration, currentRow?.tbRemainingDuration))}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbCost, currentRow?.tbCost), 'currency')}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbCostRemaining, currentRow?.tbCostRemaining), 'currency')}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbWork, currentRow?.tbWork))}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbWorkRemaining, currentRow?.tbWorkRemaining))}</TableCell>
                <TableCell>{formatDelta(calculateDelta(plannedRow?.tbPercentComplete, currentRow?.tbPercentComplete), 'percentage')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

        </div>

  );
};

export default CostHoursStatusFields;