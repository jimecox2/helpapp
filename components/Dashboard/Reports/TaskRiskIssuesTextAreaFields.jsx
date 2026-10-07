import React from 'react';

const TaskRiskIssuesTextAreaFields = ({ data }) => (
  <div className="mb-8">
    <div className="mb-4">
      <p className="font-semibold text-gray-700">Description:</p>
      <p className="text-gray-600">{data.tbMDDescription}</p>
    </div>
    <div className="mb-4">
      <p className="font-semibold text-gray-700">Notes:</p>
      <p className="text-gray-600">{data.tbMDNotes}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Background Information:</p>
      <p className="text-gray-600">{data.tbMDBackgroundInfo}</p>
    </div>
  </div>
);

export default TaskRiskIssuesTextAreaFields;