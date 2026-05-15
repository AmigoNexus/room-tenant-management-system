'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ArrowLeft, Building2, Layers, Home, Square, Plus, MapPin, MoreVertical, Edit2, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import AddWingModal from '@/components/properties/AddWingModal';
import AddFloorModal from '@/components/properties/AddFloorModal';
import AddFlatModal from '@/components/properties/AddFlatModal';
import PropertyHierarchy from '@/components/properties/PropertyHierarchy';
import CreatePropertyModal from '@/components/properties/CreatePropertyModal';
import DeleteConfirmModal from '@/components/properties/DeleteConfirmModal';
import { propertyService } from '@/services/propertyService';
import { PropertyDetails, Wing, Floor, Flat } from '@/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const propertyId = Array.isArray(params?.propertyId) ? params?.propertyId[0] ?? '' : params?.propertyId ?? '';
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [wings, setWings] = useState<Wing[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWingModal, setShowWingModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showFlatModal, setShowFlatModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedWingId, setSelectedWingId] = useState<string | number | undefined>();
  const [selectedFloorId, setSelectedFloorId] = useState<string | number | undefined>();
  const [selectedFlatId, setSelectedFlatId] = useState<string | number | undefined>();
  const [editingWing, setEditingWing] = useState<Wing | null>(null);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);

  const [deleteConfig, setDeleteConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    loading: boolean;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: async () => {},
    loading: false,
  });

  const refreshData = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const [propertyResponse, wingsResponse] = await Promise.all([
        propertyService.getProperty(propertyId),
        propertyService.getWings(propertyId),
      ]);

      const floorLists = await Promise.all(
        wingsResponse.map(async (wing) => {
          const wingFloors = await propertyService.getFloors(String(wing.id));
          return wingFloors.map(floor => ({ ...floor, wingId: wing.id }));
        })
      );
      const floorsResponse = floorLists.flat();

      const flatLists = await Promise.all(
        floorsResponse.map(async (floor) => {
          const floorFlats = await propertyService.getFlatsByFloor(String(floor.id));
          return floorFlats.map(flat => ({ ...flat, floorId: floor.id }));
        })
      );
      const allFlats = flatLists.flat();

      setProperty({
        ...propertyResponse,
        wings: wingsResponse,
        floors: floorsResponse,
        flats: allFlats,
      });
      setWings(wingsResponse);
      setFloors(floorsResponse);
      setFlats(allFlats);
    } catch (error) {
      console.error('Failed to load property details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWing = (id: string | number) => {
    setDeleteConfig({
      open: true,
      title: 'Delete Wing',
      description: 'Are you sure you want to delete this wing? All floors and flats inside it will be permanently removed.',
      loading: false,
      onConfirm: async () => {
        setDeleteConfig(prev => ({ ...prev, loading: true }));
        try {
          await propertyService.deleteWing(id);
          toast({ title: 'Wing deleted', description: 'The wing has been removed successfully.' });
          setDeleteConfig(prev => ({ ...prev, open: false }));
          refreshData();
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete wing' });
        } finally {
          setDeleteConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleDeleteFloor = (id: string | number) => {
    setDeleteConfig({
      open: true,
      title: 'Delete Floor',
      description: 'Are you sure you want to delete this floor? All flats on this floor will be permanently removed.',
      loading: false,
      onConfirm: async () => {
        setDeleteConfig(prev => ({ ...prev, loading: true }));
        try {
          await propertyService.deleteFloor(id);
          toast({ title: 'Floor deleted', description: 'The floor has been removed successfully.' });
          setDeleteConfig(prev => ({ ...prev, open: false }));
          refreshData();
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete floor' });
        } finally {
          setDeleteConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleDeleteFlat = (id: string | number) => {
    setDeleteConfig({
      open: true,
      title: 'Delete Flat',
      description: 'Are you sure you want to delete this flat? This action cannot be undone.',
      loading: false,
      onConfirm: async () => {
        setDeleteConfig(prev => ({ ...prev, loading: true }));
        try {
          await propertyService.deleteFlat(id);
          toast({ title: 'Flat deleted', description: 'The flat has been removed successfully.' });
          setDeleteConfig(prev => ({ ...prev, open: false }));
          refreshData();
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete flat' });
        } finally {
          setDeleteConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleDeleteProperty = () => {
    setDeleteConfig({
      open: true,
      title: 'Delete Entire Property',
      description: 'Are you sure you want to delete this ENTIRE property? All wings, floors, and flats will be permanently removed. This action is extremely destructive.',
      loading: false,
      onConfirm: async () => {
        setDeleteConfig(prev => ({ ...prev, loading: true }));
        try {
          await propertyService.deleteProperty(propertyId);
          toast({ title: 'Property deleted', description: 'The property has been removed successfully.' });
          setDeleteConfig(prev => ({ ...prev, open: false }));
          router.push('/properties');
        } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete property' });
        } finally {
          setDeleteConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  useEffect(() => {
    if (wings.length > 0) {
      const exists = wings.some(w => w.id === selectedWingId);
      if (!exists || !selectedWingId) {
        setSelectedWingId(wings[0].id);
      }
    } else {
      setSelectedWingId(undefined);
    }
  }, [wings, selectedWingId]);

  useEffect(() => {
    if (selectedWingId && floors.length > 0) {
      const wingFloors = floors.filter(f => f.wingId === selectedWingId);
      const exists = wingFloors.some(f => f.id === selectedFloorId);
      if (!exists || !selectedFloorId) {
        if (wingFloors.length > 0) {
          setSelectedFloorId(wingFloors[0].id);
        } else {
          setSelectedFloorId(undefined);
        }
      }
    } else {
      setSelectedFloorId(undefined);
    }
  }, [selectedWingId, floors, selectedFloorId]);


  useEffect(() => {
    refreshData();
  }, [propertyId]);

  const wingMetrics = useMemo(() => {
    return wings.map((wing) => {
      const floorCount = floors.filter((floor) => floor.wingId === wing.id).length;
      const roomCount = flats.filter((flat) => {
        const floor = floors.find((floor) => floor.id === flat.floorId);
        return floor?.wingId === wing.id;
      }).length;
      return { wing, floorCount, roomCount };
    });
  }, [wings, floors, flats]);

  const totalWings = wings.length;
  const totalFloors = floors.length;
  const totalFlats = flats.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-500">
              <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <ArrowLeft className="w-4 h-4" /> Back to properties
              </Link>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                <span className="text-slate-400 font-bold text-xl block mb-2">Property Name :</span>
                {property?.propertyName || 'Property details'}
              </h1>
              <p className="text-slate-500 font-medium">{property?.address || 'Manage wings, floors and flats for this property.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2 border-slate-200 hover:bg-slate-50">
                  <Settings2 className="w-4 h-4" /> Property Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl min-w-[200px]">
                <DropdownMenuItem onClick={() => setShowPropertyModal(true)} className="gap-2 font-medium cursor-pointer py-3">
                  <Edit2 className="w-4 h-4 text-slate-500" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteProperty} className="gap-2 font-medium cursor-pointer py-3 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                  <Trash2 className="w-4 h-4" /> Delete Property
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CreatePropertyModal 
          open={showPropertyModal} 
          onOpenChange={setShowPropertyModal} 
          onSuccess={() => {
            refreshData();
            setShowPropertyModal(false);
          }} 
          editProperty={property}
        />

        <AddWingModal 
          open={showWingModal || !!editingWing} 
          onOpenChange={(open) => {
            setShowWingModal(open);
            if (!open) setEditingWing(null);
          }} 
          propertyId={propertyId} 
          onSuccess={refreshData} 
          editWing={editingWing}
        />
        <AddFloorModal
          open={showFloorModal || !!editingFloor}
          onOpenChange={(open) => {
            setShowFloorModal(open);
            if (!open) setEditingFloor(null);
          }}
          propertyId={propertyId}
          wings={wings}
          onSuccess={refreshData}
          defaultWingId={selectedWingId}
          editFloor={editingFloor}
        />
        <AddFlatModal
          open={showFlatModal || !!editingFlat}
          onOpenChange={(open) => {
            setShowFlatModal(open);
            if (!open) setEditingFlat(null);
          }}
          floors={floors}
          onSuccess={refreshData}
          defaultFloorId={selectedFloorId}
          editFlat={editingFlat}
        />

        <DeleteConfirmModal
          open={deleteConfig.open}
          onOpenChange={(open) => setDeleteConfig(prev => ({ ...prev, open }))}
          title={deleteConfig.title}
          description={deleteConfig.description}
          onConfirm={deleteConfig.onConfirm}
          loading={deleteConfig.loading}
        />

        <section className="bg-white/50 backdrop-blur-sm rounded-[3rem] p-8 border border-white shadow-2xl shadow-indigo-100/50 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-600"></div>
            </div>
          )}
          <PropertyHierarchy
            propertyId={propertyId}
            wings={wings}
            floors={floors}
            flats={flats}
            selectedWingId={selectedWingId}
            selectedFloorId={selectedFloorId}
            selectedFlatId={selectedFlatId}
            onSelectWing={(id) => {
              setSelectedWingId(id);
              setSelectedFloorId(undefined);
              setSelectedFlatId(undefined);
            }}
            onSelectFloor={(id) => {
              setSelectedFloorId(id);
              setSelectedFlatId(undefined);
            }}
            onSelectFlat={setSelectedFlatId}
            onAddWing={() => setShowWingModal(true)}
            onAddFloor={(wingId) => {
              setSelectedWingId(wingId);
              setShowFloorModal(true);
            }}
            onAddFlat={(floorId) => {
              setSelectedFloorId(floorId);
              setShowFlatModal(true);
            }}
            onEditWing={setEditingWing}
            onDeleteWing={handleDeleteWing}
            onEditFloor={setEditingFloor}
            onDeleteFloor={handleDeleteFloor}
            onEditFlat={setEditingFlat}
            onDeleteFlat={handleDeleteFlat}
            onRefresh={refreshData}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}