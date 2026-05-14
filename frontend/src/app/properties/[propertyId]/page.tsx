'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ArrowLeft, Building2, Layers, Home, Square, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddWingModal from '@/components/properties/AddWingModal';
import AddFloorModal from '@/components/properties/AddFloorModal';
import AddFlatModal from '@/components/properties/AddFlatModal';
import { propertyService } from '@/services/propertyService';
import { PropertyDetails, Wing, Floor, Flat } from '@/types';

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = Array.isArray(params?.propertyId) ? params?.propertyId[0] ?? '' : params?.propertyId ?? '';
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [wings, setWings] = useState<Wing[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWingModal, setShowWingModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showFlatModal, setShowFlatModal] = useState(false);

  const refreshData = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const [propertyResponse, wingsResponse] = await Promise.all([
        propertyService.getProperty(propertyId),
        propertyService.getWings(propertyId),
      ]);

      const floorLists = await Promise.all(
        wingsResponse.map((wing) => propertyService.getFloors(String(wing.id)))
      );
      const floorsResponse = floorLists.flat();

      const flatLists = await Promise.all(
        floorsResponse.map((floor) => propertyService.getFlatsByFloor(String(floor.id)))
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
                {property?.propertyName || 'Property details'}
              </h1>
              <p className="text-slate-500 font-medium">Manage wings, floors and flats for this property.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setShowWingModal(true)} className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Wing
            </Button>
            <Button onClick={() => setShowFloorModal(true)} className="h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Floor
            </Button>
            <Button onClick={() => setShowFlatModal(true)} disabled={floors.length === 0} className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Flat
            </Button>
          </div>
        </div>

        <AddWingModal open={showWingModal} onOpenChange={setShowWingModal} propertyId={propertyId} onSuccess={refreshData} />
        <AddFloorModal open={showFloorModal} onOpenChange={setShowFloorModal} propertyId={propertyId} wings={wings} onSuccess={refreshData} />
        <AddFlatModal open={showFlatModal} onOpenChange={setShowFlatModal} floors={floors} onSuccess={refreshData} />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-72 space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-50/50 border-t-indigo-600"></div>
            <p className="text-slate-400 font-bold animate-pulse">Loading property details...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-3xl border-none shadow-lg shadow-slate-200/50 bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-black">Wings</CardTitle>
                  <CardDescription>{totalWings} active wing{totalWings === 1 ? '' : 's'}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-2xl font-black text-slate-900">{totalWings}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none shadow-lg shadow-slate-200/50 bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-black">Floors</CardTitle>
                  <CardDescription>{totalFloors} floor{totalFloors === 1 ? '' : 's'} in this property</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="text-2xl font-black text-slate-900">{totalFloors}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none shadow-lg shadow-slate-200/50 bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-black">Flats</CardTitle>
                  <CardDescription>{totalFlats} flat{totalFlats === 1 ? '' : 's'} available</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Square className="w-4 h-4 text-indigo-600" />
                    <span className="text-2xl font-black text-slate-900">{totalFlats}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Wings</h2>
                  <p className="text-slate-500">Each wing shows how many floors and rooms are assigned.</p>
                </div>
              </div>

              {wings.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {wingMetrics.map((item) => (
                    <Card key={item.wing.id} className="rounded-3xl border-none shadow-lg shadow-slate-100 bg-white">
                      <CardHeader className="pb-3 px-4 pt-4">
                        <Badge className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold text-sm">{item.wing.wingName}</Badge>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2 px-4 pb-4">
                        <div className="space-y-1">
                          <p className="text-xs uppercase text-slate-400 font-bold tracking-widest">Floors</p>
                          <p className="text-xl font-black text-slate-900">{item.floorCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase text-slate-400 font-bold tracking-widest">Rooms</p>
                          <p className="text-xl font-black text-slate-900">{item.roomCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-4xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
                  No wings have been added yet. Use the Add Wing button to create one.
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Floors</h2>
                  <p className="text-slate-500">Review floors and the number of flats on each level.</p>
                </div>
              </div>

              {floors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {floors.map((floor) => {
                    const wing = wings.find((wingItem) => wingItem.id === floor.wingId);
                    const floorFlats = flats.filter((flat) => flat.floorId === floor.id);
                    return (
                      <Card key={floor.id} className="rounded-3xl border-none shadow-lg shadow-slate-100 bg-white">
                        <CardHeader className="px-4 pt-4">
                          <CardTitle className="text-lg font-black text-slate-900">{floor.floorName}</CardTitle>
                          <CardDescription className="text-slate-500">{wing?.wingName || 'Unknown wing'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 pb-4">
                          <div className="flex items-center gap-3 text-slate-500">
                            <Home className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-bold">{floorFlats.length} flat{floorFlats.length === 1 ? '' : 's'}</span>
                          </div>
                          {floorFlats.length > 0 ? (
                            <div className="space-y-2">
                              {floorFlats.slice(0, 3).map((flat) => (
                                <div key={flat.id} className="rounded-2xl bg-slate-50 p-2 text-sm text-slate-700">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">{flat.flatNumber}</span>
                                    <Badge className="rounded-full bg-slate-100 text-slate-700 px-2 py-1 text-[11px]">
                                      {flat.status}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-slate-500">Rent ₹{flat.rentAmount}</div>
                                </div>
                              ))}
                              {floorFlats.length > 3 && <p className="text-xs text-slate-400">+{floorFlats.length - 3} more</p>}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400">No flats added to this floor yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-4xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
                  No floors have been added yet. Once you add a wing, create floors for it.
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
