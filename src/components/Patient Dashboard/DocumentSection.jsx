import React, { useState, useMemo } from 'react';
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
    styled
} from '@mui/material';
import {
    Upload,
    FilterList,
    Visibility, // Replaced Search for "View"
    Download,
    Article, // Icon for Medical
    Flight,  // Icon for Travel
    Shield, // Icon for Insurance
} from '@mui/icons-material';

// --- 1. Sample data for documents ---
const allDocuments = [
    {
        id: 1,
        title: 'Blood Test Report',
        category: 'Medical',
        date: '2025-07-15',
        uploader: 'Dr. Evelyn Reed',
        size: '2.4 MB',
        status: 'New',
    },
    {
        id: 2,
        title: 'Visa Approval',
        category: 'Travel',
        date: '2025-07-10',
        uploader: 'Consulate Office',
        size: '850 KB',
        status: 'Reviewed',
    },
    {
        id: 3,
        title: 'Health Insurance Policy',
        category: 'Insurance',
        date: '2025-06-28',
        uploader: 'MediSecure Inc.',
        size: '5.1 MB',
        status: 'Reviewed',
    },
    {
        id: 4,
        title: 'MRI Scan Results',
        category: 'Medical',
        date: '2025-06-20',
        uploader: 'City Imaging Center',
        size: '15.8 MB',
        status: 'Reviewed',
    },
    {
        id: 5,
        title: 'Flight Itinerary',
        category: 'Travel',
        date: '2025-06-18',
        uploader: 'You',
        size: '1.2 MB',
        status: 'Pending',
    },
    {
        id: 6,
        title: 'Insurance Claim Form',
        category: 'Insurance',
        date: '2025-06-15',
        uploader: 'You',
        size: '1.8 MB',
        status: 'Pending',
    },
];

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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    }
}));

// --- 2. Reusable DocumentCard component for cleaner code ---
const DocumentCard = ({ document }) => {
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
                title={document.title}
                subheader={`Uploaded: ${new Date(document.date).toLocaleDateString()}`}
                action={getStatusChip(document.status)}
                titleTypographyProps={{ fontWeight: 'bold' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    By: {document.uploader}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Size: {document.size}
                </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2 }}>
                <Button
                    fullWidth
                    startIcon={<Visibility />}
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
                    }}>View</Button>
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
                >Download</Button>
            </Box>
        </Card>
    );
};

const DocumentsSection = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    // --- 3. Memoized filtering logic for tabs and search ---
    const filteredDocuments = useMemo(() => {
        const selectedCategory = categoryTabs[tabIndex];

        return allDocuments.filter(doc => {
            const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
            const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [tabIndex, searchQuery]);

    return (
        <Box p={3}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Documents Vault</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Secure storage for all your medical and travel documents.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Upload />} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                    Upload New
                </Button>
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
                            <Grid item key={doc.id} xs={12} sm={6} md={4}>
                                <DocumentCard document={doc} />
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
        </Box>
    );
}

export default DocumentsSection;