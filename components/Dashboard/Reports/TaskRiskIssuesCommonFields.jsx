import React from 'react';

const TaskRiskIssuesCommonFields = ({ data }) => (
  <div className="grid grid-cols-3 gap-4 mb-8">
    <div>
      <p className="font-semibold text-gray-700">ID</p>
      <p className="text-gray-600">{data.tbID}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Status:</p>
      <p className="text-gray-600">{data.tbStatus}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Category:</p>
      <p className="text-gray-600">{data.tbMDCategory}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Owner:</p>
      <p className="text-gray-600">{data.tbOwner}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Date Created:</p>
      <p className="text-gray-600">{data.tbStart}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Last Updated:</p>
      <p className="text-gray-600">{data.tbMDtbLastModified}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Department:</p>
      <p className="text-gray-600">{data.tbMDDepartment}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Primary Line of Business:</p>
      <p className="text-gray-600">{data.tbMDPrimaryLineOfBusiness}</p>
    </div>
    <div>
      <p className="font-semibold text-gray-700">Product:</p>
      <p className="text-gray-600">{data.tbMDProduct}</p>
    </div>
  </div>
);

export default TaskRiskIssuesCommonFields;