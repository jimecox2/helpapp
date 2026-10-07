'use client'
import { formatDate } from '@/lib/helpers/customfunctions';
import { useSession } from 'next-auth/react'

const AllFieldsMetaDataBySection = ({ data }) => {

  const { data: session, status } = useSession()
  let currrentUser = null
  if (status === 'loading') {
    return <p>AllFieldsMetaDataBySection Loading...</p>
  }

  if (status === 'authenticated') {
    const userEmail = session.user.email
    const jwt = session.user.strapiToken // Assuming you've added this in the session
    currrentUser = session.user.name

  }

  const formattedToday = formatDate(new Date());

  return (
    <div className="space-y-8">

{/* Report Header Section */}
      <div className="text-center mb-8">
        {/* determins timebar type, show heading appropriatly */}
        <h1 className="text-2xl font-bold text-gray-700">
          {data.tbType === 'Portfolio' && data.tbL1 && data.tbL1.toLowerCase() !== 'na' && data.tbL1.toLowerCase() !== 'n/a' && (
            <>
              Portfolio: {data.tbL1}
            </>
          )}
          {data.tbType === 'Project' && data.tbL1 && data.tbL1.toLowerCase() !== 'na' && data.tbL1.toLowerCase() !== 'n/a' && (
            <>
              Portfolio: {data.tbL1} <br />
              Project: {data.tbL2}
            </>
          )}
          {data.tbType === 'Sub-Project' && (
            <>
              {data.tbL1 && data.tbL1.toLowerCase() !== 'na' && data.tbL1.toLowerCase() !== 'n/a' && (
                <>
                  Portfolio: {data.tbL1} <br />
                </>
              )}
              {data.tbL2 && data.tbL2.toLowerCase() !== 'na' && data.tbL2.toLowerCase() !== 'n/a' && (
                <>
                  Project: {data.tbL2} <br />
                </>
              )}
              {data.tbL3 && data.tbL3.toLowerCase() !== 'na' && data.tbL3.toLowerCase() !== 'n/a' && (
                <>
                  Sub-Project: {data.tbL3}
                </>
              )}
            </>
          )}
        </h1>
        <p className="text-sm text-gray-500">Author: <span className="font-medium">{currrentUser}</span></p>
        <p className="text-sm text-gray-500">Report Date: <span className="font-medium">{formattedToday}</span></p>
      </div>

      {/* Description Notes Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="font-semibold text-gray-700">ID</p>
          <p className="text-gray-600">{data.tbID}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Name</p>
          <p className="text-gray-600">{data.tbName}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Short Name </p>
          <p className="text-gray-600">{data.tbMDNameShort}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Timebar Type</p>
          <p className="text-gray-600">{data.tbType}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Status</p>
          <p className="text-gray-600">{data.tbMDStatus}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Overall Health</p>
          <p className="text-gray-600">{data.tbMDHealth}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Priority</p>
          <p className="text-gray-600">{data.tbMDPriority}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Severity</p>
          <p className="text-gray-600">{data.tbMDSeverity}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Category</p>
          <p className="text-gray-600">{data.tbMDCategory}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Project Number</p>
          <p className="text-gray-600">{data.tbMDProjectNumber}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold text-gray-700">Executive Summary</p>
          <p className="text-gray-600">{data.tbMDExecutiveSummary}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold text-gray-700">Description</p>
          <p className="text-gray-600">{data.tbMDDescription}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold text-gray-700">Project Notes</p>
          <p className="text-gray-600">{data.tbMDNotesProject}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Other Notes</p>
          <p className="text-gray-600">{data.tbMDNotes}</p>
        </div>
      </div>


      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Common Metadata</p>
      </div>
      {/* Common Metadata Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">

          <div>
            <p className="font-semibold text-gray-700">Owner</p>
            <p className="text-gray-600">{data.tbOwner}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Responsible Team</p>
            <p className="text-gray-600">{data.tbMDResponsibleTeam}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Responsible Person</p>
            <p className="text-gray-600">{data.tbMDResponsibility}</p>
          </div>
          <div>
          <p className="font-semibold text-gray-700">Ex Sponsor</p>
          <p className="text-gray-600">{data.tbMDExSponsor}</p>
        </div>
          <div>
            <p className="font-semibold text-gray-700">Product</p>
            <p className="text-gray-600">{data.tbMDProduct}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Contact</p>
            <p className="text-gray-600">{data.tbMDContact}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Project Type</p>
            <p className="text-gray-600">{data.tbMDProjectType}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">PM</p>
            <p className="text-gray-600">{data.tbMDPM}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Phase</p>
            <p className="text-gray-600">{data.tbMDPhase}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Department</p>
            <p className="text-gray-600">{data.tbMDDepartment}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Show In</p>
            <p className="text-gray-600">{data.tbMDShowIn}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Delivery Manager</p>
            <p className="text-gray-600">{data.tbMDDeliveryManager}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">State</p>
            <p className="text-gray-600">{data.tbMDState}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Stage</p>
            <p className="text-gray-600">{data.tbMDStage}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Stage Approver</p>
            <p className="text-gray-600">{data.tbMDStageApprover}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WBS</p>
            <p className="text-gray-600">{data.tbMDWBS}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WBS Description</p>
            <p className="text-gray-600">{data.tbWbsDescription}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Last Modified</p>
            <p className="text-gray-600">{data.tbMDtbLastModified}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Sprint Name</p>
            <p className="text-gray-600">{data.tbMDSprintName}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Sort Order</p>
            <p className="text-gray-600">{data.tbMDSortOrder}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Yes No Selector</p>
            <p className="text-gray-600">{data.tbMDYesNoSelector}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Weighting</p>
            <p className="text-gray-600">{data.tbMDWeighting}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Program</p>
            <p className="text-gray-600">{data.tbMDProgram}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Gate</p>
            <p className="text-gray-600">{data.tbMDGate}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Contract Number</p>
            <p className="text-gray-600">{data.tbMDContractNumber}</p>
          </div>

        </div>
      </div>


      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Health</p>
      </div>
      {/* Progress and Health Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-semibold text-gray-700">Health Overall</p>
            <p className="text-gray-600">{data.tbMDHealthOverall}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Health Cost</p>
            <p className="text-gray-600">{data.tbMDHealthCost}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Health Risk</p>
            <p className="text-gray-600">{data.tbMDHealthRisk}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Health Schedule</p>
            <p className="text-gray-600">{data.tbMDHealthSchedule}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Health Scope</p>
            <p className="text-gray-600">{data.tbMDHealthScope}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Health Issues</p>
            <p className="text-gray-600">{data.tbMDHealthIssues}</p>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Hierarchy</p>
      </div>
      {/* Hierarchy Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-semibold text-gray-700">Hierarchy No.</p>
            <p className="text-gray-600">{data.tbHierarchyOrder}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Level 1</p>
            <p className="text-gray-600">{data.tbL1}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Level 2</p>
            <p className="text-gray-600">{data.tbL2}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Level 3</p>
            <p className="text-gray-600">{data.tbL3}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Level 4</p>
            <p className="text-gray-600">{data.tbL4}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Level 5</p>
            <p className="text-gray-600">{data.tbL5}</p>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Business Case</p>
      </div>

      {/* Business Case Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
            <p className="font-semibold text-gray-700">Written By</p>
            <p className="text-gray-600">{data.tbMDWrittenBy}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Contact Number</p>
            <p className="text-gray-600">{data.tbMDContactNumber}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Senior Level Commitment</p>
            <p className="text-gray-600">{data.tbMDSeniorLevelCommittment}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Stakeholder Description</p>
            <p className="text-gray-600">{data.tbMDStakeholderDescription}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Problem Opportunity</p>
            <p className="text-gray-600">{data.tbMDProblemOpportunity}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Background Info</p>
            <p className="text-gray-600">{data.tbMDBackgroundInfo}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Expected Benefits</p>
            <p className="text-gray-600">{data.tbMDExpectedBenefits}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Consequence</p>
            <p className="text-gray-600">{data.tbMDConsequence}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Capabilities Needed</p>
            <p className="text-gray-600">{data.tbMDCapabilitiesNeeded}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Constraints Assumptions</p>
            <p className="text-gray-600">{data.tbMDConstraintsAssumptions}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Cost Benefit Analysis</p>
            <p className="text-gray-600">{data.tbMDCostBenefitAnalysis}</p>
          </div>
        </div>
      </div>


      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Estimates</p>
      </div>
      {/* Estimates Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-semibold text-gray-700">Size</p>
            <p className="text-gray-600">{data.tbMDSize}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Estimation Class</p>
            <p className="text-gray-600">{data.tbMDEstimationClass}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Sunk Costs</p>
            <p className="text-gray-600">{data.tbMDSunkCosts}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Risk Vs Size And Complexity</p>
            <p className="text-gray-600">{data.tbMDRiskVsSizeAndComplexity}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">ROM Estimate</p>
            <p className="text-gray-600">{data.tbMDROMEstimate}</p>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Investment</p>
      </div>

      {/* Investment Plan Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-semibold text-gray-700">Portfolio</p>
            <p className="text-gray-600">{data.tbMDPortfolio}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Business Owner</p>
            <p className="text-gray-600">{data.tbMDBusinessOwner}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Primary Line Of Business</p>
            <p className="text-gray-600">{data.tbMDPrimaryLineOfBusiness}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Sponsoring Department</p>
            <p className="text-gray-600">{data.tbMDSponsoringDepartment}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Investment Objective</p>
            <p className="text-gray-600">{data.tbMDInvestmentObjective}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Investment Strategy</p>
            <p className="text-gray-600">{data.tbMDInvestmentStrategy}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Investment Initiative</p>
            <p className="text-gray-600">{data.tbMDInvestmentInitiative}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Priority Strategic</p>
            <p className="text-gray-600">{data.tbMDPriorityStrategic}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Investment Category</p>
            <p className="text-gray-600">{data.tbMDInvestmentCategory}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Business Advisor</p>
            <p className="text-gray-600">{data.tbMDBusinessAdvisor}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Primary Contact</p>
            <p className="text-gray-600">{data.tbMDPrimaryContact}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Net Present Value</p>
            <p className="text-gray-600">{data.tbMDNetPresentValue}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Opportunity Cost</p>
            <p className="text-gray-600">{data.tbMDOpportunityCost}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Payback Period</p>
            <p className="text-gray-600">{data.tbMDPaybackPeriod}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Internal Rate Of Return</p>
            <p className="text-gray-600">{data.tbMDInternalRateOfReturn}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Economic Value Added</p>
            <p className="text-gray-600">{data.tbMDEcnomicValueAdded}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Benefit Cost Ratio</p>
            <p className="text-gray-600">{data.tbMDBenefitCostRatio}</p>
          </div>
        </div>
      </div>



      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">Workflow</p>
      </div>
      {/* Workflow Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">


          <div>
            <p className="font-semibold text-gray-700">Wf Notes</p>
            <p className="text-gray-600">{data.tbMDNotesWorkflow}</p>
          </div>


          <div>
            <p className="font-semibold text-gray-700">WF Stage</p>
            <p className="text-gray-600">{data.tbStage}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF State</p>
            <p className="text-gray-600">{data.tbState}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF Step</p>
            <p className="text-gray-600">{data.tbStep}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF Step Status</p>
            <p className="text-gray-600">{data.tbStepStatus}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF Reason Note</p>
            <p className="text-gray-600">{data.tbWfReasonNote}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF Status</p>
            <p className="text-gray-600">{data.tbStatus}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">WF Priority</p>
            <p className="text-gray-600">{data.tbPriority}</p>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-4xl font-bold text-gray-700">System Metadata</p>
      </div>


      {/* System MD Section */}
      <div>
        <div className="grid grid-cols-2 gap-4 mb-8">


          <div>
            <p className="font-semibold text-gray-700">Customer ID</p>
            <p className="text-gray-600">{data.tbMDCustomerID}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Azure ID</p>
            <p className="text-gray-600">{data.tbMDAzureID}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Ext System ID1</p>
            <p className="text-gray-600">{data.tbMDExtSystemID1}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Reference ID</p>
            <p className="text-gray-600">{data.tbMDRefID}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Sync Notes</p>
            <p className="text-gray-600">{data.tbMDSyncNotes}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Other 2</p>
            <p className="text-gray-600">{data.tbMDOther2}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Other 3</p>
            <p className="text-gray-600">{data.tbMDOther3}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFieldsMetaDataBySection;