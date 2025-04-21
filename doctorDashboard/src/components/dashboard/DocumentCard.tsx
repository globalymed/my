
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Download, 
  Eye, 
  Bot,
  Calendar
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    type: string;
    uploadDate: Date;
    size: string;
    hasSummary: boolean;
    patient: {
      id: string;
      name: string;
      avatar?: string;
      initials: string;
    };
  };
  onView: (docId: string) => void;
  onDownload: (docId: string) => void;
  onViewSummary?: (docId: string) => void;
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onViewSummary,
  className,
}) => {
  const getDocumentIcon = () => {
    switch (document.type.toLowerCase()) {
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

  return (
    <Card className={cn("shadow-sm overflow-hidden card-hover", className)}>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded bg-doctor-50 flex items-center justify-center text-xl">
            {getDocumentIcon()}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-doctor-900 truncate max-w-[200px]">{document.title}</h3>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs py-0 px-2 bg-gray-100 text-gray-700 uppercase">
                {document.type}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">{document.size}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center">
          <Avatar className="h-6 w-6 border border-doctor-100">
            <AvatarImage src={document.patient.avatar} alt={document.patient.name} />
            <AvatarFallback className="bg-doctor-100 text-doctor-800 text-xs">
              {document.patient.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm ml-2 text-muted-foreground truncate max-w-[150px]">
            {document.patient.name}
          </span>
        </div>
        
        <div className="mt-2 text-xs flex items-center text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Uploaded {formatDistanceToNow(document.uploadDate, { addSuffix: true })}</span>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onView(document.id)}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onDownload(document.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {document.hasSummary && onViewSummary && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-doctor-600 border-doctor-200"
                    onClick={() => onViewSummary(document.id)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
