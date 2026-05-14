'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  loading = false
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-rose-50 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black text-slate-900">{title}</DialogTitle>
            <DialogDescription className="text-rose-600/70 font-medium">
              This action cannot be undone.
            </DialogDescription>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-600 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold h-12 px-6"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl font-black h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 transition-all active:scale-95 gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
