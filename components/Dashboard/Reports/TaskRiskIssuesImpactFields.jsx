import React from 'react';

const TaskRiskIssuesImpactFields = ({ data }) => (
  <>
    <h3 className="text-2xl font-bold text-gray-700 mt-5">Assessment</h3>

    <div className="grid grid-cols-3 gap-4 mb-8">


      <div>
        <p className="font-semibold text-gray-700">Estimated Cost:</p>
        <p className="text-gray-600">${data.tbCost}</p>
      </div>

      <div>
        <p className="font-semibold text-gray-700">Estimated Completion Date:</p>
        <p className="text-gray-600">{data.tbFinish}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-700">Priority:</p>
        <p className="text-gray-600">{data.tbMDPriority}</p>
      </div>
      {data.tbMDSize && (
        <div>
          <p className="font-semibold text-gray-700">Size</p>
          <p className="text-gray-600">{data.tbMDSize}</p>
        </div>
      )}

      {data.tbMDSeverity && (
        <div>
          <p className="font-semibold text-gray-700">Severity</p>
          <p className="text-gray-600">{data.tbMDSeverity}</p>
        </div>
      )}
    </div>



  </>
);

export default TaskRiskIssuesImpactFields;