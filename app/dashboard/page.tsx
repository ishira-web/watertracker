// water-tracker-client/app/dashboard/page.tsx (FINAL PROTECTED VERSION)

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import API from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Droplet, Goal, LogOut } from 'lucide-react';
import { CircularProgress } from '@/components/circular-progress';
import { UpdateGoalDialog } from '@/components/update-goal-dialog';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';

interface LogEntry {
    _id: string;
    userId: string;
    amount: number;
    date: string;
    createdAt?: string;
    updatedAt?: string;
}

// -------------------------------------------------------------------
// The main component remains a named function (DashboardComponent)
// -------------------------------------------------------------------
function DashboardComponent() {
    const router = useRouter(); 
    const [totalIntake, setTotalIntake] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(2000); 
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); 
    
    const progressPercent = Math.min((totalIntake / dailyGoal) * 100, 100);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userGoal');
        router.push('/login');
    }, [router]);


    const fetchDailyData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await API.get('/water/daily'); 
            
            setTotalIntake(response.data.totalIntake || 0);
            setLogs(response.data.logs || []);
            setDailyGoal(response.data.dailyGoal || 2000); 
            
        } catch (err: any) {
            if (err.response?.status === 401) {
                 handleLogout(); // Redirect on unauthorized access
            }
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [handleLogout]);


    useEffect(() => {
        const localGoal = localStorage.getItem('userGoal');
        if (localGoal) {
            setDailyGoal(Number(localGoal));
        }
        fetchDailyData();
    }, [fetchDailyData]);

    const handleLogWater = async (amount: number) => {
        try {
            await API.post('/water/log', { amount }); 
            await fetchDailyData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to log water');
        }
    };
    
    const handleGoalUpdated = (newGoalValue: number) => {
        setDailyGoal(newGoalValue);
    };


    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error && !loading) return <div className="p-8 text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">💧 Hydration Dashboard</h1>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* 1. Progress Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Droplet className="w-5 h-5 text-blue-500" /> Daily Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <CircularProgress progress={progressPercent} size={200} strokeWidth={15} progressColor="stroke-blue-500" className="mb-4">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-extrabold text-blue-600">{totalIntake}</span>
                                <span className="text-lg text-muted-foreground">/ {dailyGoal} ml</span>
                            </div>
                        </CircularProgress>
                        <div className="flex justify-center gap-4 w-full px-4">
                            <Button onClick={() => handleLogWater(250)} className="bg-blue-500 hover:bg-blue-600 w-1/2">Add 250ml</Button>
                            <Button onClick={() => handleLogWater(500)} variant="secondary" className="w-1/2">Add 500ml</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Goal Card - INTEGRATED DIALOG */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Goal className="w-5 h-5 text-green-500" /> Set Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold mb-3">{dailyGoal} ml</p>
                        <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
                            Change Goal
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Daily Log Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Log History Today</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of your water intake today.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Amount (ml)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell>{new Date(log.date).toLocaleTimeString()}</TableCell>
                                    <TableCell className="text-right font-medium">{log.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* The Goal Update Dialog Component */}
            <UpdateGoalDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                currentGoal={dailyGoal}
                onGoalUpdated={handleGoalUpdated}
            />
        </div>
    );
}

// ----------------------------------------------------
// ✅ The Final Export: Apply the AuthGuard
// ----------------------------------------------------
const ProtectedDashboard = () => (
    <AuthGuard>
        <DashboardComponent />
    </AuthGuard>
);

export default ProtectedDashboard;