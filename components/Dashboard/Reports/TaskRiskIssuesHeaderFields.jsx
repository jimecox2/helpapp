import React from 'react';

const TaskRiskIssuesHeaderFields = ({ data, formattedToday, currrentUser }) => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold text-gray-700">{data.tbSubType}: {data.tbName}</h1>
    <p className="text-sm text-gray-500">Report Date: <span className="font-medium">{formattedToday}</span></p>
    <p className="text-sm text-gray-500">Owner: <span className="font-medium">{data.tbOwner}</span></p>
    <p className="text-sm text-gray-500">Report Author: <span className="font-medium">{currrentUser}</span></p>
    <h1 className="text-2xl font-bold text-gray-700">Project: {data.tbL2}</h1>
  </div>
);

export default TaskRiskIssuesHeaderFields;