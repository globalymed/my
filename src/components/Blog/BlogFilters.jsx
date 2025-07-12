"use client"

import { useState, useEffect } from "react"
import {
    Box,
    InputBase,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    Typography,
    Chip,
    Paper,
    useMediaQuery
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import CloseIcon from "@mui/icons-material/Close"

export function BlogFilters() {
    const [isSticky, setIsSticky] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState([])

    const treatmentTypes = ["Cardiology", "Orthopedics", "IVF", "Dermatology", "Neurology"]
    const contentTypes = ["Guides", "Patient Stories", "Research", "News"]
    const dateRanges = ["Last 7 days", "Last month", "Last 3 months", "All time"]

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const removeFilter = (filter) => {
        setSelectedFilters((prev) => prev.filter((f) => f !== filter))
    }

    const isMobile = useMediaQuery("(max-width: 1024px)")

    return (
        <Box
            id="blog-filters"
            sx={{
                bgcolor: "white",
                borderBottom: "1px solid #e5e7eb",
                transition: "all 0.3s ease",
                position: isSticky ? "fixed" : "relative",
                top: 0,
                left: 0,
                right: 0,
                zIndex: isSticky ? 50 : "auto",
                boxShadow: isSticky ? 3 : "none"
            }}
        >
            <Box sx={{ maxWidth: "1280px", mx: "auto", px: 2, py: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    {/* Search */}
                    <Box
                        sx={{
                            position: "relative",
                            flex: 1,
                            maxWidth: 400
                        }}
                    >
                        <SearchIcon
                            sx={{
                                position: "absolute",
                                left: 12,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "gray",
                                fontSize: 18
                            }}
                        />
                        <InputBase
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: "100%",
                                pl: 5,
                                pr: 1,
                                py: 1,
                                border: "1px solid #d1d5db",
                                borderRadius: 1
                            }}
                        />
                    </Box>

                    {/* Filters */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <FormControl sx={{ minWidth: 180 }}>
                            <Select displayEmpty defaultValue="">
                                <MenuItem disabled value="">
                                    Treatment Type
                                </MenuItem>
                                {treatmentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 150 }}>
                            <Select displayEmpty defaultValue="">
                                <MenuItem disabled value="">
                                    Content Type
                                </MenuItem>
                                {contentTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 140 }}>
                            <Select displayEmpty defaultValue="">
                                <MenuItem disabled value="">
                                    Date Range
                                </MenuItem>
                                {dateRanges.map((range) => (
                                    <MenuItem key={range} value={range}>
                                        {range}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton
                            sx={{
                                border: "1px solid #d1d5db",
                                px: 2,
                                py: 0.5,
                                fontSize: "0.875rem"
                            }}
                        >
                            <FilterListIcon sx={{ fontSize: 18, mr: 1 }} />
                            Sort: Newest
                        </IconButton>
                    </Box>
                </Box>

                {/* Active Filters */}
                {selectedFilters.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedFilters.map((filter) => (
                            <Chip
                                key={filter}
                                label={filter}
                                variant="outlined"
                                onDelete={() => removeFilter(filter)}
                                deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    )
}
