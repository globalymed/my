
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Pill,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  type: string;
  uploadDate: Date;
  size: string;
  hasSummary?: boolean;
  summary?: string;
}

interface AppointmentCardProps {
  patient: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
    email?: string;
  };
  dateTime: Date;
  type: "video" | "phone" | "in-person";
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
  duration: number; // in minutes
  documents?: Document[];
  onJoin?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDocument?: (docId: string) => void;
  className?: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  patient,
  dateTime,
  type,
  status,
  duration,
  documents = [],
  onJoin,
  onReschedule,
  onCancel,
  onViewDocument,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [prescription, setPrescription] = useState("");
  const [isGeneratingPrescription, setIsGeneratingPrescription] = useState(false);
  const [isSendingPrescription, setIsSendingPrescription] = useState(false);

  const isUpcoming = status === "upcoming";
  const isInProgress = status === "in-progress";
  const isCompleted = status === "completed";
  
  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-doctor-100 text-doctor-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 mr-1" />;
      case "phone":
        return <Phone className="h-4 w-4 mr-1" />;
      default:
        return <Calendar className="h-4 w-4 mr-1" />;
    }
  };

  const handleGeneratePrescription = () => {
    setIsGeneratingPrescription(true);
    // Simulate AI generating a prescription
    setTimeout(() => {
      setPrescription(
        `Prescription for ${patient.name}\nDate: ${new Date().toLocaleDateString()}\n\nMedication: Amoxicillin 500mg\nDosage: 1 tablet three times daily\nDuration: 7 days\n\nMedication: Ibuprofen 400mg\nDosage: 1 tablet as needed for pain\nDuration: 5 days\n\nSpecial instructions: Take with food. Complete the full course of antibiotics.`
      );
      setIsGeneratingPrescription(false);
    }, 1500);
  };

  const handleSendPrescription = () => {
    if (!prescription.trim()) {
      toast.error("Please generate or write a prescription first");
      return;
    }

    setIsSendingPrescription(true);
    // Simulate sending prescription
    setTimeout(() => {
      setIsSendingPrescription(false);
      setIsPrescriptionOpen(false);
      setPrescription("");
      toast.success(`Prescription sent to ${patient.name}`, {
        description: patient.email ? `Email sent to ${patient.email}` : "Patient will be notified",
      });
    }, 1500);
  };

  return (
    <Card className={cn("shadow-sm overflow-hidden card-hover", className)}>
      <div className={cn("h-1", {
        "bg-doctor-500": status === "upcoming",
        "bg-green-500": status === "completed",
        "bg-red-500": status === "cancelled",
        "bg-doctor-600": status === "in-progress",
      })}/>
      <CardContent className="p-4">
        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-doctor-100">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback className="bg-doctor-100 text-doctor-800">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium text-doctor-900">{patient.name}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className={cn("flex items-center text-xs py-0 px-2", getStatusColor())}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center text-xs py-0 px-2 ml-2 bg-gray-100 text-gray-700">
                    {getTypeIcon()}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{dateTime.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            {isUpcoming ? (
              <span>Starts {formatDistanceToNow(dateTime, { addSuffix: true })}</span>
            ) : isInProgress ? (
              <span className="text-doctor-600 font-medium">In progress</span>
            ) : (
              <span>{duration} min appointment</span>
            )}
          </div>

          <CollapsibleContent className="mt-4 space-y-3">
            {documents && documents.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-doctor-800">Patient Documents</h4>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-gray-50 p-2 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-doctor-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.uploadDate.toLocaleDateString()} · {doc.size}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => onViewDocument && onViewDocument(doc.id)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents available</p>
            )}

            {documents && documents.some(doc => doc.hasSummary) && (
              <div className="bg-doctor-50 p-3 rounded-md border border-doctor-100">
                <h4 className="text-sm font-medium text-doctor-800">AI Document Summary</h4>
                <p className="mt-1 text-sm text-doctor-700">
                  {documents.find(doc => doc.summary)?.summary || 
                   "Patient records show normal vital signs with mild symptoms of seasonal allergies. Medical history indicates no major concerns."}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-doctor-50 border-doctor-200 text-doctor-700 hover:bg-doctor-100"
                  >
                    <Pill className="h-4 w-4 mr-2" />
                    E-Prescription
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Generate E-Prescription</DialogTitle>
                    <DialogDescription>
                      Create and send an e-prescription to {patient.name}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <Textarea
                      placeholder="Enter prescription details..."
                      className="min-h-[150px]"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                    />
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={handleGeneratePrescription}
                        disabled={isGeneratingPrescription}
                      >
                        {isGeneratingPrescription ? "Generating..." : "Generate with AI"}
                      </Button>
                      
                      <Button 
                        onClick={handleSendPrescription}
                        disabled={isSendingPrescription || !prescription.trim()}
                        className="bg-doctor-500 hover:bg-doctor-600"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSendingPrescription ? "Sending..." : "Send to Patient"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-doctor-50 border-doctor-200 text-doctor-700 hover:bg-doctor-100"
                onClick={() => toast.info("Opening patient chat", { description: `Starting chat with context for ${patient.name}` })}
              >
                Ask AI about patient
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      
      {(isUpcoming || isInProgress) && (
        <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between">
          {isInProgress && (
            <Button className="w-full" onClick={onJoin}>
              <Video className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          )}
          
          {isUpcoming && (
            <>
              <Button variant="ghost" size="sm" onClick={onReschedule}>
                Reschedule
              </Button>
              {type === "video" && (
                <Button className="bg-doctor-500 hover:bg-doctor-600" size="sm" onClick={onJoin}>
                  <Video className="h-4 w-4 mr-2" />
                  Start Early
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
