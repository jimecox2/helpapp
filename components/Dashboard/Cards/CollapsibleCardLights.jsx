'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import CostHoursPopupComponent from "@/components/Dashboard/Common/CostHoursPopupComponent.jsx"

const getColumnCount = () => {
  if (window.innerWidth >= 1024) return 4; // large screens
  if (window.innerWidth >= 768) return 3; // medium screens
  if (window.innerWidth >= 640) return 2; // small screens
  return 1; // very small screens
};


const CollapsibleCardLights = ({ currentRows = [], plannedRows = [], handleClickOnCard, type }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [columnCount, setColumnCount] = useState(getColumnCount());

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Masonry Grid container */}
      <div className="masonry-grid">
        {currentRows.map((currentRow, index) => (
          <div key={index} className="masonry-item">
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800" onClick={() => handleClickOnCard(currentRow.tbID, currentRow.tbL2)} >
                  {currentRow.tbID}: {currentRow.tbName}
                </CardTitle>
                <CardTitle className="text-sm font-semibold text-gray-800">
                  <div className="flex justify-between items-center max-w-3xl mx-auto">
                    <div
                      title={`Overall Health: ${currentRow.tbMDHealthOverall || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthOverall === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthOverall ? `bg-${currentRow.tbMDHealthOverall.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Schedule Health: ${currentRow.tbMDHealthSchedule || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthSchedule === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthSchedule ? `bg-${currentRow.tbMDHealthSchedule.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Cost Health: ${currentRow.tbMDHealthCost || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthCost === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthCost ? `bg-${currentRow.tbMDHealthCost.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Hours Health: ${currentRow.tbMDHealthHours || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthHours === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthHours ? `bg-${currentRow.tbMDHealthHours.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Scope Health: ${currentRow.tbMDHealthScope || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthScope === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthScope ? `bg-${currentRow.tbMDHealthScope.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Risk Health: ${currentRow.tbMDHealthRisk || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthRisk === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthRisk ? `bg-${currentRow.tbMDHealthRisk.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                    <div
                      title={`Issues Health: ${currentRow.tbMDHealthIssues || 'N/A'}`}
                      className={`w-[25px] h-[25px] rounded-full ${currentRow.tbMDHealthIssues === "Not Assessed" ? 'bg-orange-400' :
                        currentRow.tbMDHealthIssues ? `bg-${currentRow.tbMDHealthIssues.toLowerCase()}-500` : 'bg-gray-300'
                        }`}
                    ></div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardDescription className="pl-6 text-sm text-gray-800" onClick={() => handleClickOnCard(currentRow.tbID, currentRow.tbL2)} >
                {currentRow.tbMDDescription}
              </CardDescription>
              <Collapsible
                open={openIndex === index}
                onOpenChange={() => handleToggle(index)}
              >
                <CollapsibleTrigger className="w-full px-6 py-2 flex justify-between items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                  {openIndex === index ? "Hide Details" : "Show Details"}
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-2">
                    {type === "portfolio" && (
                      <>
                        <div className="mb-2">
                          <div className="text-sm font-medium text-gray-600">Executive Summary</div>
                          <div className="text-sm text-gray-800 mt-1">{currentRow.tbMDExecutiveSummary}</div>
                        </div>
                      </>
                    )}

                    {type === "project" && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="text-sm font-medium text-gray-600">Parent ID</div>
                          <div className="text-sm text-gray-800">{currentRow.tbSelfKey2}</div>
                          <div className="text-sm font-medium text-gray-600">Investment Category</div>
                          <div className="text-sm text-gray-800">{currentRow.tbMDInvestmentCategory}</div>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-medium text-gray-600">Executive Summary</div>
                          <div className="text-sm text-gray-800 mt-1">{currentRow.tbMDExecutiveSummary}</div>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-medium text-gray-600">Notes</div>
                          <div className="text-sm text-gray-800 mt-1">{currentRow.tbMDNotesProject}</div>
                        </div>
                      </>
                    )}

                    {type === "subproject" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium text-gray-600">Project Parent ID</div>
                        <div className="text-sm text-gray-800">{currentRow.tbSelfKey2}</div>
                        <div className="text-sm font-medium text-gray-600">Subproject</div>
                        <div className="text-sm text-gray-800">{currentRow.tbID}</div>
                      </div>
                    )}

                    <CostHoursPopupComponent currentRow={currentRow} plannedRows={plannedRows} />

                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};


export default CollapsibleCardLights;