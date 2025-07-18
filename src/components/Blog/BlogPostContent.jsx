import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  TipsAndUpdates as LightbulbIcon,
  Favorite as FavoriteIcon,
  MonitorHeart as MonitorHeartIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import DynamicTableOfContents from './TableOfContents.jsx';

const DynamicBlogRenderer = ({ slug }) => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate slug from text - moved inside component
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchBlogData = async () => {
    try {
      const query = `*[_type == "post" && slug.current == "${slug}"]{
        _id,
        title,
        slug,
        publishedAt,
        image,
        body
      }`;
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://${process.env.REACT_APP_SANITY_PROJECT_ID}.api.sanity.io/v2025-07-16/data/query/production?query=${encodedQuery}&perspective=drafts`
      );
      const data = await response.json();
      setBlogData(data.result[0]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to fetch blog data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  const renderBlock = (block, index) => {
    const text = block.children?.map(child => child.text).join('') || '';

    // Handle different block styles
    switch (block.style) {
      case 'h3':
        const h3Id = generateSlug(text);
        return (
          <Box key={index} id={h3Id} sx={{ mb: 4, mt: 6 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              borderBottom: 2,
              borderColor: 'primary.light',
              pb: 1,
              scrollMarginTop: '120px' // Offset for sticky header
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h4':
        const h4Id = generateSlug(text);
        return (
          <Box key={index} id={h4Id} sx={{ mb: 3, mt: 4 }}>
            <Typography variant="h5" component="h4" gutterBottom sx={{
              fontWeight: 'semibold',
              color: 'text.primary',
              scrollMarginTop: '120px' // Offset for sticky header
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h5':
        return (
          <Box key={index} sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h6" component="h5" gutterBottom sx={{
              fontWeight: 'medium',
              color: 'text.secondary'
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h6':
        return (
          <Box key={index} sx={{ mb: 2, mt: 2 }}>
            <Typography variant="subtitle1" component="h6" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'error.dark'
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'normal':
        // Handle special formatted blocks
        if (block.children?.some(child => child.marks?.includes('code'))) {
          const isProTip = text.includes('Pro Tip:');
          const isImportant = text.includes('Important:');

          if (isProTip) {
            return (
              <Alert
                key={index}
                icon={<LightbulbIcon />}
                severity="info"
                sx={{
                  my: 3,
                  backgroundColor: '#eff6ff',
                  borderColor: '#bfdbfe',
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <AlertTitle sx={{ color: '#1e40af', fontWeight: 'bold' }}>
                  Pro Tip:
                </AlertTitle>
                <Typography sx={{ color: '#1e40af' }}>
                  {text.replace('Pro Tip:', '').trim()}
                </Typography>
              </Alert>
            );
          }

          if (isImportant) {
            return (
              <Alert
                key={index}
                icon={<MonitorHeartIcon />}
                severity="success"
                sx={{
                  my: 3,
                  backgroundColor: '#ecfdf5',
                  borderColor: '#bbf7d0',
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <AlertTitle sx={{ color: '#065f46', fontWeight: 'bold' }}>
                  Important:
                </AlertTitle>
                <Typography sx={{ color: '#065f46' }}>
                  {text.replace('Important:', '').trim()}
                </Typography>
              </Alert>
            );
          }
        }

        // Handle "Did You Know?" blocks
        if (text.includes('About 80% of premature heart attacks')) {
          return (
            <Card key={index} sx={{
              my: 3,
              backgroundColor: '#fef2f2',
              borderColor: '#fecaca',
              border: 1,
              borderStyle: 'solid'
            }}>
              <CardContent>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <FavoriteIcon sx={{ color: '#dc2626', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#991b1b', mb: 1 }}>
                      Did You Know?
                    </Typography>
                    <Typography sx={{ color: '#b91c1c' }}>
                      {text}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        }

        // Regular paragraph
        if (text.trim()) {
          return (
            <Typography key={index} paragraph color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
              {text}
            </Typography>
          );
        }
        break;

      default:
        // Handle list items
        if (block.listItem === 'bullet') {
          const hasStrong = block.children?.some(child => child.marks?.includes('strong'));

          return (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemText
                primary={text}
                sx={{
                  color: 'text.secondary',
                  '& .MuiTypography-root': {
                    fontWeight: hasStrong ? 'medium' : 'normal'
                  }
                }}
              />
            </ListItem>
          );
        }

        return null;
    }
  };

  const groupBlocks = (blocks) => {
    const grouped = [];
    let currentList = [];

    blocks.forEach((block, index) => {
      if (block.listItem === 'bullet') {
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          grouped.push({
            type: 'list',
            items: currentList,
            key: `list-${index}`
          });
          currentList = [];
        }
        grouped.push({
          type: 'block',
          block: block,
          key: `block-${index}`
        });
      }
    });

    if (currentList.length > 0) {
      grouped.push({
        type: 'list',
        items: currentList,
        key: `list-final`
      });
    }

    return grouped;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Loading blog content...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" icon={<InfoIcon />}>
          <AlertTitle>Error Loading Blog Content</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!blogData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary">
            No blog data available
          </Typography>
        </Box>
      </Container>
    );
  }

  const groupedBlocks = groupBlocks(blogData.body);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper elevation={0} sx={{
        overflow: "hidden",
        position: "relative",
        bgcolor: 'transparent'
      }}>
        <Box component="article" sx={{ maxWidth: '100%', typography: 'body1' }}>
          {groupedBlocks.map((group) => {
            if (group.type === 'list') {
              return (
                <List key={group.key} sx={{ mb: 3, pl: 2 }}>
                  {group.items.map((item, itemIndex) => renderBlock(item, `${group.key}-${itemIndex}`))}
                </List>
              );
            } else {
              return renderBlock(group.block, group.key);
            }
          })}
        </Box>
      </Paper>
    </Container>
  );
};

export default DynamicBlogRenderer;