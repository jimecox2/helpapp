// components/Dashboard/Reports/ItemDetailsDialogNew.jsx
'use client'
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from '@/lib/helpers/customfunctions';
import CostHoursStatusFields from '@/components/Dashboard/Common/CostHoursStatusFields'
import AllFieldsMetaDataBySection from '@/components/Dashboard/Common/AllFieldsMetaDataBySection';
import FieldsNoNullsMetaData from '@/components/Dashboard/Common/FieldsNoNullsMetaData';
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"; // Import Shadcn UI Checkbox component
import { Button } from "@/components/ui/button"; // Import Shadcn UI Button component




const ItemDetailsDialogNew = ({ isOpen, onOpenChange, data, topPicURL, imageSize, imagePosition, currrentUser, allPlannedRows }) => {
  const [showAllFields, setShowAllFields] = useState(false);

  const handleCheckboxChange = () => {
    setShowAllFields(!showAllFields);
  };

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <div className="flex gap-2">
              <div style={imageContainerStyle}>
                <img src={topPicURL} alt="Logo" style={imageStyle} />
              </div>
              {data.tbType} Summary Report
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="max-w-3xl mx-auto border-4 border-[#007BFF] bg-white p-6">

            <FieldsNoNullsMetaData data={data} allPlannedRows={allPlannedRows}/>

            {/* Checkbox to show all fields */}
            <div className="mt-4 flex items-center gap-2">
              <Checkbox id="show-all-fields" checked={showAllFields} onCheckedChange={handleCheckboxChange} />
              <label htmlFor="show-all-fields" className="text-sm font-medium text-gray-700">
                Show all fields
              </label>
            </div>

            {/* Render AllFieldsMetaDataBySection conditionally */}
            {showAllFields && (
              <div className="mt-4">
                <AllFieldsMetaDataBySection data={data} />
                {/* Button to hide all fields */}
                <Button variant="outline" onClick={() => setShowAllFields(false)} className="mt-4">
                  Hide all fields
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialogNew;

/* 


            <TaskRiskIssuesHeaderFields data={data} formattedToday={formattedToday} currrentUser={currrentUser} />
            <TaskRiskIssuesCommonFields data={data} />
            <TaskRiskIssuesTextAreaFields data={data} />
            <TaskRiskIssuesImpactFields data={data} />
            <TaskRiskIssuesFieldsRiskMgmt data={data} />
            <h3 className="text-2xl font-bold text-gray-700 mt-5">Cost Schedule Status</h3>
            <CostHoursStatusFields currentRow={data} plannedRows={allPlannedRows} />
*/