import React, { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from "@mui/material"
import ListIcon from "@mui/icons-material/List"

const tocItems = [
  { id: "introduction", title: "Introduction", level: 1 },
  { id: "risk-factors", title: "Risk Factors", level: 1 },
  { id: "genetic-factors", title: "Genetic Factors", level: 2 },
  { id: "lifestyle-factors", title: "Lifestyle Factors", level: 2 },
  { id: "prevention-strategies", title: "Prevention Strategies", level: 1 },
  { id: "diet-exercise", title: "Diet and Exercise", level: 2 },
  { id: "regular-checkups", title: "Regular Checkups", level: 2 },
  { id: "treatment-options", title: "Treatment Options", level: 1 },
  { id: "conclusion", title: "Conclusion", level: 1 },
]

export default function TableOfContents() {
  const [activeId, setActiveId] = useState("")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200)

      const sections = tocItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(tocItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box
      sx={{
        position: isSticky ? "sticky" : "relative",
        top: isSticky ? "96px" : "auto", // 24 (top-24) * 4px
        transition: "all 0.3s",
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
                  fontSize: "0.875rem",
                  textAlign: "left",
                  color: activeId === item.id ? "#1d4ed8" : "#4b5563", // blue-700 / gray-600
                  backgroundColor: activeId === item.id ? "#dbeafe" : "transparent", // blue-100
                  fontWeight: activeId === item.id ? 500 : 400,
                  "&:hover": {
                    backgroundColor: activeId === item.id ? "#dbeafe" : "#f3f4f6", // gray-100
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: 14 }} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
