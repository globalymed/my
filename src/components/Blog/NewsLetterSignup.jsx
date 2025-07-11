"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubscribed(true)
    setEmail("")
  }

  if (isSubscribed) {
    return (
      <Card
        sx={{
          my: 6,
          backgroundColor: "#ecfdf5", // green-50
          border: "1px solid #bbf7d0", // border-green-200
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: "#16a34a", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#065f46", mb: 1 }}>
            Thank you for subscribing!
          </Typography>
          <Typography sx={{ color: "#047857" }}>
            You'll receive our weekly health insights in your inbox.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        my: 6,
        background: "linear-gradient(to right, #eff6ff, #f0fdfa)", // from-blue-50 to-teal-50
        border: "1px solid #bfdbfe" // border-blue-200
      }}
    >
      <CardContent sx={{ p: 4, textAlign: "center" }}>
        <EmailIcon sx={{ fontSize: 48, color: "#2563eb", mb: 2 }} />
        <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
          Get Weekly Health Insights
        </Typography>
        <Typography sx={{ color: "#4b5563", mb: 3, maxWidth: 480, mx: "auto" }}>
          Stay informed with expert advice, latest research, and patient stories delivered to your inbox.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            maxWidth: 480,
            mx: "auto"
          }}
        >
          <TextField
            type="email"
            placeholder="Enter your email address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1e40af" }
            }}
          >
            Subscribe
          </Button>
        </Box>

        <Typography variant="caption" sx={{ color: "#6b7280", mt: 2 }}>
          No spam. Unsubscribe anytime. Read our privacy policy.
        </Typography>
      </CardContent>
    </Card>
  )
}
