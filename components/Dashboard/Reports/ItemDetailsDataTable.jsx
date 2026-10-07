"use client";
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SunIcon } from "@radix-ui/react-icons";
import ItemDetailsDialogNew from '@/components/Dashboard/Reports/ItemDetailsDialogNew';
import { getFieldsForProduct, licenseCheck } from '@/lib/helpers/customfunctions';
import { API_URL} from '@/config/site';

export default function ItemDetailsDataTable({ data, allPlannedRows, currrentUser, token, userEmail, reportType }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hierarchyOrderSearch, setHierarchyOrderSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState(reportType === 'pubset' ? 'tbID' : 'tbHierarchyOrder'); // Default sort: tbID for pubset, tbHierarchyOrder for others
  const [sortDirection, setSortDirection] = useState('asc'); // Default to ascending
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [license, setLicense] = useState("ABT03");
  const [expires, setExpires] = useState(null);

  useEffect(() => {
    const checkLicense = async () => {
      const { license, expires } = await licenseCheck(userEmail, token, API_URL);
      setLicense(license);
      setExpires(expires);
    };

    checkLicense();
  }, [userEmail, token, API_URL]);

 const licenseTest = "ABT03"  // T03 is stripped later
 const templateObject = getFieldsForProduct(license, reportType);

/*   console.log("log: ", {
  templateObject:templateObject,
  license: license,
  data

  })  */

  // Function to filter an object based on the template
  const filterObject = (obj, template) => {
    return Object.keys(template).reduce((acc, key) => {
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key];
      } else {
        acc[key] = template[key]; // Use the default value from the template
      }
      return acc;
    }, {});
  };

  // Initially sorted data by tbHierarchyOrder
  const filteredData = data.map(item => filterObject(item, templateObject));

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Function to get the indentation for the second column based on tbType
  const getIndentation = (tbType) => {
    switch (tbType) {
      case 'Project':
        return '4px';
      case 'Sub-Project':
        return '8px';
      case 'Task':
        return '12px';
      case 'Allocation':
        return '16px';
      default:
        return '0px';
    }
  };

  // Function to get the row style (highlighting) based on tbType
  const getRowStyle = (tbType) => {
    if (tbType === 'Project') {
      return { backgroundColor: '#e6ffe6' }; // Light green for Project
    } else if (tbType === 'Sub-Project') {
      return { backgroundColor: '#fff5e6' }; // Light orange for Sub-Project
    } else {
      return {};
    }
  };

  const filteredAndSortedData = filteredData
    .filter(item =>
      item.tbName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (item.tbHierarchyOrder ? item.tbHierarchyOrder.toString().includes(hierarchyOrderSearch) : true) &&
      (typeFilter === 'all' || item.tbType === typeFilter) &&
      (ownerFilter === 'all' || item.tbOwner === ownerFilter) &&
      (statusFilter === 'all' || item.tbStatus === statusFilter) &&
      (projectFilter === 'all' || item.tbL2 === projectFilter)
    )
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const uniqueCategories = Array.from(new Set(filteredData.map(issue => issue.tbType)));
  const uniqueOwners = Array.from(new Set(filteredData.map(issue => issue.tbOwner)));
  const uniqueStatuses = Array.from(new Set(filteredData.map(issue => issue.tbStatus)));
  const uniqueL2 = Array.from(new Set(filteredData.map(issue => issue.tbL2)));

  const sanitizeValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'unspecified';
    }
    return value;
  };

  return (

    <div className="space-y-4">
      {/* Table and Filters UI */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Search by ID..."
            value={hierarchyOrderSearch}
            onChange={(e) => setHierarchyOrderSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex space-x-4">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueL2.filter(Boolean).map((project) => (
                <SelectItem key={project} value={sanitizeValue(project)}>
                  {project || 'Unspecified'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueCategories.filter(Boolean).map((type) => (
                <SelectItem key={type} value={sanitizeValue(type)}>
                  {type || 'Unspecified'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {uniqueOwners.filter(Boolean).map((owner) => (
                <SelectItem key={owner} value={sanitizeValue(owner)}>
                  {owner || 'Unspecified'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {uniqueStatuses.filter(Boolean).map((status) => (
                <SelectItem key={status} value={sanitizeValue(status)}>
                  {status || 'Unspecified'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead className="text-gray-500 font-bold" key={"999"}>Actions</TableHead>
                {Object.entries(templateObject).map(([key, displayName]) => (
                  <TableHead key={key}>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(key)}
                      className="w-full p-0 font-medium text-muted-foreground">
                      <div className="flex items-center">
                        <span className="flex-grow text-left text-gray-700 font-bold">{displayName}</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((item) => (
                <TableRow key={item.tbID} style={getRowStyle(item.tbType)}><TableCell key="starter" className="p-2">
                  <button
                    onClick={() => handleRowClick(item)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  ><SunIcon className="w-4 h-4" />
                  </button>
                </TableCell>{Object.keys(templateObject).map((key, index) => (
                  <TableCell
                    key={key}
                    className="p-2"
                    style={index === 1 ? { paddingLeft: getIndentation(item.tbType) } : {}} // Indent second column
                  ><div className="max-h-[4.5em] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {item[key] !== null && item[key] !== "" ? item[key].toString() : "N/A"}
                    </div></TableCell>
                ))}</TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {selectedItem && (
          <ItemDetailsDialogNew
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            data={selectedItem}
            topPicURL="/images/favicon.ico"
            imageSize={{ width: '35px', height: '35px' }}
            imagePosition="left" // Can be 'left', 'right', or 'center'
            currrentUser={currrentUser}
            allPlannedRows={allPlannedRows}
          />
        )}
      </div>
    </div>
  );
}
