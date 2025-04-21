import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import PatientCard from "@/components/dashboard/PatientCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Clock, 
  CreditCard, 
  FileText, 
  Calendar,
  ChevronRight,
  User,
  Video,
  Phone
} from "lucide-react";
import { toast } from "sonner";

// Mock data for documents
const patientDocuments = {
  "p1": [
    {
      id: "d1",
      title: "Recent Lab Results.pdf",
      type: "pdf",
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      size: "2.1 MB",
      hasSummary: true,
      summary: "CBC shows normal white blood cell count. Cholesterol slightly elevated at 210 mg/dL. Vitamin D levels low at 25 ng/mL. Recommend vitamin D supplementation and dietary changes to address cholesterol."
    },
    {
      id: "d2",
      title: "Medical History.docx",
      type: "doc",
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      size: "1.5 MB",
      hasSummary: true,
    }
  ],
  "p2": [
    {
      id: "d3",
      title: "Allergy Test Results.pdf",
      type: "pdf",
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      size: "1.8 MB",
      hasSummary: true,
      summary: "Patient shows moderate allergic reaction to dust mites and mild reaction to certain pollens. No food allergies detected. Recommend over-the-counter antihistamines during high pollen seasons."
    }
  ],
  "p3": [
    {
      id: "d4",
      title: "X-Ray Report.jpg",
      type: "image",
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      size: "3.4 MB",
      hasSummary: true,
      summary: "Chest X-ray appears normal with no significant findings. Heart size and lung fields within normal limits. No evidence of pneumonia or other acute pathology."
    }
  ]
};

// Mock data for appointments and patients
const upcomingAppointments = [
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
];

const pendingPatients = [
  {
    id: "p4",
    name: "Sarah Wilson",
    initials: "SW",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 123-4567",
    status: "pending" as const,
    documentsCount: 2,
    documents: patientDocuments["p4"],
  },
  {
    id: "p5",
    name: "Robert Davis",
    initials: "RD",
    email: "robert.davis@example.com",
    phone: "+1 (555) 987-6543",
    status: "pending" as const,
    documentsCount: 1,
    documents: patientDocuments["p5"],
  },
];

const Index = () => {
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

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

  const handleViewDocument = (docId: string) => {
    toast.info("Opening document", {
      description: `Viewing document #${docId}`,
    });
  };

  const handleDownloadDocument = (docId: string) => {
    toast.success("Downloading document", {
      description: `Document #${docId} download started`,
    });
  };

  const handleGenerateInvoice = () => {
    setIsGeneratingInvoice(true);
    setTimeout(() => {
      setIsGeneratingInvoice(false);
      toast.success("Invoice generated successfully", {
        description: "You can view and download it from the Invoices page",
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Patients"
            value="247"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Today's Appointments"
            value="8"
            icon={<Clock className="h-6 w-6" />}
            description="3 completed, 5 upcoming"
          />
          <StatsCard
            title="New Documents"
            value="14"
            icon={<FileText className="h-6 w-6" />}
            description="This week"
          />
          <StatsCard
            title="Revenue"
            value="$8,429"
            icon={<CreditCard className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
            description="This month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-doctor-600"
                asChild
              >
                <a href="/appointments">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  patient={appointment.patient}
                  dateTime={appointment.dateTime}
                  type={appointment.type}
                  status={appointment.status}
                  duration={appointment.duration}
                  documents={patientDocuments[appointment.patient.id] || []}
                  onJoin={() => handleAppointmentJoin(appointment.id)}
                  onReschedule={() => handleAppointmentReschedule(appointment.id)}
                  onViewDocument={handleViewDocument}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <Card>
              <CardContent className="p-4 grid grid-cols-2 gap-3">
                <Button className="bg-doctor-500 hover:bg-doctor-600 h-auto py-3 flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-1" />
                  <span>New Patient</span>
                </Button>
                <Button className="bg-doctor-500 hover:bg-doctor-600 h-auto py-3 flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-1" />
                  <span>Schedule</span>
                </Button>
                <Button className="bg-doctor-500 hover:bg-doctor-600 h-auto py-3 flex-col items-center justify-center">
                  <Video className="h-6 w-6 mb-1" />
                  <span>Video Call</span>
                </Button>
                <Button className="bg-doctor-500 hover:bg-doctor-600 h-auto py-3 flex-col items-center justify-center">
                  <Phone className="h-6 w-6 mb-1" />
                  <span>Phone Call</span>
                </Button>
                <Button
                  className="bg-doctor-500 hover:bg-doctor-600 h-auto py-3 flex-col items-center justify-center col-span-2"
                  onClick={handleGenerateInvoice}
                  disabled={isGeneratingInvoice}
                >
                  {isGeneratingInvoice ? (
                    <div className="animate-pulse">Generating...</div>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mb-1" />
                      <span>Generate Invoice</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h2 className="text-md font-semibold mb-2">Pending Requests</h2>
                {pendingPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={{
                      ...patient,
                      lastVisit: undefined,
                    }}
                    onSchedule={handleScheduleAppointment}
                    onViewDocuments={handleViewDocuments}
                    onContact={handleContactPatient}
                    onViewDocument={handleViewDocument}
                    onDownloadDocument={handleDownloadDocument}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
