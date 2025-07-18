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
      if (block.style === 'h3' || block.style === 'h4') {
        const text = block.children?.map(child => child.text).join('') || '';
        if (text.trim()) {
          const slug = generateSlug(text);
          items.push({
            id: slug,
            title: text,
            level: block.style === 'h3' ? 1 : 2,
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
                sx={{
                  pl: item.level === 2 ? 4 : 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  color: activeId === item.id ? '#1d4ed8' : '#4b5563',
                  backgroundColor: activeId === item.id ? '#dbeafe' : 'transparent',
                  fontWeight: activeId === item.id ? 500 : 400,
                  '&:hover': {
                    backgroundColor: activeId === item.id ? '#dbeafe' : '#f3f4f6',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ fontSize: 14 }}
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