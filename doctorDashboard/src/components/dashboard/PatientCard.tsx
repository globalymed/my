
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarPlus, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  ChevronDown,
  ChevronUp,
  Bot,
  MessageCircle,
  Download,
  Eye
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  type: string;
  uploadDate: Date;
  size: string;
  hasSummary: boolean;
}

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    avatar?: string;
    initials: string;
    email: string;
    phone: string;
    lastVisit?: Date;
    status: "active" | "pending" | "inactive";
    documentsCount: number;
    documents?: Document[];
  };
  onSchedule: (patientId: string) => void;
  onViewDocuments: (patientId: string) => void;
  onContact: (patientId: string, method: "email" | "phone") => void;
  onViewDocument?: (docId: string) => void;
  onDownloadDocument?: (docId: string) => void;
  className?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onSchedule,
  onViewDocuments,
  onContact,
  onViewDocument,
  onDownloadDocument,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (patient.status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDocumentIcon = (documentType: string) => {
    switch (documentType.toLowerCase()) {
      case "pdf":
        return "📄";
      case "image":
      case "jpg":
      case "png":
        return "🖼️";
      case "doc":
      case "docx":
        return "📝";
      default:
        return "📄";
    }
  };

  const handleViewSummary = (document: Document) => {
    setSelectedDocument(document);
    setSummaryDialogOpen(true);
  };

  const handleChatWithContext = () => {
    navigate(`/chat?patientId=${patient.id}`);
  };

  return (
    <Card className={cn("shadow-sm overflow-hidden card-hover", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border border-doctor-100">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback className="bg-doctor-100 text-doctor-800">
                {patient.initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="font-medium text-doctor-900">{patient.name}</h3>
              <Badge variant="outline" className={cn("text-xs py-0 px-2 mt-1", getStatusColor())}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-doctor-600 h-8 w-8"
              onClick={() => onContact(patient.id, "email")}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-doctor-600 h-8 w-8 ml-1"
              onClick={() => onContact(patient.id, "phone")}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              <span className="truncate max-w-[180px]">{patient.email}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              <span>{patient.phone}</span>
            </div>
          </div>
          {patient.lastVisit && (
            <div className="flex justify-between items-center">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>Last visit: {patient.lastVisit.toLocaleDateString()}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-muted-foreground">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              <span>{patient.documentsCount} documents</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDocuments(patient.id)}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Documents
          </Button>
          <Button 
            className="flex-1 bg-doctor-500 hover:bg-doctor-600" 
            size="sm"
            onClick={() => onSchedule(patient.id)}
          >
            <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
            Schedule
          </Button>
        </div>

        <Collapsible
          open={isExpanded}
          onOpenChange={setIsExpanded}
          className="mt-4 pt-2 border-t"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full -mt-1 flex items-center justify-center gap-1">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" /> 
                  <span>Hide details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> 
                  <span>Show documents</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-3">
            {patient.documents && patient.documents.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-doctor-800">Patient Documents</h4>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-doctor-600 h-7 p-0"
                    onClick={handleChatWithContext}
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                    Ask AI about patient
                  </Button>
                </div>
                <div className="space-y-2">
                  {patient.documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded bg-doctor-50 flex items-center justify-center text-base">
                          {getDocumentIcon(document.type)}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium truncate max-w-[150px]">{document.title}</p>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(document.uploadDate, { addSuffix: true })}
                            </span>
                            <span className="mx-1 text-muted-foreground">•</span>
                            <Badge variant="outline" className="text-xs py-0 px-1 bg-gray-100 text-gray-600 uppercase">
                              {document.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {document.hasSummary && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 text-doctor-600 border-doctor-200"
                                  onClick={() => handleViewSummary(document)}
                                >
                                  <Bot className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View AI summary</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {onViewDocument && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => onViewDocument(document.id)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View document</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {onDownloadDocument && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => onDownloadDocument(document.id)}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">No documents available</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* AI Summary Dialog */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-doctor-600" />
              AI Summary
            </DialogTitle>
            <DialogDescription>
              {selectedDocument && (
                <span>
                  <span className="font-medium">{selectedDocument.title}</span> - uploaded for {patient.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {selectedDocument && (
              <div className="space-y-4">
                <div className="bg-doctor-50 p-4 rounded-lg">
                  <h3 className="font-medium text-doctor-800 mb-2">Key Findings</h3>
                  <ul className="list-disc pl-5 space-y-1 text-doctor-700">
                    <li>Normal blood count levels within reference ranges</li>
                    <li>Slight elevation in cholesterol (5.8 mmol/L, ref: &lt;5.2)</li>
                    <li>Vitamin D deficiency detected (42 nmol/L, ref: &gt;50)</li>
                    <li>Liver function tests normal</li>
                    <li>Kidney function tests normal</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-doctor-800 mb-2">Summary</h3>
                  <p className="text-muted-foreground">
                    This comprehensive blood panel shows overall good health with two areas of concern: 
                    a mild elevation in total cholesterol and a vitamin D deficiency. The cholesterol 
                    level is 5.8 mmol/L (reference range &lt;5.2 mmol/L), which indicates a slight 
                    cardiovascular risk factor. The vitamin D level is 42 nmol/L (reference range &gt;50 nmol/L), 
                    indicating a deficiency that may contribute to decreased calcium absorption and potential
                    bone health issues. All other parameters including complete blood count, liver function,
                    kidney function, and electrolytes are within normal limits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-doctor-800 mb-2">Recommended Actions</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-doctor-700">
                    <li>Dietary counseling for cholesterol management</li>
                    <li>Vitamin D supplementation (1000-2000 IU daily)</li>
                    <li>Follow-up lipid panel in 3 months</li>
                    <li>Recheck vitamin D levels in 3 months</li>
                  </ol>
                </div>
                
                <div className="bg-doctor-50/50 p-4 rounded-lg">
                  <h3 className="font-medium text-doctor-800 mb-2">Patient History Context</h3>
                  <p className="text-sm text-muted-foreground">
                    This patient has a family history of cardiovascular disease and previously reported
                    fatigue and muscle weakness, which may be related to the vitamin D deficiency.
                    The patient's last lipid panel (8 months ago) showed borderline cholesterol levels
                    of 5.1 mmol/L, indicating a slight increase over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientCard;
