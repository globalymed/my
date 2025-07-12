
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentCard from "@/components/dashboard/DocumentCard";
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
import { 
  Search, 
  FileText, 
  Upload,
  Bot
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data
const documents = [
  {
    id: "d1",
    title: "Blood Test Results.pdf",
    type: "pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    size: "2.4 MB",
    hasSummary: true,
    category: "lab",
    patient: {
      id: "p1",
      name: "John Smith",
      initials: "JS",
    },
  },
  {
    id: "d2",
    title: "X-Ray Scan.jpg",
    type: "image",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    size: "3.8 MB",
    hasSummary: true,
    category: "imaging",
    patient: {
      id: "p2",
      name: "Emily Johnson",
      initials: "EJ",
    },
  },
  {
    id: "d3",
    title: "Medical History.docx",
    type: "doc",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    size: "1.2 MB",
    hasSummary: false,
    category: "records",
    patient: {
      id: "p3",
      name: "Michael Brown",
      initials: "MB",
    },
  },
  {
    id: "d4",
    title: "Prescription.pdf",
    type: "pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    size: "0.8 MB",
    hasSummary: true,
    category: "prescriptions",
    patient: {
      id: "p1",
      name: "John Smith",
      initials: "JS",
    },
  },
  {
    id: "d5",
    title: "MRI Results.jpg",
    type: "image",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    size: "5.2 MB",
    hasSummary: true,
    category: "imaging",
    patient: {
      id: "p4",
      name: "Sarah Wilson",
      initials: "SW",
    },
  },
  {
    id: "d6",
    title: "Insurance Form.pdf",
    type: "pdf",
    uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    size: "1.6 MB",
    hasSummary: false,
    category: "records",
    patient: {
      id: "p5",
      name: "Robert Davis",
      initials: "RD",
    },
  },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<typeof documents[0] | null>(null);

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

  const handleViewSummary = (docId: string) => {
    const document = documents.find(doc => doc.id === docId);
    if (document) {
      setSelectedDocument(document);
      setSummaryDialogOpen(true);
    }
  };

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((document) => {
      // Filter by search term
      if (searchTerm && !document.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by tab
      if (currentTab !== "all" && document.category !== currentTab) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort documents
      switch (sortBy) {
        case "recent":
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case "oldest":
          return a.uploadDate.getTime() - b.uploadDate.getTime();
        case "nameAsc":
          return a.title.localeCompare(b.title);
        case "nameDesc":
          return b.title.localeCompare(a.title);
        case "sizeDesc":
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Documents</h1>
          </div>
          <Button className="bg-doctor-500 hover:bg-doctor-600">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
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
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
              <SelectItem value="sizeDesc">Size (Largest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onView={handleViewDocument}
                    onDownload={handleDownloadDocument}
                    onViewSummary={document.hasSummary ? handleViewSummary : undefined}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchTerm 
                      ? "Try adjusting your search terms"
                      : "Upload a document to get started"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
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
                    <span className="font-medium">{selectedDocument.title}</span> - uploaded by {selectedDocument.patient.name}
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
      </div>
    </DashboardLayout>
  );
};

export default Documents;
