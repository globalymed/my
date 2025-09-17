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
import { Helmet } from 'react-helmet-async';

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

  const renderBlock = (block, index) => {
    const text = block.children?.map(child => child.text).join('') || '';

    // Handle different block styles
    switch (block.style) {
      case 'h1':
        const h1Id = generateSlug(text);
        return (
          <Box key={index} id={h1Id} sx={{ mb: 4, mt: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              borderBottom: 3,
              borderColor: 'primary.main',
              pb: 2,
              scrollMarginTop: '120px',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h2':
        const h2Id = generateSlug(text);
        return (
          <Box key={index} id={h2Id} sx={{ mb: 4, mt: 5 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              borderBottom: 2,
              borderColor: 'primary.main',
              pb: 1.5,
              scrollMarginTop: '120px',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h3':
        const h3Id = generateSlug(text);
        return (
          <Box key={index} id={h3Id} sx={{ mb: 3, mt: 4 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              borderBottom: 2,
              borderColor: 'primary.light',
              pb: 1,
              scrollMarginTop: '120px',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
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
              scrollMarginTop: '120px',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 4,
                height: '100%',
                backgroundColor: 'primary.main',
                borderRadius: 2
              }
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h5':
        const h5Id = generateSlug(text);
        return (
          <Box key={index} id={h5Id} sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h6" component="h5" gutterBottom sx={{
              fontWeight: 'medium',
              color: 'text.secondary',
              scrollMarginTop: '120px',
              fontSize: { xs: '1.125rem', sm: '1.25rem' }
            }}>
              {text}
            </Typography>
          </Box>
        );

      case 'h6':
        const h6Id = generateSlug(text);
        return (
          <Box key={index} id={h6Id} sx={{ mb: 2, mt: 2 }}>
            <Typography variant="subtitle1" component="h6" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'error.dark',
              scrollMarginTop: '120px',
              fontSize: { xs: '1rem', sm: '1.125rem' }
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
          const doYouKnow = text.includes('Did You Know');

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

          if (doYouKnow) {
            return (
              <Alert
                key={index}
                icon={<CheckCircleIcon />}
                severity="warning"
                sx={{
                  my: 3,
                  // backgroundColor: '#fef2f2',
                  // borderColor: '#fecaca',
                  backgroundColor: '#eff6ff',
                  borderColor: '#bfdbfe',
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                <AlertTitle sx={{ color: '#991b1b', fontWeight: 'bold' }}>
                  Did You Kno?
                </AlertTitle>
                <Typography sx={{ color: '#ca8a04' }}>
                  {text.replace('Did You Know?', '').trim()}
                </Typography>
              </Alert>
            );
          }
        }

        // Handle "Did You Know?" blocks
        // if (text.includes('About 80% of premature heart attacks')) {
        //   return (
        //     <Card key={index} sx={{
        //       my: 3,
        //       backgroundColor: '#fef2f2',
        //       borderColor: '#fecaca',
        //       border: 1,
        //       borderStyle: 'solid'
        //     }}>
        //       <CardContent>
        //         <Box display="flex" gap={2} alignItems="flex-start">
        //           <FavoriteIcon sx={{ color: '#dc2626', mt: 0.5 }} />
        //           <Box>
        //             <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#991b1b', mb: 1 }}>
        //               Did You Know?
        //             </Typography>
        //             <Typography sx={{ color: '#b91c1c' }}>
        //               {text}
        //             </Typography>
        //           </Box>
        //         </Box>
        //       </CardContent>
        //     </Card>
        //   );
        // }

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

  // Derive plain-text content and description for SEO/AI crawlers
  const plainParagraphs = (blogData.body || [])
    .filter(b => b.style === 'normal' && Array.isArray(b.children))
    .map(b => b.children.map(c => c.text).join('').trim())
    .filter(Boolean);
  const articleText = plainParagraphs.join('\n\n').slice(0, 15000);
  const metaDescription = (plainParagraphs[0] || blogData.title || '').slice(0, 160);

  // JSON-LD for BlogPosting
  const imageRef = blogData.image?.asset?._ref || '';
  const parts = imageRef.split('-');
  const imageUrl = parts.length >= 4
    ? `https://cdn.sanity.io/images/${process.env.REACT_APP_SANITY_PROJECT_ID}/production/${parts[1]}-${parts[2]}.${parts[3]}`
    : undefined;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + '/treatment/' + (blogData.slug?.current || '') : '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogData.title,
    datePublished: blogData.publishedAt,
    author: blogData.author?.name ? { '@type': 'Person', name: blogData.author.name } : undefined,
    image: imageUrl,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    articleBody: articleText,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Helmet>
        <title>{blogData.title}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogData.title} />
        {metaDescription && <meta property="og:description" content={metaDescription} />}
      </Helmet>
      <Paper elevation={0} sx={{
        overflow: "hidden",
        position: "relative",
        bgcolor: 'transparent'
      }}>
        <Box component="script" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Box component="article" itemScope itemType="https://schema.org/BlogPosting" sx={{ maxWidth: '100%', typography: 'body1' }}>
          <meta itemProp="headline" content={blogData.title} />
          {imageUrl && <meta itemProp="image" content={imageUrl} />}
          {canonicalUrl && <meta itemProp="url" content={canonicalUrl} />}
          <meta itemProp="datePublished" content={blogData.publishedAt} />
          <Box itemProp="articleBody">
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
        </Box>
      </Paper>
    </Container>
  );
};

export default DynamicBlogRenderer;