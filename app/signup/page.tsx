// water-tracker-client/app/signup/page.tsx

"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// NOTE: Use the direct Express API URL for authentication pages
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dailyGoal, setDailyGoal] = useState(2000); // Default initial goal
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // POST request to the backend registration route
            const response = await axios.post(`${API_URL}/register`, { 
                email, 
                password, 
                dailyGoal 
            });
            
            // Success: Store JWT token and user data received from the backend
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userGoal', response.data.user.dailyGoal.toString());

            // Redirect to the protected dashboard
            router.push('/dashboard'); 

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please check your inputs.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">✨ Register for Water Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="goal">Daily Goal (ml)</Label>
                                <Input 
                                    id="goal" 
                                    type="number" 
                                    min="100"
                                    value={dailyGoal}
                                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? 'Registering...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account? <a href="/login" className="underline">Login</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}