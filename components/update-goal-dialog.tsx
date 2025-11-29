// water-tracker-client/components/update-goal-dialog.tsx

"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from '@/lib/api';

interface UpdateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGoal: number;
  onGoalUpdated: (newGoal: number) => void;
}

export function UpdateGoalDialog({
  open,
  onOpenChange,
  currentGoal,
  onGoalUpdated,
}: UpdateGoalDialogProps) {
  const [newGoal, setNewGoal] = useState(currentGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const goalValue = Number(newGoal);

    if (isNaN(goalValue) || goalValue < 100) {
      setError("Please enter a valid goal (minimum 100 ml).");
      return;
    }

    setLoading(true);
    try {
      const response = await API.put('/water/goal', { newGoal: goalValue });
      
      // Update local storage and call the parent update handler
      localStorage.setItem('userGoal', goalValue.toString());
      onGoalUpdated(goalValue);
      
      onOpenChange(false);
      // toast.success(response.data.message || 'Goal updated!');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update goal.';
      setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Daily Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal" className="text-right">
                New Goal (ml)
              </Label>
              <Input
                id="goal"
                type="number"
                min="100"
                value={newGoal}
                onChange={(e) => setNewGoal(Number(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}