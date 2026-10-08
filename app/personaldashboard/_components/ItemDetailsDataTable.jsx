// 📁 components/Dashboard/Reports/ItemDetailsDataTable.jsx
// 🔥 THIS IS THE NEW SIMPLIFIED VERSION FOR NEXT.JS 15 🔥
"use client";
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { SunIcon } from "@radix-ui/react-icons";
import ItemDetailsDialogNew from '@/components/Dashboard/Reports/ItemDetailsDialogNew';
import { getFieldsForProduct } from '@/lib/helpers/customfunctions';

export default function ItemDetailsDataTable({ data, allPlannedRows, currentUser, userEmail, reportType, license}) {

/*      console.log("log ItemDetailsDataTable: ", {
  data, allPlannedRows, currentUser, userEmail, reportType, license

  }) */

    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [hierarchyOrderSearch, setHierarchyOrderSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [ownerFilter, setOwnerFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [sortColumn, setSortColumn] = useState('tbHierarchyOrder');
    const [sortDirection, setSortDirection] = useState('asc');

    // State for dialog
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Early return if no data
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-gray-600">No data available</div>
                    <div className="text-sm text-gray-500 mt-2">
                        Check if you've published your Timebars project data
                    </div>
                </div>
            </div>
        );
    }

    // Get template object for the license
    const templateObject = getFieldsForProduct(license, reportType);

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

    // Filter data based on template
    const filteredData = data.map(item => filterObject(item, templateObject));

    // Event handlers
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

    // Styling functions
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

    const getRowStyle = (tbType) => {
        if (tbType === 'Project') {
            return { backgroundColor: '#e6ffe6' }; // Light green for Project
        } else if (tbType === 'Sub-Project') {
            return { backgroundColor: '#fff5e6' }; // Light orange for Sub-Project
        } else {
            return {};
        }
    };

    // Data processing
    const filteredAndSortedData = filteredData
        .filter(item => {
            const nameMatch = item.tbName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            const hierarchyMatch = item.tbHierarchyOrder?.toString().includes(hierarchyOrderSearch) ?? false;
            const typeMatch = typeFilter === 'all' || item.tbType === typeFilter;
            const ownerMatch = ownerFilter === 'all' || item.tbOwner === ownerFilter;
            const statusMatch = statusFilter === 'all' || item.tbStatus === statusFilter;
            const projectMatch = projectFilter === 'all' || item.tbL2 === projectFilter;

            return nameMatch && hierarchyMatch && typeMatch && ownerMatch && statusMatch && projectMatch;
        })
        .sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            // Handle null/undefined values
            if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
            if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;

            // Compare values
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    // Get unique values for filters
    const uniqueCategories = [...new Set(filteredData.map(item => item.tbType).filter(Boolean))];
    const uniqueOwners = [...new Set(filteredData.map(item => item.tbOwner).filter(Boolean))];
    const uniqueStatuses = [...new Set(filteredData.map(item => item.tbStatus).filter(Boolean))];
    const uniqueL2 = [...new Set(filteredData.map(item => item.tbL2).filter(Boolean))];

    const sanitizeValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'unspecified';
        }
        return value;
    };

    return (
        <div className="space-y-4">
            {/* Search Controls */}
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

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Project" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {uniqueL2.map((project) => (
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
                        {uniqueCategories.map((type) => (
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
                        {uniqueOwners.map((owner) => (
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
                        {uniqueStatuses.map((status) => (
                            <SelectItem key={status} value={sanitizeValue(status)}>
                                {status || 'Unspecified'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500 font-bold">Actions</TableHead>
                            {Object.entries(templateObject).map(([key, displayName]) => (
                                <TableHead key={key}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort(key)}
                                        className="w-full p-0 font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        <div className="flex items-center">
                                            <span className="flex-grow text-left text-gray-700 font-bold">
                                                {displayName}
                                            </span>
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedData.map((item) => (
                            <TableRow
                                key={item.tbID || Math.random()}
                                style={getRowStyle(item.tbType)}
                                className="hover:bg-muted/50"
                            >
                                <TableCell className="p-2">
                                    <button
                                        onClick={() => handleRowClick(item)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded transition-colors"
                                        aria-label={`View details for ${item.tbName}`}
                                    >
                                        <SunIcon className="w-4 h-4" />
                                    </button>
                                </TableCell>
                                {Object.keys(templateObject).map((key, index) => (
                                    <TableCell
                                        key={key}
                                        className="p-2"
                                        style={index === 1 ? { paddingLeft: getIndentation(item.tbType) } : {}}
                                    >
                                        <div className="max-h-[4.5em] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                            {item[key] !== null && item[key] !== "" && item[key] !== undefined
                                                ? item[key].toString()
                                                : "N/A"
                                            }
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
                Showing {filteredAndSortedData.length} of {data.length} items
            </div>

            {/* Dialog for item details */}
            {selectedItem && (
                <ItemDetailsDialogNew
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    data={selectedItem}
                    topPicURL="/images/favicon.ico"
                    imageSize={{ width: '35px', height: '35px' }}
                    imagePosition="left"
                    currentUser={currentUser}
                    allPlannedRows={allPlannedRows}
                />
            )}
        </div>
    );
}