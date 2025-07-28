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
  Avatar
} from '@mui/material';
import {
  Search,
  Filter,
  Upload,
  Eye,
  Download,
  MoreHorizontal,
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
  Calendar,
  HardDrive
} from 'lucide-react';

// Firebase imports - replace with your actual Firebase config
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const DocumentsContent = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const categories = ["All", "Reports", "Lab Results", "Imaging", "Prescriptions"];
  
  const categoryMap = {
    "All": "all",
    "Reports": "reports", 
    "Lab Results": "results",
    "Imaging": "imaging",
    "Prescriptions": "prescriptions"
  };

  // Fetch documents from Firestore
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize Firestore
        const db = getFirestore();
        const documentsRef = collection(db, 'documents');
        const snapshot = await getDocs(documentsRef);
        
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents from Firestore');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
                         doc.patient?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           doc.category === categoryMap[selectedCategory];
    return matchesSearch && matchesCategory;
  });

  const getDocumentStats = () => {
    const total = documents.length;
    const pending = documents.filter(doc => doc.status === 'pending').length;
    const thisMonth = documents.filter(doc => {
      if (!doc.updatedAt) return false;
      const docDate = new Date(doc.updatedAt);
      const currentDate = new Date();
      return docDate.getMonth() === currentDate.getMonth() && 
             docDate.getFullYear() === currentDate.getFullYear();
    }).length;
    
    const totalSize = documents.reduce((acc, doc) => {
      if (!doc.size) return acc;
      const sizeNum = parseFloat(doc.size);
      const unit = doc.size.includes('GB') ? 1024 : 
                   doc.size.includes('MB') ? 1 : 0.001; // KB to MB
      return acc + (sizeNum * unit);
    }, 0);

    return { 
      total, 
      pending, 
      thisMonth, 
      totalSize: totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} GB` : `${totalSize.toFixed(0)} MB`
    };
  };

  const stats = getDocumentStats();

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
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Documents
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: '#e3f2fd', 
              borderRadius: '50%', 
              width: 48, 
              height: 48, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <FileText size={24} style={{ color: '#2196f3' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Pending Review
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.pending}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: '#fff3e0', 
              borderRadius: '50%', 
              width: 48, 
              height: 48, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                !
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This Month
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.thisMonth}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: '#e8f5e8', 
              borderRadius: '50%', 
              width: 48, 
              height: 48, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                ↑
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Storage Used
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.totalSize}
              </Typography>
            </Box>
            <Box sx={{ 
              bgcolor: '#f3e5f5', 
              borderRadius: '50%', 
              width: 48, 
              height: 48, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <HardDrive size={24} style={{ color: '#9c27b0' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Filter size={20} />}
          sx={{ minWidth: 100, textTransform: 'none' }}
        >
          Filter
        </Button>
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
                            {doc.title || 'Untitled Document'}
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
                          {formatDate(doc.updatedAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {doc.previewUrl && (
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
                        {doc.url && (
                          <IconButton 
                            size="small"
                            onClick={() => window.open(doc.url, '_blank')}
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

      {/* Document Viewer Dialog */}
      <Dialog 
        open={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 2
        }}>
          <Typography variant="h6">Document Preview</Typography>
          <IconButton 
            onClick={() => setViewerOpen(false)}
            sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ height: '70vh', p: 0 }}>
          {selectedDocument?.previewUrl && (
            selectedDocument.type === "pdf" ? (
              <iframe
                src={selectedDocument.previewUrl}
                title={`Preview of ${selectedDocument.title}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
              />
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                p: 2
              }}>
                <img
                  src={selectedDocument.previewUrl}
                  alt={selectedDocument.title}
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "100%", 
                    objectFit: 'contain',
                    borderRadius: 8
                  }}
                />
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>

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

export default DocumentsContent;