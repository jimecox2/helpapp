import React from 'react';

const TaskRiskIssuesFieldsRiskMgmt = ({ data }) => (
  <>
    <h3 className="text-2xl font-bold text-gray-700 mt-5">Risk Management Data</h3>

    <div className="grid grid-cols-3 gap-4 mb-8">
      <div>
        <p className="font-semibold text-gray-700">Probability:</p>
        <p className="text-gray-600">${data.tbMDProbability}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-700">Impact:</p>
        <p className="text-gray-600">${data.tbMDImpact}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-700">Score:</p>
        <p className="text-gray-600">${data.tbMDScore}</p>
      </div>
      {data.tbMDMitigationStatus && (
        <div>
          <p className="font-semibold text-gray-700">Mitigation Status</p>
          <p className="text-gray-600">{data.tbMDMitigationStatus}</p>
        </div>
      )}

      {data.tbMDEscalationLevel && (
        <div>
          <p className="font-semibold text-gray-700">Escalation Level</p>
          <p className="text-gray-600">{data.tbMDEscalationLevel}</p>
        </div>
      )}

      {data.tbMDTriggerEvent && (
        <div>
          <p className="font-semibold text-gray-700">Trigger Event</p>
          <p className="text-gray-600">{data.tbMDTriggerEvent}</p>
        </div>
      )}

      {data.tbMDEarlyWarningIndicators && (
        <div>
          <p className="font-semibold text-gray-700">Early Warning Indicators</p>
          <p className="text-gray-600">{data.tbMDEarlyWarningIndicators}</p>
        </div>
      )}
    </div>
    {/* single column */}
    {data.tbMDMitigationPlan && (

      <div className="col-span-2">
        <p className="font-semibold text-gray-700">Mitigation Plan</p>
        <p className="text-gray-600">{data.tbMDMitigationPlan}</p>
      </div>

    )}
    {data.tbMDContingencyPlan && (
      <div className="col-span-2">
        <p className="font-semibold text-gray-700">Contingency Plan</p>
        <p className="text-gray-600">{data.tbMDContingencyPlan}</p>
      </div>

    )}
    {data.tbMDRiskResponseStrategy && (
      <div className="col-span-2">
        <p className="font-semibold text-gray-700">Risk Response Strategy</p>
        <p className="text-gray-600">{data.tbMDRiskResponseStrategy}</p>
      </div>
    )}




  </>
);

export default TaskRiskIssuesFieldsRiskMgmt;