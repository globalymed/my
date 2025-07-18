import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
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
  CheckCircle as CheckCircleIcon,
  List as ListIcon
} from '@mui/icons-material';

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Dynamic Table of Contents Component
const DynamicTableOfContents = ({ slug }) => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = async () => {
    try {
      const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;

      if (!projectId) {
        throw new Error('Sanity project ID is not configured');
      }

      if (!slug) {
        throw new Error('Slug is required');
      }

      const query = `*[_type == "post" && slug.current == "${slug}"]{
        _id,
        title,
        slug,
        publishedAt,
        image,
        body
      }`;

      const encodedQuery = encodeURIComponent(query);
      const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/production?query=${encodedQuery}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("API Response:", data);

      if (data.result && data.result.length > 0) {
        setBlogData(data.result[0]);
      } else {
        console.log("No posts found for slug:", slug);
        setError("Blog post not found");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(`Failed to fetch blog data: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [slug]);
  
  const [activeId, setActiveId] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [tocItems, setTocItems] = useState([]);

  // Extract TOC items from blog content
  useEffect(() => {
    if (!blogData?.body) return;

    const items = [];
    blogData.body.forEach((block, index) => {
      // Handle all heading levels: h1, h2, h3, h4
      if (['h1', 'h2', 'h3', 'h4'].includes(block.style)) {
        const text = block.children?.map(child => child.text).join('') || '';
        if (text.trim()) {
          const slug = generateSlug(text);
          
          // Map heading styles to levels for proper indentation
          const levelMap = {
            'h1': 1,
            'h2': 2,
            'h3': 3,
            'h4': 4
          };
          
          items.push({
            id: slug,
            title: text,
            level: levelMap[block.style],
            style: block.style,
            index
          });
        }
      }
    });

    setTocItems(items);
  }, [blogData]);

  // Handle scroll for sticky behavior and active section
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);

      const sections = tocItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get styling for different heading levels
  const getHeadingStyles = (item) => {
    const baseStyles = {
      py: 1,
      borderRadius: 1,
      textAlign: 'left',
      color: activeId === item.id ? '#1d4ed8' : '#4b5563',
      backgroundColor: activeId === item.id ? '#dbeafe' : 'transparent',
      fontWeight: activeId === item.id ? 600 : 400,
      '&:hover': {
        backgroundColor: activeId === item.id ? '#dbeafe' : '#f3f4f6',
      },
      transition: 'background-color 0.2s',
    };

    // Different padding and font sizes for different heading levels
    switch (item.level) {
      case 1: // h1
        return {
          ...baseStyles,
          pl: 1,
          fontSize: '1rem',
          fontWeight: activeId === item.id ? 700 : 600,
          borderLeft: activeId === item.id ? '3px solid #1d4ed8' : '3px solid transparent',
        };
      case 2: // h2
        return {
          ...baseStyles,
          pl: 2,
          fontSize: '0.9rem',
          fontWeight: activeId === item.id ? 600 : 500,
          borderLeft: activeId === item.id ? '2px solid #1d4ed8' : '2px solid transparent',
        };
      case 3: // h3
        return {
          ...baseStyles,
          pl: 3,
          fontSize: '0.85rem',
          fontWeight: activeId === item.id ? 500 : 400,
        };
      case 4: // h4
        return {
          ...baseStyles,
          pl: 4,
          fontSize: '0.8rem',
          fontWeight: activeId === item.id ? 500 : 400,
          color: activeId === item.id ? '#1d4ed8' : '#6b7280',
        };
      default:
        return baseStyles;
    }
  };

  // Get typography props for different heading levels
  const getTypographyProps = (item) => {
    switch (item.level) {
      case 1:
        return { fontSize: 16, fontWeight: activeId === item.id ? 700 : 600 };
      case 2:
        return { fontSize: 14, fontWeight: activeId === item.id ? 600 : 500 };
      case 3:
        return { fontSize: 13, fontWeight: activeId === item.id ? 500 : 400 };
      case 4:
        return { fontSize: 12, fontWeight: activeId === item.id ? 500 : 400 };
      default:
        return { fontSize: 14 };
    }
  };

  if (loading) {
    return (
      <Card variant="outlined">
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <ListIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Table of Contents
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ pt: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined">
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <ListIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Table of Contents
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="error" textAlign="center">
            Failed to load contents
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (tocItems.length === 0) return null;

  return (
    <Box
      sx={{
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? '96px' : 'auto',
        transition: 'all 0.3s',
      }}
    >
      <Card variant="outlined">
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <ListIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Table of Contents
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ pt: 1 }}>
          <List disablePadding>
            {tocItems.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={getHeadingStyles(item)}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={getTypographyProps(item)}
                />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DynamicTableOfContents;