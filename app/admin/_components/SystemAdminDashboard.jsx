// app/admin/_components/SystemAdminDashboard.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

const SystemAdminDashboard = ({ session }) => {
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        activeNotifications: 0,
        systemHealth: 'good',
        lastBackup: null
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading system stats
        const loadSystemStats = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSystemStats({
                    totalUsers: 42,
                    activeNotifications: 15,
                    systemHealth: 'good',
                    lastBackup: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error loading system stats:', error);
                toast.error('Failed to load system statistics');
            } finally {
                setIsLoading(false);
            }
        };

        loadSystemStats();
    }, []);

    const runSystemCheck = async () => {
        setIsLoading(true);
        try {
            // Simulate system check
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('System check completed successfully');
            setSystemStats(prev => ({
                ...prev,
                systemHealth: 'excellent'
            }));
        } catch (error) {
            toast.error('System check failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getHealthBadge = (health) => {
        const variants = {
            excellent: 'bg-green-100 text-green-800',
            good: 'bg-blue-100 text-blue-800',
            warning: 'bg-yellow-100 text-yellow-800',
            critical: 'bg-red-100 text-red-800'
        };
        return variants[health] || variants.good;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Overview 
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Badge className={getHealthBadge(systemStats.systemHealth)}>
                            {systemStats.systemHealth.toUpperCase()}
                        </Badge>
                        <Button
                            onClick={runSystemCheck}
                            disabled={isLoading}
                            size="sm"
                            variant="outline"
                        >
                            {isLoading ? 'Checking...' : 'Run Check'}
                        </Button>
                    </div>
                </CardContent>
            </Card> */}

            {/* User Statistics 
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Active users in the system
                    </p>
                </CardContent>
            </Card>  */}

            {/* Notification Statistics 
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{systemStats.activeNotifications}</div>
                    <p className="text-xs text-muted-foreground">
                        Configured notification profiles
                    </p>
                </CardContent>
            </Card>  */}

            {/* Quick Actions */}
            <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Control Panel</CardTitle>
                    <CardDescription className="text-gray-700">
                        Quick access to administration functions such as
                        Notificaiton thresholds, target delivery method, phone numbers and emails.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Button
                            className="h-30 flex flex-col items-center justify-center space-y-2"
                            variant="outline"
                            onClick={() => window.location.href = '/admin/notifications'}
                        >
                            <Bell className="h-6 w-6 text-green-700" />
                            <span>Configure & Send Notifications</span>
                             <span> Manually or Automatically </span>
                        </Button>


                        <Button
                            className="h-30 flex flex-col items-center justify-center space-y-2"
                            variant="outline"
                            onClick={() => window.location.href = '/admin/testnotifications'}
                        >
                            <Settings className="h-6 w-6 text-red-700" />
                            <span>Test Notification Platform </span>
                             <span>Connectivity</span>
                        </Button>


                        {/*                         <Button
                            className="h-30 flex flex-col items-center justify-center space-y-2"
                            variant="outline"
                            onClick={() => window.location.href = '/admin/settings'}
                        >
                            <Settings className="h-6 w-6" />
                            <span>Settings & Help</span>
                        </Button> */}

                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemAdminDashboard;