import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import {
  Visibility,
  Download,
  Close,
  PictureAsPdf,
  Image,
  Description,
  Search,
  SmartToy,
  FilterList
} from "@mui/icons-material";

// Firebase Storage imports
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

const categories = ["all", "reports", "imaging", "results"];

const typeIcons = {
  pdf: <PictureAsPdf color="error" />,
  docx: <Description color="primary" />,
  jpeg: <Image color="secondary" />,
  jpg: <Image color="secondary" />,
  png: <Image color="secondary" />,
  default: <Description />
};

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return "";
  return `${String(dateObj.getDate()).padStart(2, "0")}-${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}-${dateObj.getFullYear()}`;
}

const DocumentsContent = () => {
  // State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/sort/search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [categoryBy, setCategoryBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch documents from Firebase Storage /medical-records
  useEffect(() => {
    const fetchStorageDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const storage = getStorage();
        const recordsRef = ref(storage, 'medical-records');
        const res = await listAll(recordsRef);
        console.log('listAll result:', res);
        let allFiles = [...res.items];
        // Recursively get files from all subfolders
        for (const folderRef of res.prefixes) {
          const subRes = await listAll(folderRef);
          allFiles = allFiles.concat(subRes.items);
        }
        if (allFiles.length === 0) {
          console.warn('No files found in /medical-records/ or its subfolders');
        }
        const docs = await Promise.all(
          allFiles.map(async (fileRef) => {
            try {
              const url = await getDownloadURL(fileRef);
              let meta = {};
              try {
                meta = await getMetadata(fileRef);
              } catch (e) {
                console.warn('No metadata for', fileRef.name, e);
              }
              // Extract file info
              const name = fileRef.name;
              const ext = name.split('.').pop()?.toLowerCase() || '';
              // Try to get size from metadata
              let size = '';
              if (meta.size) {
                size = (meta.size / 1024).toFixed(0) + ' KB';
              }
              // Try to get updated date
              let updatedAt = '';
              if (meta.updated) {
                updatedAt = meta.updated;
              }
              return {
                id: fileRef.fullPath,
                title: name,
                type: ext,
                url,
                previewUrl: url,
                size,
                updatedAt,
              };
            } catch (fileErr) {
              console.error('Error processing file', fileRef.name, fileErr);
              return null;
            }
          })
        );
        setDocuments(docs.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching storage documents:', err);
        setError('Failed to load documents from storage');
        setLoading(false);
      }
    };
    fetchStorageDocuments();
  }, []);

  // Filtering
  let filteredDocs = documents;
  if (categoryBy !== "all") {
    filteredDocs = filteredDocs.filter(
      (doc) => doc.category && doc.category === categoryBy
    );
  }
  if (searchQuery.trim() !== "") {
    filteredDocs = filteredDocs.filter((doc) => {
      const q = searchQuery.toLowerCase();
      if (searchBy === "all") {
        return (
          (doc.title && doc.title.toLowerCase().includes(q)) ||
          (doc.patient && doc.patient.toLowerCase().includes(q)) ||
          (doc.type && doc.type.toLowerCase().includes(q))
        );
      }
      if (searchBy === "name") {
        return doc.title && doc.title.toLowerCase().includes(q);
      }
      if (searchBy === "patient") {
        return doc.patient && doc.patient.toLowerCase().includes(q);
      }
      if (searchBy === "type") {
        return doc.type && doc.type.toLowerCase().includes(q);
      }
      return false;
    });
  }

  // Sorting
  filteredDocs = [...filteredDocs].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":
        return (a.title || "").localeCompare(b.title || "");
      case "nameDec":
        return (b.title || "").localeCompare(a.title || "");
      case "patientAsc":
        return (a.patient || "").localeCompare(b.patient || "");
      case "patientDec":
        return (b.patient || "").localeCompare(a.patient || "");
      case "dateAsc":
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      case "dateDec":
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case "sizeAsc":
        return (parseFloat(a.size) || 0) - (parseFloat(b.size) || 0);
      case "sizeDec":
        return (parseFloat(b.size) || 0) - (parseFloat(a.size) || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocs = filteredDocs.slice(startIndex, endIndex);

  // Animation ref
  const cardsContainerRef = useRef(null);

  // Reset to page 1 if filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchBy, sortBy, categoryBy]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        borderRadius: 3, 
        bgcolor: "background.paper",
        minHeight: '500px'
      }}
    >
      
      {/* Search and Filter Controls */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ position: 'relative', maxWidth: 600 }}>
            <Search sx={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'text.secondary' 
            }} />
            <TextField
              variant="outlined"
              size="medium"
              fullWidth
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                pl: 5,
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '48px',
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </Box>

        {/* Filter Controls */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={3} 
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
            <FilterList color="action" />
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 80 }}>
              Search By:
            </Typography>
            <Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              size="small"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Fields</MenuItem>
              <MenuItem value="name">Document Name</MenuItem>
              <MenuItem value="patient">Patient Name</MenuItem>
              <MenuItem value="type">Document Type</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 220 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 60 }}>
              Sort By:
            </Typography>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
              <MenuItem value="nameDec">Name (Z-A)</MenuItem>
              <MenuItem value="patientAsc">Patient (A-Z)</MenuItem>
              <MenuItem value="patientDec">Patient (Z-A)</MenuItem>
              <MenuItem value="dateAsc">Date (Oldest)</MenuItem>
              <MenuItem value="dateDec">Date (Newest)</MenuItem>
              <MenuItem value="sizeAsc">Size (Smallest)</MenuItem>
              <MenuItem value="sizeDec">Size (Largest)</MenuItem>
            </Select>
          </Box>
        </Stack>
      </Paper>

      {/* Category Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={categories.indexOf(categoryBy)}
          onChange={(_, idx) => setCategoryBy(categories[idx])}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'capitalize',
              fontWeight: 500,
              minHeight: 48,
              px: 3
            }
          }}
        >
          {categories.map((cat) => (
            <Tab 
              key={cat} 
              label={cat === 'all' ? 'All Documents' : cat.charAt(0).toUpperCase() + cat.slice(1)} 
            />
          ))}
        </Tabs>
        <Divider />
      </Box>

      {/* Results Summary */}
      {!loading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {currentDocs.length} of {filteredDocs.length} documents
            {searchQuery.trim() && ` matching "${searchQuery}"`}
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ 
          display: "flex", 
          flexDirection: 'column',
          alignItems: "center", 
          justifyContent: "center", 
          py: 8,
          gap: 2
        }}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Loading documents...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Document Cards */}
          <Box ref={cardsContainerRef}>
            {currentDocs.length > 0 ? (
              <Grid container spacing={3}>
                {currentDocs.map((doc) => (
                  <Grid key={doc.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <DocumentCard doc={doc} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  bgcolor: 'grey.50', 
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  {documents.length === 0
                    ? "No documents found"
                    : "No matching documents"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {documents.length === 0
                    ? "Make sure your Firebase Storage 'medical-records' folder contains files."
                    : "Try adjusting your search criteria or filters."}
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: 1, 
              mt: 6,
              p: 3,
              bgcolor: 'grey.50',
              borderRadius: 2
            }}>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outlined"
                sx={{ minWidth: 80 }}
              >
                Previous
              </Button>
              
              <Stack direction="row" spacing={1} sx={{ mx: 2 }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    variant={currentPage === i + 1 ? "contained" : "outlined"}
                    color={currentPage === i + 1 ? "primary" : "inherit"}
                    sx={{ minWidth: 40, aspectRatio: 1 }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Stack>
              
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outlined"
                sx={{ minWidth: 80 }}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

const DocumentCard = ({ doc }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const avatar = doc.patient
    ? doc.patient
      .split(" ")
      .filter(Boolean)
      .map((name) => name[0]?.toUpperCase() || "")
      .join("")
    : "";

  return (
    <>
      <Card 
        variant="outlined" 
        sx={{ 
          borderRadius: 3, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header with Icon and Title */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
            <Box sx={{ 
              fontSize: 40, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              bgcolor: 'grey.100',
              borderRadius: 2
            }}>
              {typeIcons[doc.type] || typeIcons.default}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                  mb: 1
                }}
              >
                {doc.title || "Medical Report"}
              </Typography>
              
              {/* File Info Chips */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {doc.type && (
                  <Chip
                    label={doc.type.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {doc.size && (
                  <Chip
                    label={doc.size}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          </Box>

          {/* Patient Information */}
          {doc.patient && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2, 
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              mb: 2
            }}>
              <Avatar sx={{ 
                bgcolor: "primary.main", 
                color: "primary.contrastText", 
                fontWeight: "bold",
                width: 40,
                height: 40
              }}>
                {avatar}
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Patient
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {doc.patient}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Date Information */}
          {doc.updatedAt && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: "block", textAlign: 'right' }}
            >
              Updated: {formatDate(doc.updatedAt)}
            </Typography>
          )}
        </CardContent>

        {/* Action Buttons */}
        <CardActions sx={{ p: 3, pt: 0 }}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={1} 
            sx={{ width: '100%' }}
          >
            {doc.previewUrl && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<Visibility />}
                onClick={() => setIsViewerOpen(true)}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                View
              </Button>
            )}
            {doc.url && (
              <Button
                variant="outlined"
                color="success"
                size="large"
                fullWidth
                startIcon={<Download />}
                onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Download
              </Button>
            )}
            {doc.aiSummary && (
              <Button
                variant="outlined"
                color="warning"
                size="large"
                fullWidth
                startIcon={<SmartToy />}
                onClick={() => setIsAIAssistantOpen(true)}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Ask AI
              </Button>
            )}
          </Stack>
        </CardActions>
      </Card>

      {/* Viewer Modal */}
      <Dialog 
        open={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 2
        }}>
          <Typography variant="h6" component="div">
            Document Preview
          </Typography>
          <IconButton
            onClick={() => setIsViewerOpen(false)}
            sx={{ 
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ height: "70vh", p: 0 }}>
          {doc.previewUrl && (
            doc.type === "pdf" ? (
              <iframe
                src={doc.previewUrl}
                title={`Preview of ${doc.title || "document"}`}
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
                  src={doc.previewUrl}
                  alt={doc.title}
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

      {/* AI Assistant Modal */}
      <Dialog 
        open={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy color="warning" />
            <Typography variant="h6">AI Assistant</Typography>
          </Box>
          <IconButton
            onClick={() => setIsAIAssistantOpen(false)}
            sx={{ 
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {doc.aiSummary?.overview && (
            <Typography sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
              {doc.aiSummary.overview}
            </Typography>
          )}
          {doc.aiSummary?.vitals?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Vitals:</Typography>
              <Stack spacing={1}>
                {doc.aiSummary.vitals.map((vital, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: vital.status?.toLowerCase() === "high"
                        ? "#ffebee"
                        : vital.status?.toLowerCase() === "low"
                          ? "#e3f2fd"
                          : vital.status?.toLowerCase() === "normal"
                            ? "#e8f5e8"
                            : "grey.50",
                      border: 1,
                      borderColor: vital.status?.toLowerCase() === "high"
                        ? "error.light"
                        : vital.status?.toLowerCase() === "low"
                          ? "info.light"
                          : vital.status?.toLowerCase() === "normal"
                            ? "success.light"
                            : "grey.300"
                    }}
                  >
                    <Typography>
                      <strong>{vital.name}:</strong> {vital.value} ({vital.status})
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
          {doc.aiSummary?.analysis?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Analysis:</Typography>
              <Stack spacing={1}>
                {doc.aiSummary.analysis.map((item, idx) => (
                  <Typography key={idx} sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
          {doc.aiSummary?.recommendations?.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Recommendations:</Typography>
              <Stack spacing={1}>
                {doc.aiSummary.recommendations.map((item, idx) => (
                  <Typography key={idx} sx={{ p: 1.5, bgcolor: 'success.50', borderRadius: 1 }}>
                    {idx + 1}. {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentsContent;