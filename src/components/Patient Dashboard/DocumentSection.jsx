import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Tabs,
    Tab,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Chip,
    useTheme,
    styled,
    IconButton
} from '@mui/material';
import {
    Upload,
    FilterList,
    Visibility, // Replaced Search for "View"
    Download,
    Article, // Icon for Medical
    Flight,  // Icon for Travel
    Shield, // Icon for Insurance
    Close
} from '@mui/icons-material';
import { storage } from "../../firebase.js"
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from 'firebase/storage';

const categoryTabs = ['All', 'Medical', 'Travel', 'Insurance'];

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-flexContainer': {
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        padding: '4px',
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        minHeight: '48px',
        fontSize: '16px',
        fontWeight: 500,
        color: '#666',
        borderRadius: '8px',
        margin: '0 2px',
        '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#333',
        }
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    }
}));

// --- 2. Reusable DocumentCard component for cleaner code ---
const DocumentCard = ({ document, onView }) => {
    // console.log(document);

    const cleanTitle = document.title.startsWith(document.userId + "_")
        ? document.title.slice(document.userId.length + 1)
        : document.title;

    const getStatusChip = (status) => {
        switch (status) {
            case 'New':
                return (
                    <Chip
                        label={status}
                        size="small"
                        sx={{
                            backgroundColor: 'black',
                            color: 'white', // optional: sets text color
                        }}
                    />
                );
            case 'Reviewed':
                return <Chip label={status} color="success" size="small" variant="outlined" />;
            case 'Pending':
                return <Chip label={status} color="warning" size="small" variant="outlined" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Medical': return <Article color="black" />;
            case 'Travel': return <Flight color="info" />;
            case 'Insurance': return <Shield color="success" />;
            default: return null;
        }
    }

    return (
        <Card elevation={0} sx={{ borderRadius: 4, p: 2, border: "1px solid #E4E7EC", height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                avatar={getCategoryIcon(document.category)}
                title={cleanTitle}
                subheader={`Uploaded: ${new Date(document.created).toLocaleDateString()}`}
                action={getStatusChip(document.status)}
                titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    By: {document.uploader}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <p><strong>Size:</strong> {(document.size / (1024 * 1024)).toFixed(2)} MB</p>
                </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2 }}>
                <Button
                    fullWidth
                    startIcon={<Visibility />}
                    variant="outlined"
                    onClick={() => onView(document.downloadURL)}
                    sx={{
                        backgroundColor: '#FFFFFF',
                        color: 'black',
                        textTransform: 'none',
                        borderColor: '#1D4645',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                            borderColor: '#1D4645',
                        },
                    }}
                >
                    View
                </Button>
                <a href={document.downloadURL} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <Button
                        fullWidth
                        startIcon={<Download />}
                        variant="outlined"
                        sx={{
                            backgroundColor: '#FFFFFF',
                            color: 'black',
                            textTransform: 'none',
                            borderColor: '#1D4645',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                                borderColor: '#1D4645',
                            },
                        }}
                    >
                        Download
                    </Button>
                </a>
            </Box>
        </Card>
    );
};

const DocumentsSection = ({ user }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for file upload
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // console.log("DocumentsSection user:", user);

    const [viewingDocUrl, setViewingDocUrl] = useState(null);

    // Handler to open the viewer with a specific URL
    const handleViewDocument = (url) => {
        setViewingDocUrl(url);
    };

    // Handler to close the viewer
    const handleCloseViewer = () => {
        setViewingDocUrl(null);
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    // --- 3. Memoized filtering logic for tabs and search ---
    const filteredDocuments = useMemo(() => {
        const selectedCategory = categoryTabs[tabIndex];
        return fileList.filter(doc => {
            const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [tabIndex, searchQuery, fileList]);

    const fetchFiles = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        setError(null);
        const folderRef = ref(storage, `medical-records/${user.id}`);
        try {
            const response = await listAll(folderRef);
            const files = await Promise.all(
                response.items.map(async (itemRef) => {
                    const [url, metadata] = await Promise.all([
                        getDownloadURL(itemRef),
                        getMetadata(itemRef)
                    ]);
                    return {
                        title: metadata.name,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        created: metadata.timeCreated,
                        updated: metadata.updated,
                        downloadURL: url,
                        category: metadata?.customMetadata?.category || 'Medical',
                        status: "Reviewed",
                        uploader: user.firstName,
                        userId: user.id,
                    };
                })
            );
            setFileList(files);
        } catch (err) {
            console.error("Error fetching files:", err);
            setError("Failed to load medical records.");
        } finally {
            setIsLoading(false);
        }
    }, [user]); // Re-run when user object changes


    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleUploadClick = () => {
        console.log("Upload button clicked");
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        if (!file || !user?.id) return;

        setIsUploading(true);
        setError(null);

        const storageRef = ref(storage, `medical-records/${user.id}/${user.id}_${file.name}`);

        try {
            await uploadBytes(storageRef, file);
            await fetchFiles();
        } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            setError("File upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };


    if (isLoading && fileList.length === 0) { // Show loading only on initial load
        return <p>Loading records...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <Box p={3}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                {/* This is the title on the left */}
                <Box>
                    <Typography variant="h4" fontWeight="bold">Documents Vault</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Secure storage for all your medical and travel documents.
                    </Typography>
                </Box>

                {/* This is the VISIBLE button on the right */}
                <Button
                    variant="contained"
                    startIcon={<Upload />}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: 'black',
                        '&:hover': { bgcolor: '#333' }
                    }}
                    onClick={handleUploadClick}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload New'}
                </Button>

                {/* This is the HIDDEN file input that the button clicks for you */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    style={{
                        clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',
                        height: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        width: 1,
                    }}
                    accept="application/pdf,image/*,.doc,.docx"
                />
            </Box>

            {/* Filter and Search Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search documents by title..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="contained" startIcon={<FilterList />} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                    Filter
                </Button>
            </Box>

            {/* Tabs Section */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <StyledTabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    sx={{
                        width: 'fit-content',
                    }}
                >
                    {categoryTabs.map(label => <Tab key={label} label={label} />)}
                </StyledTabs>
            </Box>

            {/* --- 4. Display filtered documents or a message --- */}
            <Box mt={3}>
                {filteredDocuments.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredDocuments.map((doc) => (
                            <Grid item key={doc.title} xs={12} sm={6} md={4}>
                                <DocumentCard document={doc} onView={handleViewDocument} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No documents found.
                        </Typography>
                        <Typography color="text.secondary">
                            Try adjusting your search or filter criteria.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Document Viewer Modal */}
            {viewingDocUrl && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1300,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: '12px', // optional, for aesthetics
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: '8px 16px',
                            zIndex: 1301,
                        }}
                    >
                        <IconButton onClick={handleCloseViewer} sx={{ color: 'white' }}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <iframe
                            src={viewingDocUrl}
                            title="Document Viewer"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default DocumentsSection;