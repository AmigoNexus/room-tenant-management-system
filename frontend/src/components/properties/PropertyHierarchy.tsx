'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronRight,
  Building2,
  Layers,
  Home,
  Info,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Settings2,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Wing, Floor, Flat } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyHierarchyProps {
  propertyId: string;
  wings: Wing[];
  floors: Floor[];
  flats: Flat[];
  selectedWingId?: string | number | undefined;
  selectedFloorId?: string | number | undefined;
  selectedFlatId?: string | number | undefined;
  onSelectWing: (id: string | number) => void;
  onSelectFloor: (id: string | number) => void;
  onSelectFlat: (id: string | number | undefined) => void;
  onAddWing: () => void;
  onAddFloor: (wingId: string | number) => void;
  onAddFlat: (floorId: string | number) => void;
  onEditWing: (wing: Wing) => void;
  onDeleteWing: (id: string | number) => void;
  onEditFloor: (floor: Floor) => void;
  onDeleteFloor: (id: string | number) => void;
  onEditFlat: (flat: Flat) => void;
  onDeleteFlat: (id: string | number) => void;
}

export default function PropertyHierarchy({
  propertyId,
  wings,
  floors,
  flats,
  selectedWingId,
  selectedFloorId,
  selectedFlatId,
  onSelectWing,
  onSelectFloor,
  onSelectFlat,
  onAddWing,
  onAddFloor,
  onAddFlat,
  onEditWing,
  onDeleteWing,
  onEditFloor,
  onDeleteFloor,
  onEditFlat,
  onDeleteFlat
}: PropertyHierarchyProps) {

  const filteredFloors = floors.filter(f => f.wingId === selectedWingId);
  const filteredFlats = flats.filter(f => f.floorId === selectedFloorId);

  const selectedFlat = flats.find(f => f.id === selectedFlatId);

  return (
    <TooltipProvider>
      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
        {/* Level 1: Wings */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" /> Wings
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onAddWing}
                  className="rounded-xl hover:bg-indigo-50 text-indigo-600 h-8 w-8"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Wing</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-3">
            {wings.length > 0 ? wings.map((wing) => (
              <div key={wing.id} className="relative group">
                <Button
                  variant="ghost"
                  onClick={() => onSelectWing(wing.id)}
                  className={cn(
                    "w-full justify-between h-16 px-4 rounded-2xl border-2 transition-all duration-300 pr-12",
                    selectedWingId === wing.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                      : "bg-white text-slate-600 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                      selectedWingId === wing.id ? "bg-white/20" : "bg-slate-100"
                    )}>
                      {wing.wingName.charAt(0)}
                    </div>
                    <span className="font-bold">{wing.wingName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "rounded-lg px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tight",
                      selectedWingId === wing.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {floors.filter(f => f.wingId === wing.id).length} F
                    </Badge>
                    <ChevronRight className={cn("w-4 h-4", selectedWingId === wing.id ? "text-white" : "text-slate-300")} />
                  </div>
                </Button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddFloor(wing.id);
                        }}
                        className={cn(
                          "h-8 w-8 rounded-xl transition-all",
                          selectedWingId === wing.id
                            ? "text-white hover:bg-white/20"
                            : "text-indigo-600 hover:bg-indigo-50 opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Floor to {wing.wingName}</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "h-8 w-8 rounded-xl transition-all",
                          selectedWingId === wing.id ? "text-white hover:bg-white/20" : "text-slate-400 hover:bg-slate-50 opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                      <DropdownMenuItem onClick={() => onEditWing(wing)} className="gap-2 font-medium cursor-pointer py-2.5">
                        <Edit2 className="w-4 h-4 text-slate-500" /> Rename Wing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteWing(wing.id)} className="gap-2 font-medium cursor-pointer py-2.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                        <Trash2 className="w-4 h-4" /> Delete Wing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )) : (
              <div key="no-wings" className="p-8 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                <p className="text-slate-400 text-sm font-medium">No wings added</p>
              </div>
            )}
          </div>
        </div>

        {/* Level 2: Floors */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Floors
            </h3>
            {selectedWingId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddFloor(selectedWingId)}
                    className="rounded-xl hover:bg-indigo-50 text-indigo-600 h-8 w-8"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Floor</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {selectedWingId ? (
                filteredFloors.length > 0 ? filteredFloors.map((floor) => (
                  <motion.div
                    key={floor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-300 border-2 rounded-2xl overflow-hidden",
                        selectedFloorId === floor.id
                          ? "border-indigo-600 shadow-xl shadow-indigo-50"
                          : "border-slate-50 hover:border-indigo-100 shadow-sm"
                      )}
                      onClick={() => onSelectFloor(floor.id)}
                    >
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              selectedFloorId === floor.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight">{floor.floorName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-tight">
                                {flats.filter(f => f.floorId === floor.id).length} Flats
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddFlat(floor.id);
                                  }}
                                  className="h-7 w-7 rounded-lg hover:bg-indigo-50 text-indigo-600"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add Flat to {floor.floorName}</p>
                              </TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                                <DropdownMenuItem onClick={() => onEditFloor(floor)} className="gap-2 font-medium cursor-pointer py-2.5">
                                  <Edit2 className="w-4 h-4 text-slate-500" /> Rename Floor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteFloor(floor.id)} className="gap-2 font-medium cursor-pointer py-2.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                  <Trash2 className="w-4 h-4" /> Delete Floor
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Layers className="w-8 h-8 text-slate-200" />
                    </div>
                    <h4 className="text-slate-900 font-bold">No floors in this wing</h4>
                    <p className="text-slate-400 text-sm mt-1 max-w-[200px]">Add a floor to start organizing your flats.</p>
                  </motion.div>
                )
              ) : (
                <div key="select-wing-prompt" className="col-span-full p-12 text-center text-slate-400">
                  Select a wing to view its floors
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Level 3: Flats */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-600" /> Flats
            </h3>
            {selectedFloorId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddFlat(selectedFloorId)}
                    className="rounded-xl hover:bg-indigo-50 text-indigo-600 h-8 w-8"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Flat</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Flat Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {selectedFloorId ? (
                  filteredFlats.length > 0 ? filteredFlats.map((flat) => (
                    <motion.button
                      key={flat.id}
                      layoutId={`flat-${flat.id}`}
                      onClick={() => onSelectFlat(flat.id)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 relative overflow-hidden",
                        selectedFlatId === flat.id
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50"
                          : flat.status === 'AVAILABLE'
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                            : flat.status === 'OCCUPIED'
                              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100"
                      )}
                    >
                      {flat.flatNumber}
                      {selectedFlatId === flat.id && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute bottom-1 w-1 h-1 bg-white rounded-full"
                        />
                      )}
                    </motion.button>
                  )) : (
                    <div key="no-flats" className="col-span-full p-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                      No flats added
                    </div>
                  )
                ) : (
                  <div key="select-floor-prompt" className="col-span-full p-8 text-center text-slate-400">
                    Select a floor to view flats
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Flat Details Card */}
            <AnimatePresence mode="wait">
              {selectedFlat && (
                <motion.div
                  key={selectedFlat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="rounded-[2.5rem] bg-slate-900 text-white p-6 shadow-2xl shadow-slate-200"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge className={cn(
                        "rounded-full px-3 py-1 font-bold text-[10px] mb-2 border-none",
                        selectedFlat.status === 'AVAILABLE' ? "bg-emerald-500/20 text-emerald-400" :
                          selectedFlat.status === 'OCCUPIED' ? "bg-indigo-500/20 text-indigo-400" : "bg-amber-500/20 text-amber-400"
                      )}>
                        {selectedFlat.status}
                      </Badge>
                      <h4 className="text-3xl font-black">Flat {selectedFlat.flatNumber}</h4>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Home className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-1 p-4 bg-white/5 rounded-3xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3" /> Rent
                      </p>
                      <p className="text-xl font-black">₹{selectedFlat.rentAmount}</p>
                    </div>
                    <div className="space-y-1 p-4 bg-white/5 rounded-3xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Deposit
                      </p>
                      <p className="text-xl font-black">₹{selectedFlat.depositAmount}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">Maintenance</span>
                      <span className="font-bold">₹{selectedFlat.maintenanceAmount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-medium">Type</span>
                      <span className="font-bold">{selectedFlat.flatType || "-"}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-500 mt-0.5" />
                      <p className="text-xs text-slate-400 italic">
                        {selectedFlat.notes || "No additional notes for this flat."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <Button 
                      onClick={() => onEditFlat(selectedFlat)}
                      className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold gap-2 border-none"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Flat
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => onDeleteFlat(selectedFlat.id)}
                      className="h-12 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold gap-2 border-none"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
