import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Avatar,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search,
  Upload,
  Eye,
  Download,
  FileText,
  Image,
  FileSpreadsheet,
  X,
  Bot,
  Activity,
  Pill,
  Camera,
  ClipboardList,
  User,
  HardDrive
} from 'lucide-react';

import {
  Add as Plus,
  Search as SearchIcon,
  FilterList as Filter,
  MoreHoriz as MoreHorizontal,
  Phone as PhoneIcon,
  Videocam as VideoIcon,
  Message as MessageSquare,
  CalendarToday as Calendar,
  AccessTime as Clock,
  CheckCircleOutline as CheckCircleIcon,
  Cancel as CancelIcon,
  Lens as StatusIndicatorIcon,
} from '@mui/icons-material';

// Firebase imports - replace with your actual Firebase config
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from 'firebase/storage';
import { getAllUsers, getAppointmentsByClinicIds, storage, getDoctorById } from '../../../firebase';
import { PriorityHigh, UploadFile } from '@mui/icons-material';

// Custom hook for managing dropdown menus
const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return { anchorEl, open, handleClick, handleClose };
};

// Enhanced Document Viewer Component
const EnhancedDocumentViewer = ({ open, onClose, document }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError(null);
    }
  }, [open, document]);

  const renderDocumentContent = () => {
    if (!document?.previewUrl && !document?.downloadURL) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          flexDirection: 'column',
          gap: 2
        }}>
          <FileText size={48} color="#9CA3AF" />
          <Typography variant="h6" color="text.secondary">
            No preview available
          </Typography>
          {document?.downloadURL && (
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              onClick={() => window.open(document.downloadURL, '_blank')}
              sx={{ mt: 1 }}
            >
              Download to View
            </Button>
          )}
        </Box>
      );
    }

    const fileType = document.type?.toLowerCase();
    const previewUrl = document.previewUrl || document.downloadURL;
    
    switch (fileType) {
      case 'pdf':
        return (
          <iframe
            src={`${previewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={`Preview of ${document.title}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError('Failed to load PDF preview');
              setLoading(false);
            }}
          />
        );

      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
      case 'svg':
        return (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 2,
            position: 'relative'
          }}>
            <img
              src={previewUrl}
              alt={document.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load image preview');
                setLoading(false);
              }}
            />
          </Box>
        );

      case 'txt':
      case 'csv':
        return (
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <iframe
              src={previewUrl}
              title={`Preview of ${document.title}`}
              width="100%"
              height="100%"
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 8,
                backgroundColor: 'white'
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load text preview');
                setLoading(false);
              }}
            />
          </Box>
        );

      case 'xlsx':
      case 'xls':
      case 'ppt':
      case 'pptx':
        // For Office documents (except Word), show a preview placeholder with download option
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2,
            p: 4
          }}>
            {fileType.includes('xl') ? (
              <FileSpreadsheet size={64} color="#4CAF50" />
            ) : (
              <FileText size={64} color="#FF5722" />
            )}
            <Typography variant="h6" color="text.primary" textAlign="center">
              {document.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {fileType.includes('xl') ? 'Excel' : 'PowerPoint'} files require download to view
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={() => {
                  window.open(document.downloadURL || previewUrl, '_blank');
                  setLoading(false);
                }}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<Eye size={16} />}
                onClick={() => {
                  window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}`, '_blank');
                  setLoading(false);
                }}
              >
                View in Google Docs
              </Button>
            </Stack>
          </Box>
        );

      case 'doc':
      case 'docx':
        // For Word documents, provide multiple viewing options with timeout handling
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 3,
            p: 4
          }}>
            <FileText size={64} color="#2196F3" />
            <Typography variant="h6" color="text.primary" textAlign="center">
              {document.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Word document - Choose your preferred viewing method
            </Typography>
            
            <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                onClick={() => {
                  window.open(document.downloadURL || previewUrl, '_blank');
                  setLoading(false);
                }}
                sx={{ py: 1.5 }}
              >
                Download & Open Locally
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Eye size={16} />}
                onClick={() => {
                  // Open Google Docs viewer in new tab with timeout warning
                  const newTab = window.open('about:blank', '_blank');
                  newTab.document.write(`
                    <html>
                      <head><title>Loading Document...</title></head>
                      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h3>Loading document preview...</h3>
                        <p>If this takes too long, please close this tab and download the file instead.</p>
                        <div style="margin: 20px;">
                          <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Tab</button>
                        </div>
                        <script>
                          setTimeout(() => {
                            window.location.href = "https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}";
                          }, 1000);
                        </script>
                      </body>
                    </html>
                  `);
                  setLoading(false);
                }}
                sx={{ py: 1.5 }}
              >
                Quick Preview (May be slow)
              </Button>
              
              <Button
                variant="text"
                startIcon={<Eye size={16} />}
                onClick={() => {
                  // Try Office Online viewer
                  window.open(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`, '_blank');
                  setLoading(false);
                }}
                sx={{ py: 1.5 }}
              >
                Try Office Online Viewer
              </Button>
            </Stack>
            
            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              💡 For best experience, download the file to view it locally
            </Typography>
          </Box>
        );

      default:
        // Fallback for unsupported file types
        setLoading(false);
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <FileText size={48} color="#9CA3AF" />
            <Typography variant="h6" color="text.secondary">
              Preview not supported for .{fileType} files
            </Typography>
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              onClick={() => window.open(document.downloadURL || previewUrl, '_blank')}
              sx={{ mt: 1 }}
            >
              Download File
            </Button>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, height: '90vh' } }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="h6">Document Preview</Typography>
          <Typography variant="body2" color="text.secondary">
            {document?.title} • {document?.size}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {(document?.downloadURL || document?.previewUrl) && (
            <IconButton
              onClick={() => window.open(document.downloadURL || document.previewUrl, '_blank')}
              sx={{ 
                bgcolor: 'success.main', 
                color: 'white',
                '&:hover': { bgcolor: 'success.dark' }
              }}
            >
              <Download size={20} />
            </IconButton>
          )}
          <IconButton
            onClick={onClose}
            sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
          >
            <X size={20} />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers sx={{ height: 'calc(90vh - 120px)', p: 0, position: 'relative' }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.8)',
            zIndex: 1
          }}>
            <CircularProgress size={48} />
          </Box>
        )}
        
        {error ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              onClick={() => window.open(document?.downloadURL || document?.previewUrl, '_blank')}
            >
              Download Instead
            </Button>
          </Box>
        ) : (
          renderDocumentContent()
        )}
      </DialogContent>
    </Dialog>
  );
};

const DoctorDocumentSection = ({ doctor }) => {
  // console.log("Doctor Document Section Rendered for:", doctor);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [size, setSize] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const filterMenu = useMenu();

  const filterOptions = [
    { value: 'all', label: 'All', color: 'action' },
    { value: 'reviewed', label: 'Reviewed', color: '#065F46' },
    { value: 'pending', label: 'Pending', color: '#92400E' },
  ];

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    filterMenu.handleClose();
  };

  // Fetch users from Firebase
  const [users, setUsers] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);

  // Fetch users and appointments when doctor prop changes
  useEffect(() => {
    // console.log("Fetching data for doctor:", doctor);
    const fetchData = async () => {
      if (!doctor || !doctor.id || !doctor.clinicIds || doctor.clinicIds.length === 0) {
        setError("Doctor not specified or no clinics associated.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // Use clinic-based fetching for proper data filtering
        const [fetchedUsers, fetchedAppointments] = await Promise.all([
          getAllUsers(),
          getAppointmentsByClinicIds(doctor.clinicIds)
        ]);
        setUsers(fetchedUsers);
        setAllAppointments(fetchedAppointments);
        // console.log("Fetched Users:", fetchedUsers);
        // console.log("Fetched Appointments for clinics:", doctor.clinicIds, fetchedAppointments);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch patient data.");
      }
    };

    fetchData();
  }, [doctor]);

  // Build patients list from users and appointments
  useEffect(() => {
    if (!users.length || !allAppointments.length) {
      setIsLoading(false);
      return;
    }

    const buildPatientsList = () => {
      const patientMap = new Map();
      const now = new Date();

      allAppointments.forEach((appointment) => {
        const { patientEmail } = appointment;
        if (!patientEmail || patientMap.has(patientEmail)) return;

        const patientUser = users.find((user) => user.email === patientEmail);
        if (!patientUser) return;
        const patientAppointments = allAppointments.filter(appt => appt.patientEmail === patientEmail);
        const lastAppointment = patientAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

        const lastVisit = patientAppointments.filter(appt => new Date(appt.appointmentDate) < now && appt.status === 'completed')
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

        const patientData = {
          id: patientUser.id,
          name: `${patientUser.firstName || ""} ${patientUser.lastName || ""}`.trim(),
          age: patientUser.age || "",
          gender: patientUser.gender || "",
          phone: patientUser.phone || "",
          email: patientUser.email,
          address: [patientUser.city, patientUser.country].filter(Boolean).join(", "),
          lastVisit: lastVisit?.appointmentDate || null,
          condition: lastVisit?.reason || "General Checkup",
          status: lastAppointment?.status === 'cancelled' || lastAppointment?.status === 'completed' ? 'inactive' : 'active'
        };
        patientMap.set(patientEmail, patientData);
      });

      const uniquePatients = Array.from(patientMap.values());
      setPatients(uniquePatients);
      // console.log("Patients List Built:", uniquePatients);
      setIsLoading(false);
    };

    buildPatientsList();
  }, [users, allAppointments]);

  const categories = ["All", "Reports", "Lab Results", "Imaging", "Prescriptions"];

  const categoryMap = {
    "All": "all",
    "Reports": "reports",
    "Lab Results": "results",
    "Imaging": "imaging",
    "Prescriptions": "prescriptions"
  };

  useEffect(() => {
    if (patients.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAllDocuments = async () => {
      setLoading(true);
      setError(null);
      setDocuments([]);

      try {
        const allDocsPromises = patients.map(async (patient) => {
          try {
            // Use the specific Firebase Storage path structure
            const folderRef = ref(storage, `medical-records/${patient.id}`);
            const response = await listAll(folderRef);

            const filePromises = response.items.map(async (itemRef) => {
              try {
                const [url, metadata] = await Promise.all([
                  getDownloadURL(itemRef),
                  getMetadata(itemRef),
                ]);

                // Get current date for this month calculations
                const currentDate = new Date();
                const fileDate = new Date(metadata.timeCreated);
                
                return {
                  id: itemRef.fullPath,
                  title: metadata.name,
                  size: (metadata.size / 1024).toFixed(1) + ' KB',
                  rawSize: metadata.size,
                  contentType: metadata.contentType,
                  created: metadata.timeCreated,
                  updated: metadata.updated,
                  downloadURL: url,
                  previewUrl: url,
                  category: metadata?.customMetadata?.category || 'Medical',
                  status: metadata?.customMetadata?.status || "Reviewed", // Default to reviewed
                  patient: patient.name,
                  patientId: patient.id,
                  type: metadata.name.split('.').pop(),
                  aiSummary: { overview: "AI Summary placeholder" },
                  // Add fields for accurate stat calculations
                  isThisMonth: fileDate.getMonth() === currentDate.getMonth() && 
                              fileDate.getFullYear() === currentDate.getFullYear(),
                  updatedAt: metadata.updated || metadata.timeCreated
                };
              } catch (fileError) {
                console.error(`Error processing file ${itemRef.name}:`, fileError);
                return null; // Skip this file if there's an error
              }
            });

            console.log(`Fetching documents for patient: ${patient.name} (${patient.id})`);
            console.log(`Found ${response.items.length} documents in folder: ${folderRef.fullPath}`);
            
            const patientDocs = await Promise.all(filePromises);
            return patientDocs.filter(doc => doc !== null); // Filter out failed files
          } catch (patientError) {
            console.error(`Error fetching documents for patient ${patient.id}:`, patientError);
            return []; // Return empty array for this patient if folder doesn't exist or error
          }
        });

        const nestedDocsArray = await Promise.all(allDocsPromises);
        const allDocs = nestedDocsArray.flat();

        console.log(`Total documents fetched: ${allDocs.length}`);

        // Calculate the total size by summing the rawSize of each document
        const totalSizeInBytes = allDocs.reduce((acc, doc) => acc + (doc.rawSize || 0), 0);
        setSize(totalSizeInBytes);

        setDocuments(allDocs);
        console.log(`Fetched a total of ${allDocs.length} documents.`);
        console.log(`Total storage used: ${(totalSizeInBytes / (1024 * 1024)).toFixed(2)} MB`);

      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch some or all patient documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, [patients]);

  const getDocumentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FileText size={24} style={{ color: '#f44336' }} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet size={24} style={{ color: '#4caf50' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
      case 'svg':
        return <Image size={24} style={{ color: '#2196f3' }} />;
      default:
        return <FileText size={24} style={{ color: '#757575' }} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reports':
        return <ClipboardList size={40} style={{ color: '#2196f3' }} />;
      case 'results':
        return <Activity size={40} style={{ color: '#4caf50' }} />;
      case 'imaging':
        return <Camera size={40} style={{ color: '#ff9800' }} />;
      case 'prescriptions':
        return <Pill size={40} style={{ color: '#9c27b0' }} />;
      default:
        return <FileText size={40} style={{ color: '#757575' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" ||
      doc.category === categoryMap[selectedCategory] ||
      doc.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus = statusFilter === 'all' || 
      doc.status?.toLowerCase() === statusFilter ||
      (statusFilter === 'pending' && (doc.status?.toLowerCase() === 'review pending'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getDocumentStats = () => {
    const total = documents.length;
    
    // As requested, keep pending reviews at zero
    const pending = 0;
    
    // Count documents uploaded this month using the isThisMonth flag we added
    const thisMonth = documents.filter(doc => doc.isThisMonth).length;

    // Calculate total storage used with proper size conversion
    const totalSizeInBytes = documents.reduce((acc, doc) => acc + (doc.rawSize || 0), 0);
    
    // Convert to appropriate units
    let sizeDisplay;
    if (totalSizeInBytes >= 1024 * 1024 * 1024) {
      // GB
      sizeDisplay = `${(totalSizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (totalSizeInBytes >= 1024 * 1024) {
      // MB
      sizeDisplay = `${(totalSizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (totalSizeInBytes >= 1024) {
      // KB
      sizeDisplay = `${(totalSizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      // Bytes
      sizeDisplay = `${totalSizeInBytes} B`;
    }

    return {
      total,
      pending,
      thisMonth,
      totalSize: sizeDisplay
    };
  };

  const stats = getDocumentStats();

  const statsCards = [
    {
      title: 'Total Documents',
      value: stats.total,
      Icon: FileText,
      color: '#3182CE'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      Icon: PriorityHigh,
      color: '#E53E3E'
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      Icon: UploadFile,
      color: '#38A169'
    },
    {
      title: 'Storage Used',
      value: stats.totalSize,
      Icon: HardDrive,
      color: '#D69E2E'
    }
  ];

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleAiAssistant = (doc) => {
    setSelectedDocument(doc);
    setAiAssistantOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading documents...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage patient documents and files
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Upload size={20} />}
          sx={{
            bgcolor: '#2196f3',
            '&:hover': { bgcolor: '#1976d2' },
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          Upload Document
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{
        mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch'
      }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{
                      fontWeight: 'medium',
                      fontSize: '1rem',
                    }} color="text.secondary">{card.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">{card.value}</Typography>
                  </Box>
                  <card.Icon sx={{ fontSize: 40, color: card.color }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Search Document"
          name="search"
          variant="outlined"
          placeholder="Search Document."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: 'white' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              boxShadow: 'none',
              outline: 'none',
              '&:hover fieldset': {
                borderColor: '#28938C',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1D4645',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-root': {
              boxShadow: 'none !important',
              outline: 'none !important',
            },
            '& .MuiOutlinedInput-input': {
              boxShadow: 'none',
              outline: 'none',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1D4645',
            },
          }}
        />

        <Button
          variant={statusFilter !== 'all' ? 'contained' : 'outlined'}
          startIcon={<Filter />}
          onClick={filterMenu.handleClick}
          sx={{
            borderColor: '#D1D5DB',
            color: statusFilter !== 'all' ? 'white' : 'text.primary',
            bgcolor: statusFilter !== 'all' ? '#2563EB' : 'white',
            '&:hover': {
              bgcolor: statusFilter !== 'all' ? '#1D4ED8' : 'action.hover'
            },
            textTransform: 'none',
            borderRadius: '12px',
            flexShrink: 0
          }}
        >
          Filter {statusFilter !== 'all' && `(${statusFilter})`}
        </Button>
        <Menu
          anchorEl={filterMenu.anchorEl}
          open={filterMenu.open}
          onClose={filterMenu.handleClose}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === statusFilter}
              onClick={() => handleFilterChange(option.value)}
            >
              <ListItemIcon>
                <StatusIndicatorIcon fontSize="small" sx={{ color: option.color }} />
              </ListItemIcon>
              <ListItemText sx={{ textTransform: 'capitalize' }}>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "text"}
              onClick={() => setSelectedCategory(category)}
              sx={{
                minWidth: 120,
                textTransform: 'none',
                color: selectedCategory === category ? 'white' : 'text.primary',
                bgcolor: selectedCategory === category ? '#2196f3' : 'transparent',
                '&:hover': {
                  bgcolor: selectedCategory === category ? '#1976d2' : 'rgba(0,0,0,0.04)'
                },
                mb: 1
              }}
            >
              {category}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Documents Table */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ p: 2, bgcolor: '#fafafa', borderBottom: 1, borderColor: 'divider' }}>
          All Documents
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No documents found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {documents.length === 0
                        ? "No documents available in the collection"
                        : "Try adjusting your search or filter criteria"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          bgcolor: 'grey.100',
                          borderRadius: 1
                        }}>
                          {getDocumentIcon(doc.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                            {
                              doc.title && doc.title.startsWith(doc.patientId + "_")
                                ? doc.title.slice(doc.patientId.length + 1)
                                : doc.title
                            }
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Patient: {doc.patient || 'Unknown'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {doc.category && (
                              <Chip
                                label={doc.category}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            )}
                            {doc.status && (
                              <Chip
                                label={doc.status}
                                size="small"
                                color={getStatusColor(doc.status)}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {doc.size || 'Unknown size'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(doc.updated)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {(doc.previewUrl || doc.downloadURL) && (
                          <IconButton
                            size="small"
                            onClick={() => handleViewDocument(doc)}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' },
                              width: 32,
                              height: 32
                            }}
                          >
                            <Eye size={16} />
                          </IconButton>
                        )}
                        {(doc.downloadURL || doc.previewUrl) && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(doc.downloadURL || doc.previewUrl, '_blank')}
                            sx={{
                              bgcolor: 'success.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'success.dark' },
                              width: 32,
                              height: 32
                            }}
                          >
                            <Download size={16} />
                          </IconButton>
                        )}
                        {doc.aiSummary && (
                          <IconButton
                            size="small"
                            onClick={() => handleAiAssistant(doc)}
                            sx={{
                              bgcolor: 'warning.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'warning.dark' },
                              width: 32,
                              height: 32
                            }}
                          >
                            <Bot size={16} />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          sx={{ width: 32, height: 32 }}
                        >
                          <MoreHorizontal size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Enhanced Document Viewer Dialog */}
      <EnhancedDocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        document={selectedDocument}
      />

      {/* AI Assistant Dialog */}
      <Dialog
        open={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bot size={24} style={{ color: '#ff9800' }} />
            <Typography variant="h6">AI Assistant</Typography>
          </Box>
          <IconButton
            onClick={() => setAiAssistantOpen(false)}
            sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedDocument?.aiSummary && (
            <Stack spacing={3}>
              {selectedDocument.aiSummary.overview && (
                <Box sx={{
                  p: 2,
                  bgcolor: 'info.50',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'info.200'
                }}>
                  <Typography variant="body1">
                    {selectedDocument.aiSummary.overview}
                  </Typography>
                </Box>
              )}

              {selectedDocument.aiSummary.vitals?.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Activity size={20} style={{ color: '#2196f3' }} />
                    Vitals
                  </Typography>
                  <Stack spacing={1}>
                    {selectedDocument.aiSummary.vitals.map((vital, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: vital.status?.toLowerCase() === "high" ? "#ffebee" :
                            vital.status?.toLowerCase() === "low" ? "#e3f2fd" :
                              vital.status?.toLowerCase() === "normal" ? "#e8f5e8" : "grey.50",
                          border: 1,
                          borderColor: vital.status?.toLowerCase() === "high" ? "error.light" :
                            vital.status?.toLowerCase() === "low" ? "info.light" :
                              vital.status?.toLowerCase() === "normal" ? "success.light" : "grey.300"
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {vital.name}: {vital.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {vital.status} | Normal Range: {vital.normalRange}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {selectedDocument.aiSummary.analysis?.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Analysis</Typography>
                  <Stack spacing={1}>
                    {selectedDocument.aiSummary.analysis.map((item, idx) => (
                      <Typography key={idx} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                        • {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}

              {selectedDocument.aiSummary.recommendations?.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Recommendations</Typography>
                  <Stack spacing={1}>
                    {selectedDocument.aiSummary.recommendations.map((item, idx) => (
                      <Typography key={idx} sx={{ p: 1.5, bgcolor: 'success.50', borderRadius: 1 }}>
                        {idx + 1}. {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorDocumentSection;