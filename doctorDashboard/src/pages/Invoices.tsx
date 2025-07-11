import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  Plus,
  Download,
  CreditCard,
  Calendar,
  ChevronDown,
  Circle,
  Check,
  XCircle,
  Filter,
  SlidersHorizontal,
  Clock,
  Trash,
  PrinterIcon
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: "INV-001",
    patient: {
      id: "p1",
      name: "John Smith",
      initials: "JS",
    },
    amount: 150.00,
    issued: new Date(2023, 5, 15),
    due: new Date(2023, 6, 15),
    status: "paid",
    items: [
      { description: "Initial Consultation", amount: 100.00 },
      { description: "Lab Work", amount: 50.00 },
    ],
  },
  {
    id: "INV-002",
    patient: {
      id: "p2",
      name: "Emily Johnson",
      initials: "EJ",
    },
    amount: 75.00,
    issued: new Date(2023, 5, 18),
    due: new Date(2023, 6, 18),
    status: "pending",
    items: [
      { description: "Follow-up Appointment", amount: 75.00 },
    ],
  },
  {
    id: "INV-003",
    patient: {
      id: "p3",
      name: "Michael Brown",
      initials: "MB",
    },
    amount: 225.00,
    issued: new Date(2023, 5, 20),
    due: new Date(2023, 6, 20),
    status: "overdue",
    items: [
      { description: "Emergency Consultation", amount: 150.00 },
      { description: "Medication", amount: 75.00 },
    ],
  },
  {
    id: "INV-004",
    patient: {
      id: "p4",
      name: "Sarah Wilson",
      initials: "SW",
    },
    amount: 180.00,
    issued: new Date(2023, 5, 22),
    due: new Date(2023, 6, 22),
    status: "draft",
    items: [
      { description: "Specialist Consultation", amount: 180.00 },
    ],
  },
  {
    id: "INV-005",
    patient: {
      id: "p4",
      name: "Sarah Wilson",
      initials: "SW",
    },
    amount: 50.00,
    issued: new Date(2023, 5, 25),
    due: new Date(2023, 6, 25),
    status: "paid",
    items: [
      { description: "Prescription Refill", amount: 50.00 },
    ],
  },
  {
    id: "INV-006",
    patient: {
      id: "p5",
      name: "Robert Davis",
      initials: "RD",
    },
    amount: 125.00,
    issued: new Date(2023, 5, 27),
    due: new Date(2023, 6, 27),
    status: "pending",
    items: [
      { description: "Routine Check-up", amount: 75.00 },
      { description: "Blood Test", amount: 50.00 },
    ],
  },
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "overdue":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case "draft":
        return <Circle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Circle className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const handleViewDetails = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setDetailsDialogOpen(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success("Invoice downloaded", {
      description: `Invoice ${invoiceId} has been downloaded.`,
    });
  };

  const handleDeleteInvoice = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      toast.success("Invoice deleted", {
        description: `Invoice ${selectedInvoice.id} has been deleted.`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast.success("Printing invoice", {
      description: `Invoice ${invoiceId} is being sent to the printer.`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast.success("Invoice sent", {
      description: `Invoice ${invoiceId} has been sent to the patient via email.`,
    });
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (
      searchTerm &&
      !invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !invoice.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (currentTab !== "all" && invoice.status !== currentTab) {
      return false;
    }

    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Invoices</h1>
          </div>
          <Button className="bg-doctor-500 hover:bg-doctor-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="gap-2">
                <Check className="h-4 w-4" />
                <span>Date: Newest first</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <span className="w-4" />
                <span>Date: Oldest first</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <span className="w-4" />
                <span>Amount: High to low</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <span className="w-4" />
                <span>Amount: Low to high</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center mb-2 sm:mb-0">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={undefined} alt={invoice.patient.name} />
                            <AvatarFallback className="bg-doctor-100 text-doctor-800">
                              {invoice.patient.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{invoice.patient.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{invoice.id}</span>
                              <span className="mx-1.5">•</span>
                              <Badge
                                variant="outline"
                                className={cn("text-xs py-0 px-2", getStatusColor(invoice.status))}
                              >
                                <div className="flex items-center">
                                  {getStatusIcon(invoice.status)}
                                  <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end mb-2 sm:mb-0">
                          <div className="text-lg font-semibold">${invoice.amount.toFixed(2)}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Due {format(invoice.due, "MMM d, yyyy")}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePrintInvoice(invoice.id)}
                          >
                            <PrinterIcon className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                                Send to patient
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintInvoice(invoice.id)}>
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteInvoice(invoice)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
                      <p className="mt-2 text-muted-foreground">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Create an invoice to get started"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Invoice {selectedInvoice?.id}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs py-0.5 px-2",
                    selectedInvoice && getStatusColor(selectedInvoice.status)
                  )}
                >
                  {selectedInvoice && (
                    <div className="flex items-center">
                      {getStatusIcon(selectedInvoice.status)}
                      <span>
                        {selectedInvoice.status.charAt(0).toUpperCase() +
                          selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                  )}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedInvoice && (
                  <div className="flex items-center mt-1">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarFallback className="bg-doctor-100 text-doctor-800 text-xs">
                        {selectedInvoice.patient.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedInvoice.patient.name}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Issue Date</div>
                    <div>{format(selectedInvoice.issued, "MMMM d, yyyy")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Due Date</div>
                    <div>{format(selectedInvoice.due, "MMMM d, yyyy")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">From</div>
                    <div>Dr. Sarah Johnson</div>
                    <div>Riverside Medical Clinic</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">To</div>
                    <div>{selectedInvoice.patient.name}</div>
                    <div>Patient ID: {selectedInvoice.patient.id}</div>
                  </div>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-3 text-right">Quantity</div>
                    <div className="col-span-3 text-right">Amount</div>
                  </div>
                  <div className="divide-y">
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 p-3 text-sm">
                        <div className="col-span-6">{item.description}</div>
                        <div className="col-span-3 text-right">1</div>
                        <div className="col-span-3 text-right">${item.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-12 p-3 text-sm font-medium bg-gray-50">
                    <div className="col-span-9 text-right">Total</div>
                    <div className="col-span-3 text-right">${selectedInvoice.amount.toFixed(2)}</div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="notes">
                    <AccordionTrigger className="text-sm">Notes</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      This invoice covers services provided during your recent visit. Please contact
                      our billing department if you have any questions about this invoice.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="payment">
                    <AccordionTrigger className="text-sm">Payment Information</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <div className="space-y-2">
                        <div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-muted-foreground">
                            Bank: National Bank
                            <br />
                            Account Name: Riverside Medical Clinic
                            <br />
                            Account Number: XXXX-XXXX-XXXX-1234
                            <br />
                            Routing Number: XXX-XXX-XXX
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Online Payment</div>
                          <div className="text-muted-foreground">
                            Please visit our patient portal to pay online.
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => selectedInvoice && handleDeleteInvoice(selectedInvoice)}
              >
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice.id)}
              >
                <PrinterIcon className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => selectedInvoice && handleDownloadInvoice(selectedInvoice.id)}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button
                className="flex-1 gap-1 bg-doctor-500 hover:bg-doctor-600"
                onClick={() => selectedInvoice && handleSendInvoice(selectedInvoice.id)}
              >
                <FileText className="h-4 w-4" />
                <span>Send to Patient</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Invoice</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete invoice {selectedInvoice?.id} for{" "}
                {selectedInvoice?.patient.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="flex-1"
              >
                Delete Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
