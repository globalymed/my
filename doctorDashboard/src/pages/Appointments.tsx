
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Plus } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data
const appointments = [
  {
    id: "1",
    patient: {
      id: "p1",
      name: "John Smith",
      initials: "JS",
    },
    dateTime: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    type: "video" as const,
    status: "upcoming" as const,
    duration: 30,
  },
  {
    id: "2",
    patient: {
      id: "p2",
      name: "Emily Johnson",
      initials: "EJ",
    },
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    type: "phone" as const,
    status: "upcoming" as const,
    duration: 15,
  },
  {
    id: "3",
    patient: {
      id: "p3",
      name: "Michael Brown",
      initials: "MB",
    },
    dateTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    type: "in-person" as const,
    status: "upcoming" as const,
    duration: 45,
  },
  {
    id: "4",
    patient: {
      id: "p4",
      name: "Sarah Wilson",
      initials: "SW",
    },
    dateTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "video" as const,
    status: "in-progress" as const,
    duration: 30,
  },
  {
    id: "5",
    patient: {
      id: "p5",
      name: "Robert Davis",
      initials: "RD",
    },
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "in-person" as const,
    status: "completed" as const,
    duration: 60,
  },
  {
    id: "6",
    patient: {
      id: "p6",
      name: "Jennifer Lee",
      initials: "JL",
    },
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: "phone" as const,
    status: "completed" as const,
    duration: 15,
  },
  {
    id: "7",
    patient: {
      id: "p7",
      name: "William Martinez",
      initials: "WM",
    },
    dateTime: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    type: "video" as const,
    status: "cancelled" as const,
    duration: 30,
  },
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7),
  });

  const handleAppointmentJoin = (appointmentId: string) => {
    toast.success("Joining video call...", {
      description: `Opening video call for appointment #${appointmentId}`,
    });
  };

  const handleAppointmentReschedule = (appointmentId: string) => {
    toast.info("Opening reschedule dialog", {
      description: `Rescheduling appointment #${appointmentId}`,
    });
  };

  // Filter appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by search term
      if (searchTerm && !appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by tab
      if (currentTab !== "all" && appointment.status !== currentTab) {
        return false;
      }
      
      // Filter by date range
      if (date?.from && appointment.dateTime < date.from) {
        return false;
      }
      
      if (date?.to && appointment.dateTime > date.to) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Appointments</h1>
          </div>
          <Button className="bg-doctor-500 hover:bg-doctor-600">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full sm:w-[300px]",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    patient={appointment.patient}
                    dateTime={appointment.dateTime}
                    type={appointment.type}
                    status={appointment.status}
                    duration={appointment.duration}
                    onJoin={() => handleAppointmentJoin(appointment.id)}
                    onReschedule={() => handleAppointmentReschedule(appointment.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No appointments found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchTerm || date 
                      ? "Try adjusting your search or date range"
                      : "Schedule an appointment to get started"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
