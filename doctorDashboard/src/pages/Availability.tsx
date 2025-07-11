
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Save, Clock, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const weekDays = [
  { id: 0, name: "Sunday", short: "Sun" },
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
];

// Helper function to get default schedule for each day
const getDefaultSchedule = () => {
  const schedule: Record<string, { enabled: boolean, slots: string[] }> = {};
  weekDays.forEach(day => {
    schedule[day.id] = {
      enabled: day.id > 0 && day.id < 6, // Monday to Friday enabled by default
      slots: day.id > 0 && day.id < 6 ? ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] : [],
    };
  });
  return schedule;
};

const Availability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<"weekly" | "custom">("weekly");
  const [weeklySchedule, setWeeklySchedule] = useState(getDefaultSchedule());
  const [customDates, setCustomDates] = useState<Record<string, { slots: string[] }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get date string format for storing in customDates
  const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");
  
  // Toggle day enable/disable for weekly schedule
  const toggleDayEnabled = (dayId: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled,
      }
    }));
  };
  
  // Toggle time slot for a day
  const toggleTimeSlot = (dayId: number, timeSlot: string) => {
    setWeeklySchedule(prev => {
      const slots = prev[dayId].slots;
      return {
        ...prev,
        [dayId]: {
          ...prev[dayId],
          slots: slots.includes(timeSlot)
            ? slots.filter(slot => slot !== timeSlot)
            : [...slots, timeSlot].sort(),
        }
      };
    });
  };
  
  // Toggle time slot for a custom date
  const toggleCustomTimeSlot = (dateStr: string, timeSlot: string) => {
    setCustomDates(prev => {
      const dateData = prev[dateStr] || { slots: [] };
      const slots = dateData.slots;
      
      return {
        ...prev,
        [dateStr]: {
          slots: slots.includes(timeSlot)
            ? slots.filter(slot => slot !== timeSlot)
            : [...slots, timeSlot].sort(),
        }
      };
    });
  };
  
  // Clear all time slots for a custom date
  const clearCustomDate = async (dateStr: string) => {
    try {
      // Delete all slots for this date from the database
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('custom_date', dateStr);
      
      if (error) throw error;
      
      // Update local state
      setCustomDates(prev => {
        const newDates = { ...prev };
        delete newDates[dateStr];
        return newDates;
      });
      
      toast.success("Custom date cleared", {
        description: `Availability for ${format(new Date(dateStr), "MMMM d, yyyy")} has been removed`,
      });
    } catch (error) {
      console.error("Error clearing custom date:", error);
      toast.error("Failed to clear custom date", {
        description: "There was a problem removing the availability",
      });
    }
  };
  
  // Check if a date has custom availability set
  const hasCustomAvailability = (date: Date) => {
    const dateKey = getDateKey(date);
    return customDates[dateKey] !== undefined;
  };
  
  // Get day of week from date
  const getDayOfWeek = (date: Date) => date.getDay();
  
  // Load availability data from Supabase
  useEffect(() => {
    const loadAvailability = async () => {
      setIsLoading(true);
      
      try {
        // Load weekly schedule
        const { data: weeklyData, error: weeklyError } = await supabase
          .from('availability_slots')
          .select('*')
          .not('day_of_week', 'is', null);
        
        if (weeklyError) throw weeklyError;
        
        // Load custom dates
        const { data: customData, error: customError } = await supabase
          .from('availability_slots')
          .select('*')
          .not('custom_date', 'is', null);
        
        if (customError) throw customError;
        
        // Process weekly data
        const loadedWeeklySchedule = getDefaultSchedule();
        
        weeklyData.forEach(slot => {
          const dayId = slot.day_of_week;
          loadedWeeklySchedule[dayId].enabled = true;
          if (!loadedWeeklySchedule[dayId].slots.includes(slot.time_slot)) {
            loadedWeeklySchedule[dayId].slots.push(slot.time_slot);
          }
        });
        
        // Process custom data
        const loadedCustomDates: Record<string, { slots: string[] }> = {};
        
        customData.forEach(slot => {
          const dateKey = slot.custom_date;
          if (!loadedCustomDates[dateKey]) {
            loadedCustomDates[dateKey] = { slots: [] };
          }
          loadedCustomDates[dateKey].slots.push(slot.time_slot);
        });
        
        // Update state with loaded data
        setWeeklySchedule(loadedWeeklySchedule);
        setCustomDates(loadedCustomDates);
      } catch (error) {
        console.error("Error loading availability:", error);
        toast.error("Failed to load availability", {
          description: "There was a problem retrieving your schedule",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailability();
  }, []);
  
  // Handle save button click
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Processing weekly schedule first
      for (const dayId in weeklySchedule) {
        const day = weeklySchedule[dayId];
        const dayNumber = parseInt(dayId);
        
        if (day.enabled) {
          // Get current slots from the database for this day
          const { data: existingSlots, error: fetchError } = await supabase
            .from('availability_slots')
            .select('*')
            .eq('day_of_week', dayNumber);
          
          if (fetchError) throw fetchError;
          
          // Find slots to delete (existing but not in current day.slots)
          const existingTimeSlots = existingSlots.map(slot => slot.time_slot);
          const slotsToDelete = existingTimeSlots.filter(slot => !day.slots.includes(slot));
          
          // Find slots to add (in day.slots but not existing)
          const slotsToAdd = day.slots.filter(slot => !existingTimeSlots.includes(slot));
          
          // Delete slots that are no longer needed
          if (slotsToDelete.length > 0) {
            const { error: deleteError } = await supabase
              .from('availability_slots')
              .delete()
              .eq('day_of_week', dayNumber)
              .in('time_slot', slotsToDelete);
            
            if (deleteError) throw deleteError;
          }
          
          // Add new slots
          if (slotsToAdd.length > 0) {
            const newSlots = slotsToAdd.map(timeSlot => ({
              day_of_week: dayNumber,
              time_slot: timeSlot,
              is_available: true
            }));
            
            const { error: insertError } = await supabase
              .from('availability_slots')
              .insert(newSlots);
            
            if (insertError) throw insertError;
          }
        } else {
          // If day is disabled, delete all slots for this day
          const { error: deleteError } = await supabase
            .from('availability_slots')
            .delete()
            .eq('day_of_week', dayNumber);
          
          if (deleteError) throw deleteError;
        }
      }
      
      // Now process custom dates
      for (const dateStr in customDates) {
        const dateData = customDates[dateStr];
        
        // Get current slots from the database for this date
        const { data: existingSlots, error: fetchError } = await supabase
          .from('availability_slots')
          .select('*')
          .eq('custom_date', dateStr);
        
        if (fetchError) throw fetchError;
        
        // Find slots to delete (existing but not in current dateData.slots)
        const existingTimeSlots = existingSlots.map(slot => slot.time_slot);
        const slotsToDelete = existingTimeSlots.filter(slot => !dateData.slots.includes(slot));
        
        // Find slots to add (in dateData.slots but not existing)
        const slotsToAdd = dateData.slots.filter(slot => !existingTimeSlots.includes(slot));
        
        // Delete slots that are no longer needed
        if (slotsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('availability_slots')
            .delete()
            .eq('custom_date', dateStr)
            .in('time_slot', slotsToDelete);
          
          if (deleteError) throw deleteError;
        }
        
        // Add new slots
        if (slotsToAdd.length > 0) {
          const newSlots = slotsToAdd.map(timeSlot => ({
            custom_date: dateStr,
            time_slot: timeSlot,
            is_available: true
          }));
          
          const { error: insertError } = await supabase
            .from('availability_slots')
            .insert(newSlots);
          
          if (insertError) throw insertError;
        }
      }
      
      toast.success("Availability schedule saved", {
        description: "Your availability has been updated successfully",
      });
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability", {
        description: "There was a problem updating your schedule",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get available slots for selected date
  const getAvailableSlotsForDate = (date: Date) => {
    const dateKey = getDateKey(date);
    if (customDates[dateKey]) {
      return customDates[dateKey].slots;
    } else {
      const dayOfWeek = getDayOfWeek(date);
      return weeklySchedule[dayOfWeek].enabled ? weeklySchedule[dayOfWeek].slots : [];
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Availability</h1>
          </div>
          <Button 
            className="bg-doctor-500 hover:bg-doctor-600"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? (
              <div className="animate-pulse">Saving...</div>
            ) : isLoading ? (
              <div className="animate-pulse">Loading...</div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="pointer-events-auto mx-auto border rounded-md"
                      modifiers={{
                        customDay: (date) => hasCustomAvailability(date),
                      }}
                      modifiersStyles={{
                        customDay: {
                          fontWeight: "bold",
                          backgroundColor: "rgb(14 165 233 / 0.1)",
                          color: "rgb(14 165 233)",
                        },
                      }}
                    />
                    
                    <div className="flex justify-center gap-2 text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-doctor-100 rounded-full mr-1.5" />
                        <span>Default</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-doctor-200/70 rounded-full mr-1.5" />
                        <span>Custom</span>
                      </div>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      {date && (
                        <div className="bg-doctor-50 rounded-md p-2 mt-2">
                          <p className="font-medium text-doctor-800">
                            {format(date, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="mt-1">
                            {getAvailableSlotsForDate(date).length > 0 ? (
                              <span className="text-green-600">
                                {getAvailableSlotsForDate(date).length} available time slots
                              </span>
                            ) : (
                              <span className="text-red-500">Not available</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Select
                      value={selectedSchedule}
                      onValueChange={(value) => setSelectedSchedule(value as "weekly" | "custom")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly Schedule</SelectItem>
                        <SelectItem value="custom">Custom Date Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {selectedSchedule === "weekly" ? "Weekly Schedule" : "Custom Date Schedule"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSchedule === "weekly" ? (
                    <div className="space-y-4">
                      {weekDays.map((day) => (
                        <div key={day.id} className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Switch
                                id={`day-${day.id}`}
                                checked={weeklySchedule[day.id].enabled}
                                onCheckedChange={() => toggleDayEnabled(day.id)}
                              />
                              <Label htmlFor={`day-${day.id}`} className="font-medium">
                                {day.name}
                              </Label>
                            </div>
                            
                            {weeklySchedule[day.id].enabled && (
                              <Badge variant="secondary">
                                {weeklySchedule[day.id].slots.length} time slots
                              </Badge>
                            )}
                          </div>
                          
                          {weeklySchedule[day.id].enabled && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {timeSlots.map((timeSlot) => {
                                const isSelected = weeklySchedule[day.id].slots.includes(timeSlot);
                                return (
                                  <Button
                                    key={timeSlot}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    className={cn(
                                      "h-9 text-xs",
                                      isSelected && "bg-doctor-500 hover:bg-doctor-600"
                                    )}
                                    onClick={() => toggleTimeSlot(day.id, timeSlot)}
                                  >
                                    {timeSlot}
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {date && (
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5 text-doctor-600" />
                              <span className="font-medium">
                                {format(date, "EEEE, MMMM d, yyyy")}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {customDates[getDateKey(date)] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => clearCustomDate(getDateKey(date))}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Clear
                                </Button>
                              )}
                              
                              <Badge variant="secondary">
                                {(customDates[getDateKey(date)]?.slots || []).length} time slots
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {timeSlots.map((timeSlot) => {
                              const dateKey = getDateKey(date);
                              const customDate = customDates[dateKey] || { slots: [] };
                              const isSelected = customDate.slots.includes(timeSlot);
                              
                              return (
                                <Button
                                  key={timeSlot}
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  className={cn(
                                    "h-9 text-xs",
                                    isSelected && "bg-doctor-500 hover:bg-doctor-600"
                                  )}
                                  onClick={() => toggleCustomTimeSlot(dateKey, timeSlot)}
                                >
                                  {timeSlot}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Custom Dates</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.keys(customDates).length > 0 ? (
                            Object.entries(customDates).map(([dateStr, data]) => (
                              <div 
                                key={dateStr} 
                                className="flex items-center justify-between border rounded-md p-3"
                              >
                                <div>
                                  <p className="font-medium">{format(new Date(dateStr), "MMM d, yyyy")}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {data.slots.length} time slots
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => clearCustomDate(dateStr)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-6 border rounded-md text-muted-foreground">
                              No custom dates set. Select a date and add time slots.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Availability;
