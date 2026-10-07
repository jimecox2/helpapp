//components/Dashboard/Reports/TasksRisksIssuesDialog.jsx
'use client'
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from '@/lib/helpers/customfunctions';
import CostHoursStatusFields from '@/components/Dashboard/Common/CostHoursStatusFields'
import TaskRiskIssuesHeaderFields from '@/components/Dashboard/Reports/TaskRiskIssuesHeaderFields';
import TaskRiskIssuesCommonFields from '@/components/Dashboard/Reports/TaskRiskIssuesCommonFields';
import TaskRiskIssuesTextAreaFields from '@/components/Dashboard/Reports/TaskRiskIssuesTextAreaFields';
import TaskRiskIssuesImpactFields from '@/components/Dashboard/Reports/TaskRiskIssuesImpactFields';
import TaskRiskIssuesFieldsRiskMgmt from '@/components/Dashboard/Reports/TaskRiskIssuesFieldsRiskMgmt';
import { useSession } from 'next-auth/react'

const TasksRisksIssuesDialog = ({ isOpen, onOpenChange, data, topPicURL, imageSize, imagePosition, allPlannedRows}) => {
  const { data: session, status } = useSession()
  let currrentUser = null
  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'authenticated') {
    const userEmail = session.user.email
    const jwt = session.user.strapiToken // Assuming you've added this in the session
    currrentUser = session.user.name

  }

  const imageStyle = {
    width: imageSize?.width || 'auto',
    height: imageSize?.height || 'auto',
    maxWidth: '100%',
    maxHeight: '100px',
  };

  const imageContainerStyle = {
    display: 'flex',
    justifyContent: imagePosition === 'left' ? 'flex-start' :
      imagePosition === 'right' ? 'flex-end' : 'center',
    marginBottom: '1rem',
  };

  const formattedToday = formatDate(new Date());
  //console.log(" ", data);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80%] h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <div className="flex gap-2">
              <div style={imageContainerStyle}>
                <img
                  src={topPicURL}
                  alt="Logo"
                  style={imageStyle}
                />
              </div>
              Task, Risk or Issue Detail Report
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="max-w-3xl mx-auto border-4 border-[#007BFF] bg-white p-6">
            <TaskRiskIssuesHeaderFields data={data} formattedToday={formattedToday} currrentUser={currrentUser} />
            <TaskRiskIssuesCommonFields data={data} />
            <TaskRiskIssuesTextAreaFields data={data} />
            <TaskRiskIssuesImpactFields data={data} />

            {data.tbSubType === "Risk" ? (
            <TaskRiskIssuesFieldsRiskMgmt data={data} />
          ) : null}

            {data.tbType === "Sub-Project" ? (
              <div>
                <h3 className="text-2xl font-bold text-gray-700 mt-5">Cost Schedule Status</h3>
                <CostHoursStatusFields currentRow={data} plannedRows={allPlannedRows} />
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TasksRisksIssuesDialog;