import { useState, useEffect } from "react"
import { Box, IconButton, Tooltip } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import LinkIcon from "@mui/icons-material/Link"
import CheckIcon from "@mui/icons-material/Check"

export default function SocialShare() {
    const [isSaved, setIsSaved] = useState(false)
    const [isLinkCopied, setIsLinkCopied] = useState(false)
    const [shareUrl, setShareUrl] = useState("")
    const [shareTitle, setShareTitle] = useState("")

    useEffect(() => {
        const url = window.location.href
        setShareUrl(encodeURIComponent(url))
        setShareTitle(encodeURIComponent("Understanding Cardiac Health: A Comprehensive Guide"))
    }, [])

    const handleSave = () => {
        setIsSaved((prev) => !prev)
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setIsLinkCopied(true)
            setTimeout(() => setIsLinkCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy link", err)
        }
    }

    return (
        <Box
            sx={{
                position: "fixed",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                zIndex: 40,
                display: { xs: "none", lg: "flex" },
                flexDirection: "column",
                gap: 1,
            }}
        >
            <Tooltip title="Save to Favorites" placement="right">
                <IconButton
                    size="small"
                    onClick={handleSave}
                    sx={{
                        bgcolor: isSaved ? "rgba(254, 226, 226, 1)" : "transparent",
                        border: isSaved ? "1px solid rgba(254, 202, 202, 1)" : "1px solid rgba(229, 231, 235, 1)",
                    }}
                >
                    {isSaved ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
            </Tooltip>

            <Tooltip title="Copy Link" placement="right">
                <IconButton size="small" onClick={handleCopyLink} sx={{ bgcolor: "transparent" }}>
                    {isLinkCopied ? (
                        <CheckIcon fontSize="small" sx={{ color: "green" }} />
                    ) : (
                        <LinkIcon fontSize="small" />
                    )}
                </IconButton>
            </Tooltip>

            <Tooltip title="Share on Facebook" placement="right">
                <IconButton
                    size="small"
                    component="a"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FacebookIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Share on Twitter" placement="right">
                <IconButton
                    size="small"
                    component="a"
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TwitterIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Share on LinkedIn" placement="right">
                <IconButton
                    size="small"
                    component="a"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LinkedInIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
