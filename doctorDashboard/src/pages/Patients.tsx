
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatientCard from "@/components/dashboard/PatientCard";
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
import { Search, Plus, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data
const patients = [
  {
    id: "p1",
    name: "John Smith",
    initials: "JS",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    status: "active" as const,
    documentsCount: 5,
  },
  {
    id: "p2",
    name: "Emily Johnson",
    initials: "EJ",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 987-6543",
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    status: "active" as const,
    documentsCount: 3,
  },
  {
    id: "p3",
    name: "Michael Brown",
    initials: "MB",
    email: "michael.brown@example.com",
    phone: "+1 (555) 456-7890",
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    status: "active" as const,
    documentsCount: 7,
  },
  {
    id: "p4",
    name: "Sarah Wilson",
    initials: "SW",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 987-1234",
    status: "pending" as const,
    documentsCount: 2,
  },
  {
    id: "p5",
    name: "Robert Davis",
    initials: "RD",
    email: "robert.davis@example.com",
    phone: "+1 (555) 321-7654",
    status: "pending" as const,
    documentsCount: 1,
  },
  {
    id: "p6",
    name: "Jennifer Lee",
    initials: "JL",
    email: "jennifer.lee@example.com",
    phone: "+1 (555) 654-3210",
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    status: "inactive" as const,
    documentsCount: 4,
  },
  {
    id: "p7",
    name: "William Martinez",
    initials: "WM",
    email: "william.martinez@example.com",
    phone: "+1 (555) 246-8101",
    lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    status: "inactive" as const,
    documentsCount: 2,
  },
];

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortBy, setSortBy] = useState("nameAsc");

  const handleScheduleAppointment = (patientId: string) => {
    toast.info("Opening scheduler", {
      description: `Scheduling new appointment for patient #${patientId}`,
    });
  };

  const handleViewDocuments = (patientId: string) => {
    toast.info("Opening documents", {
      description: `Viewing documents for patient #${patientId}`,
    });
  };

  const handleContactPatient = (patientId: string, method: "email" | "phone") => {
    toast.info(`Contacting patient via ${method}`, {
      description: `Opening ${method} for patient #${patientId}`,
    });
  };

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      // Filter by search term
      if (searchTerm && !patient.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !patient.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by tab
      if (currentTab !== "all" && patient.status !== currentTab) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort patients
      switch (sortBy) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "lastVisit":
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return b.lastVisit.getTime() - a.lastVisit.getTime();
        case "documentsCount":
          return b.documentsCount - a.documentsCount;
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Patients</h1>
          </div>
          <Button className="bg-doctor-500 hover:bg-doctor-600">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              <SelectItem value="lastVisit">Last Visit</SelectItem>
              <SelectItem value="documentsCount">Documents Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onSchedule={handleScheduleAppointment}
                    onViewDocuments={handleViewDocuments}
                    onContact={handleContactPatient}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No patients found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchTerm 
                      ? "Try adjusting your search terms"
                      : "Add a new patient to get started"}
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

export default Patients;
