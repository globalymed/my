
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { format, subDays, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  BarChart3,
  Search,
  Plus,
  ArrowRight,
  AlertCircle,
  Percent,
  CreditCard,
  PiggyBank,
  ListFilter,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

// Mock data for completed appointments
const completedAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    patientId: "PT001",
    date: new Date(2023, 6, 10, 10, 0),
    appointmentType: "Video Consultation",
    duration: 30,
    fee: 150.00,
    commission: 30.00, // 20% commission
    netAmount: 120.00,
    paymentStatus: "paid",
    invoiceStatus: "ready",
    selected: false,
  },
  {
    id: "2",
    patientName: "Emily Johnson",
    patientId: "PT002",
    date: new Date(2023, 6, 11, 11, 30),
    appointmentType: "Phone Consultation",
    duration: 15,
    fee: 75.00,
    commission: 15.00, // 20% commission
    netAmount: 60.00,
    paymentStatus: "paid",
    invoiceStatus: "ready",
    selected: false,
  },
  {
    id: "3",
    patientName: "Michael Brown",
    patientId: "PT003",
    date: new Date(2023, 6, 12, 14, 0),
    appointmentType: "In-Person Visit",
    duration: 45,
    fee: 225.00,
    commission: 45.00, // 20% commission
    netAmount: 180.00,
    paymentStatus: "pending",
    invoiceStatus: "pending",
    selected: false,
  },
  {
    id: "4",
    patientName: "Sarah Wilson",
    patientId: "PT004",
    date: new Date(2023, 6, 13, 9, 0),
    appointmentType: "Video Consultation",
    duration: 30,
    fee: 150.00,
    commission: 30.00, // 20% commission
    netAmount: 120.00,
    paymentStatus: "paid",
    invoiceStatus: "ready",
    selected: false,
  },
  {
    id: "5",
    patientName: "Robert Davis",
    patientId: "PT005",
    date: new Date(2023, 6, 13, 14, 30),
    appointmentType: "Phone Consultation",
    duration: 15,
    fee: 75.00,
    commission: 15.00, // 20% commission
    netAmount: 60.00,
    paymentStatus: "paid",
    invoiceStatus: "ready",
    selected: false,
  },
  {
    id: "6",
    patientName: "Jennifer Lee",
    patientId: "PT006",
    date: new Date(2023, 6, 14, 11, 0),
    appointmentType: "In-Person Visit",
    duration: 60,
    fee: 300.00,
    commission: 60.00, // 20% commission
    netAmount: 240.00,
    paymentStatus: "paid",
    invoiceStatus: "invoiced",
    invoiceId: "INV-001",
    selected: false,
  },
  {
    id: "7",
    patientName: "William Martinez",
    patientId: "PT007",
    date: new Date(2023, 6, 15, 15, 0),
    appointmentType: "Video Consultation",
    duration: 30,
    fee: 150.00,
    commission: 30.00, // 20% commission
    netAmount: 120.00,
    paymentStatus: "pending",
    invoiceStatus: "pending",
    selected: false,
  },
];

// Mock data for invoices
const invoices = [
  {
    id: "INV-001",
    dateGenerated: new Date(2023, 6, 15),
    dateApproved: new Date(2023, 6, 16),
    appointmentsCount: 3,
    totalAmount: 525.00,
    commission: 105.00,
    netAmount: 420.00,
    status: "paid",
    paymentDate: new Date(2023, 6, 17),
  },
  {
    id: "INV-002",
    dateGenerated: new Date(2023, 6, 8),
    dateApproved: new Date(2023, 6, 9),
    appointmentsCount: 4,
    totalAmount: 600.00,
    commission: 120.00,
    netAmount: 480.00,
    status: "paid",
    paymentDate: new Date(2023, 6, 10),
  },
  {
    id: "INV-003",
    dateGenerated: new Date(2023, 6, 1),
    dateApproved: new Date(2023, 6, 2),
    appointmentsCount: 2,
    totalAmount: 375.00,
    commission: 75.00,
    netAmount: 300.00,
    status: "pending",
    paymentDate: null,
  },
];

const Payouts = () => {
  const [currentTab, setCurrentTab] = useState("appointments");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceDetailDialogOpen, setInvoiceDetailDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  // Stats calculations
  const totalEarnings = completedAppointments
    .filter(app => app.paymentStatus === "paid")
    .reduce((sum, app) => sum + app.fee, 0);
  
  const totalCommission = completedAppointments
    .filter(app => app.paymentStatus === "paid")
    .reduce((sum, app) => sum + app.commission, 0);
  
  const netPayout = totalEarnings - totalCommission;
  
  const pendingAmount = completedAppointments
    .filter(app => app.paymentStatus === "pending")
    .reduce((sum, app) => sum + app.fee, 0);

  const readyToInvoice = completedAppointments
    .filter(app => app.invoiceStatus === "ready")
    .length;

  // Filter appointments
  const filteredAppointments = completedAppointments.filter(appointment => {
    // Filter by search term
    if (
      searchTerm &&
      !appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !appointment.appointmentType.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by payment status
    if (paymentStatusFilter !== "all" && appointment.paymentStatus !== paymentStatusFilter) {
      return false;
    }
    
    // Filter by appointment type
    if (
      appointmentTypeFilter !== "all" &&
      !appointment.appointmentType.toLowerCase().includes(appointmentTypeFilter.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by date range
    if (date?.from && appointment.date < date.from) {
      return false;
    }
    
    if (date?.to) {
      const endDate = new Date(date.to);
      endDate.setHours(23, 59, 59, 999);
      if (appointment.date > endDate) {
        return false;
      }
    }
    
    return true;
  });

  // Toggle appointment selection
  const toggleAppointmentSelection = (appointmentId: string) => {
    if (selectedAppointments.includes(appointmentId)) {
      setSelectedAppointments(selectedAppointments.filter(id => id !== appointmentId));
    } else {
      // Only allow selecting appointments that are ready for invoice
      const appointment = completedAppointments.find(app => app.id === appointmentId);
      if (appointment && appointment.invoiceStatus === "ready") {
        setSelectedAppointments([...selectedAppointments, appointmentId]);
      } else {
        toast.error("Cannot select this appointment", {
          description: "Only appointments with paid status can be selected for invoicing",
        });
      }
    }
  };

  // Toggle select all appointments
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedAppointments([]);
    } else {
      const eligibleAppointments = filteredAppointments
        .filter(app => app.invoiceStatus === "ready")
        .map(app => app.id);
      setSelectedAppointments(eligibleAppointments);
    }
    setSelectAll(!selectAll);
  };

  // Handle generate invoice
  const handleGenerateInvoice = () => {
    if (selectedAppointments.length === 0) {
      toast.error("No appointments selected", {
        description: "Please select at least one appointment to generate an invoice.",
      });
      return;
    }
    
    setInvoiceDialogOpen(true);
  };

  // Confirm invoice generation
  const confirmInvoiceGeneration = () => {
    toast.success("Invoice generated successfully", {
      description: "Your invoice has been sent to Mediyatra for approval.",
    });
    setInvoiceDialogOpen(false);
    setSelectedAppointments([]);
    setSelectAll(false);
  };

  // View invoice details
  const viewInvoiceDetails = (invoice: typeof invoices[0]) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailDialogOpen(true);
  };

  // Download invoice
  const downloadInvoice = (invoiceId: string) => {
    toast.success("Invoice downloaded", {
      description: `Invoice ${invoiceId} has been downloaded.`,
    });
  };

  // Get payment status color and icon
  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
        };
      case "pending":
        return {
          color: "bg-amber-100 text-amber-700",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        };
    }
  };

  // Get invoice status color and icon
  const getInvoiceStatusInfo = (status: string) => {
    switch (status) {
      case "ready":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
        };
      case "pending":
        return {
          color: "bg-amber-100 text-amber-700",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
        };
      case "invoiced":
        return {
          color: "bg-purple-100 text-purple-700",
          icon: <FileText className="h-3.5 w-3.5 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-doctor-600" />
            <h1 className="text-2xl font-semibold">Doctor Payouts</h1>
          </div>
          <Button 
            className="bg-doctor-500 hover:bg-doctor-600"
            onClick={handleGenerateInvoice}
            disabled={selectedAppointments.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Earnings"
            value={`$${totalEarnings.toFixed(2)}`}
            icon={<DollarSign className="h-6 w-6" />}
            description="Before commission"
          />
          <StatsCard
            title="Mediyatra Commission"
            value={`$${totalCommission.toFixed(2)}`}
            icon={<Percent className="h-6 w-6" />}
            description="20% of total earnings"
          />
          <StatsCard
            title="Net Payout"
            value={`$${netPayout.toFixed(2)}`}
            icon={<CreditCard className="h-6 w-6" />}
            description="After commission"
          />
          <StatsCard
            title="Pending Payments"
            value={`$${pendingAmount.toFixed(2)}`}
            icon={<PiggyBank className="h-6 w-6" />}
            description={`${readyToInvoice} appointments ready for invoice`}
          />
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="invoices">Invoice History</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={paymentStatusFilter}
                onValueChange={setPaymentStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={appointmentTypeFilter}
                onValueChange={setAppointmentTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Appointment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video Consultation</SelectItem>
                  <SelectItem value="phone">Phone Consultation</SelectItem>
                  <SelectItem value="in-person">In-Person Visit</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full sm:w-[240px]",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(date.from, "MMM d, yyyy")
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Appointments Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={toggleSelectAll}
                          disabled={!filteredAppointments.some(app => app.invoiceStatus === "ready")}
                        />
                      </TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Invoice Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => {
                        const paymentStatus = getPaymentStatusInfo(appointment.paymentStatus);
                        const invoiceStatus = getInvoiceStatusInfo(appointment.invoiceStatus);
                        const isSelectable = appointment.invoiceStatus === "ready";
                        
                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedAppointments.includes(appointment.id)}
                                onCheckedChange={() => toggleAppointmentSelection(appointment.id)}
                                disabled={!isSelectable}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{appointment.patientName}</div>
                              <div className="text-xs text-muted-foreground">ID: {appointment.patientId}</div>
                            </TableCell>
                            <TableCell>
                              {format(appointment.date, "MMM d, yyyy")}
                              <div className="text-xs text-muted-foreground">
                                {format(appointment.date, "h:mm a")}
                              </div>
                            </TableCell>
                            <TableCell>{appointment.appointmentType}</TableCell>
                            <TableCell>{appointment.duration} min</TableCell>
                            <TableCell className="text-right font-medium">
                              ${appointment.fee.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ${appointment.commission.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${appointment.netAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", paymentStatus.color)}
                              >
                                <div className="flex items-center">
                                  {paymentStatus.icon}
                                  {appointment.paymentStatus.charAt(0).toUpperCase() + 
                                    appointment.paymentStatus.slice(1)}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", invoiceStatus.color)}
                              >
                                <div className="flex items-center">
                                  {invoiceStatus.icon}
                                  {appointment.invoiceStatus === "ready" ? "Ready" : 
                                   appointment.invoiceStatus.charAt(0).toUpperCase() + 
                                   appointment.invoiceStatus.slice(1)}
                                </div>
                              </Badge>
                              {appointment.invoiceId && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {appointment.invoiceId}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Appointments</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const statusInfo = getPaymentStatusInfo(invoice.status);
                      
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{format(invoice.dateGenerated, "MMM d, yyyy")}</TableCell>
                          <TableCell>{invoice.appointmentsCount}</TableCell>
                          <TableCell className="text-right">${invoice.totalAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            ${invoice.commission.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${invoice.netAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", statusInfo.color)}
                            >
                              <div className="flex items-center">
                                {statusInfo.icon}
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </div>
                            </Badge>
                            {invoice.paymentDate && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Paid on {format(invoice.paymentDate, "MMM d, yyyy")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewInvoiceDetails(invoice)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadInvoice(invoice.id)}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generate Invoice Dialog */}
        <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
              <DialogDescription>
                You are about to generate an invoice for {selectedAppointments.length} appointment(s).
                This will be sent to Mediyatra for approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="border rounded-md p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Fees:</span>
                  <span className="font-medium">
                    ${completedAppointments
                      .filter(app => selectedAppointments.includes(app.id))
                      .reduce((sum, app) => sum + app.fee, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mediyatra Commission (20%):</span>
                  <span className="text-red-600">
                    -${completedAppointments
                      .filter(app => selectedAppointments.includes(app.id))
                      .reduce((sum, app) => sum + app.commission, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Net Payout:</span>
                  <span>
                    ${completedAppointments
                      .filter(app => selectedAppointments.includes(app.id))
                      .reduce((sum, app) => sum + app.netAmount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-doctor-500 hover:bg-doctor-600"
                onClick={confirmInvoiceGeneration}
              >
                Generate Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invoice Details Dialog */}
        <Dialog open={invoiceDetailDialogOpen} onOpenChange={setInvoiceDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Invoice {selectedInvoice.id}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs py-0.5 px-2",
                        getPaymentStatusInfo(selectedInvoice.status).color
                      )}
                    >
                      <div className="flex items-center">
                        {getPaymentStatusInfo(selectedInvoice.status).icon}
                        <span>
                          {selectedInvoice.status.charAt(0).toUpperCase() +
                            selectedInvoice.status.slice(1)}
                        </span>
                      </div>
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Generated on {format(selectedInvoice.dateGenerated, "MMMM d, yyyy")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 my-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Invoice Number</div>
                      <div className="font-medium">{selectedInvoice.id}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium">
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Generated On</div>
                      <div>{format(selectedInvoice.dateGenerated, "MMMM d, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Approved On</div>
                      <div>{format(selectedInvoice.dateApproved, "MMMM d, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Payment Date</div>
                      <div>
                        {selectedInvoice.paymentDate
                          ? format(selectedInvoice.paymentDate, "MMMM d, yyyy")
                          : "Pending"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Appointments Count</div>
                      <div>{selectedInvoice.appointmentsCount}</div>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-right">Count</div>
                      <div className="col-span-4 text-right">Amount</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-12 p-3 text-sm">
                        <div className="col-span-6">Total Appointment Fees</div>
                        <div className="col-span-2 text-right">{selectedInvoice.appointmentsCount}</div>
                        <div className="col-span-4 text-right">${selectedInvoice.totalAmount.toFixed(2)}</div>
                      </div>
                      <div className="grid grid-cols-12 p-3 text-sm text-red-600">
                        <div className="col-span-6">Mediyatra Commission (20%)</div>
                        <div className="col-span-2 text-right"></div>
                        <div className="col-span-4 text-right">-${selectedInvoice.commission.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 p-3 text-sm font-medium bg-gray-50">
                      <div className="col-span-8 text-right">Net Payout</div>
                      <div className="col-span-4 text-right">${selectedInvoice.netAmount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Payment Information</h4>
                    <p className="text-muted-foreground mb-2">
                      Payment will be processed to your registered bank account within 2-3 business days
                      after approval.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Bank:</span> National Bank
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account:</span> XXXX-XXXX-1234
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => downloadInvoice(selectedInvoice.id)}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button
                    className="flex-1 gap-1 bg-doctor-500 hover:bg-doctor-600"
                    onClick={() => setInvoiceDetailDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Payouts;
