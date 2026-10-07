import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TabularFilteredLights from "@/components/Dashboard/Common/TabularFilteredLights.jsx"
import TasksIssuesRisksDataTable from '@/components/Dashboard/Reports/TasksIssuesRisksDataTable';

//bg-gradient-to-r from-gray-800 to-blue-600

const TabsBelowCardsComponent = ({ tasks, risks, issues, tasksRisksIssues,  allPlannedRows, currentUser }) => {

    ///   console.log("allRows ", allRows);
    /*  <TabularFilteredLights allRows={risks} /> */
    return (
        <div className="p-6 rounded-lg shadow-lg">

            <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-gradient-to-r from-gray-700 to-blue-600 p-1">
                    <TabsTrigger value="tasks" className="rounded-lg text-sm font-medium transition-all text-white hover:bg-white hover:text-blue-900 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                        Tasks
                    </TabsTrigger>
                    <TabsTrigger value="risks" className="rounded-lg text-sm font-medium transition-all text-white hover:bg-white hover:text-blue-900 data-[state=active]:bg-white data-[state=active]:text-blue-900">
                        Risks
                    </TabsTrigger>
                    <TabsTrigger value="issues" className="rounded-lg text-sm font-medium transition-all text-white hover:bg-white hover:text-blue-900 data-[state=active]:bg-white data-[state=active]:text-blue-900">
                        Issues
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="tasks" className="mt-6">

                    <TasksIssuesRisksDataTable data={tasks} allPlannedRows={allPlannedRows} currentUser={currentUser} />

                </TabsContent>


                <TabsContent value="risks" className="mt-6">

                    <TasksIssuesRisksDataTable data={risks} allPlannedRows={allPlannedRows} currentUser={currentUser}/>

                </TabsContent>


                <TabsContent value="issues" className="mt-6">

                    <TasksIssuesRisksDataTable data={issues} allPlannedRows={allPlannedRows} currentUser={currentUser}/>

                </TabsContent>

            </Tabs>
        </div>
    );
};

export default TabsBelowCardsComponent;

{/* 
      <Table>
                        <TableHeader>
                            <TableRow className="border-b border-blue-400">
                                <TableHead className="w-[100px] text-blue-100">ID</TableHead>
                                <TableHead className="text-blue-100">Title</TableHead>
                                <TableHead className="text-blue-100">Priority</TableHead>
                                <TableHead className="text-right text-blue-100">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map((issue) => (
                                <TableRow key={issue.id} className="border-b border-blue-700 hover:bg-blue-700/50">
                                    <TableCell className="font-medium text-white">{issue.tbID}</TableCell>
                                    <TableCell className="text-white">{issue.tbName}</TableCell>
                                    <TableCell className="text-white">{issue.tbPriority}</TableCell>
                                    <TableCell className="text-right text-white">{issue.tbStatus}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
*/}