"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Chip,
  Tabs,
  Tab,
  Box,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
  styled
} from "@mui/material"
import {
  Send,
  Phone,
  Videocam,
  Warning,
  Help,
  SmartToy,
  Mic,
  Circle
} from "@mui/icons-material"

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

const MessagesSection = () => {
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [supportCategory, setSupportCategory] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const ChatMessage = ({ isUser, avatar, name, message, time, isAI = false }) => (
    <Box
      display="flex"
      flexDirection={isUser ? "row-reverse" : "row"}
      alignItems="flex-start"
      gap={1.5}
      mb={2}
    >
      {isAI ? (
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.light",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SmartToy sx={{ fontSize: 16, color: "primary.main" }} />
        </Box>
      ) : (
        <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem" }}>{avatar}</Avatar>
      )}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: "80%",
          bgcolor: isUser ? "primary.main" : isAI ? "primary.light" : "grey.100",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderRadius: 2
        }}
      >
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            opacity: isUser ? 0.8 : 0.6,
            color: isUser ? "inherit" : "text.secondary"
          }}
        >
          {time}
        </Typography>
      </Paper>
    </Box>
  )

  const MessageList = ({ children, isAI = false }) => (
    <Box
      sx={{
        height: 384,
        overflow: "auto",
        pr: 2,
        bgcolor: isAI ? "transparent" : "transparent"
      }}
    >
      {children}
    </Box>
  )

  const DoctorChat = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            avatar={<Avatar>RK</Avatar>}
            title="Dr. Rajesh Kumar"
            subheader="Orthopedic Surgeon"
            action={
              <Box>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <Phone fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <Videocam fontSize="small" />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            <MessageList>
              <ChatMessage
                avatar="RK"
                message="Good morning Sarah! How are you feeling today? Any pain or discomfort?"
                time="Today, 9:15 AM"
              />
              <ChatMessage
                isUser
                avatar="SK"
                message="Morning doctor! Pain is manageable with the medication. Following all the instructions."
                time="Today, 9:32 AM"
              />
              <ChatMessage
                avatar="RK"
                message="Excellent! Keep taking the medication as prescribed. Your latest X-ray looks great. Recovery is on track."
                time="Today, 10:45 AM"
              />
              <ChatMessage
                isUser
                avatar="SK"
                message="That's great to hear! When can I start the physical therapy exercises?"
                time="Today, 11:02 AM"
              />
              <ChatMessage
                avatar="RK"
                message="We'll start gentle exercises on day 5 (Dec 23). I'll have the physiotherapist contact you tomorrow to schedule."
                time="Today, 11:15 AM"
              />
            </MessageList>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                size="small"
              />
              <IconButton color="primary">
                <Send />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Card>
            <CardHeader title={<Typography variant="h6">Chat History</Typography>} />
            <CardContent sx={{ pt: 0 }}>
              <List dense>
                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>RK</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="medium">Dr. Kumar</Typography>
                        <Chip label="Active" size="small" color="default" />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        We'll start gentle exercises on day 5...
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>AN</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Anesthesiologist</Typography>}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Pre-surgery consultation complete
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>PT</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="medium">Physiotherapist</Typography>}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Rehab plan discussion
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={<Typography variant="h6">Quick Actions</Typography>} />
            <CardContent sx={{ pt: 0 }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Videocam />}
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  Schedule Video Call
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Warning />}
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  Report Concern
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Help />}
                  fullWidth
                  sx={{ justifyContent: "flex-start" }}
                >
                  Ask Question
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )

  const Support = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Ask a Question"
            subheader="Get help from our support team"
          />
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={supportCategory}
                  label="Category"
                  onChange={(e) => setSupportCategory(e.target.value)}
                >
                  <MenuItem value="medical">Medical Question</MenuItem>
                  <MenuItem value="travel">Travel Assistance</MenuItem>
                  <MenuItem value="documentation">Documentation Help</MenuItem>
                  <MenuItem value="billing">Billing Inquiry</MenuItem>
                  <MenuItem value="technical">Technical Support</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Your Question"
                multiline
                rows={3}
                placeholder="Describe your question or concern..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
              <Button variant="contained" fullWidth>
                Submit Question
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Support History" />
          <CardContent>
            <Box sx={{ height: 256, overflow: "auto" }}>
              <List>
                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1.5,
                    flexDirection: "column",
                    alignItems: "flex-start"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                    <Typography variant="subtitle2">Travel Insurance Claim</Typography>
                    <Chip label="Resolved" size="small" color="success" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" mb={0.5}>
                    How to submit travel insurance claim for medical expenses
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dec 10, 2024
                  </Typography>
                </ListItem>

                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1.5,
                    flexDirection: "column",
                    alignItems: "flex-start"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                    <Typography variant="subtitle2">Airport Assistance</Typography>
                    <Chip label="In Progress" size="small" color="warning" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" mb={0.5}>
                    Request for wheelchair assistance at Delhi airport
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dec 12, 2024
                  </Typography>
                </ListItem>

                <ListItem
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    flexDirection: "column",
                    alignItems: "flex-start"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                    <Typography variant="subtitle2">Document Upload Issue</Typography>
                    <Chip label="Resolved" size="small" color="success" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" mb={0.5}>
                    Unable to upload passport scan
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dec 8, 2024
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const Emergency = () => (
    <Card>
      <CardHeader
        avatar={<Warning sx={{ color: "error.main" }} />}
        title={<Typography color="error.main" fontWeight="bold">Emergency Contact</Typography>}
        subheader="24/7 emergency support for urgent medical situations"
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Paper
            sx={{
              p: 2,
              bgcolor: "error.light",
              border: 1,
              borderColor: "error.main"
            }}
          >
            <Typography variant="h6" color="error.dark" fontWeight="bold" mb={1}>
              Medical Emergency
            </Typography>
            <Typography variant="body2" color="error.dark" mb={1.5}>
              For immediate medical emergencies, call local emergency services first, then contact us.
            </Typography>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<Phone />}
            >
              Call Emergency Line: +91-11-2345-6789
            </Button>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Hospital Emergency
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Apollo Hospital Emergency Room
                </Typography>
                <Button variant="outlined" fullWidth startIcon={<Phone />}>
                  +91-11-2692-5858
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: "divider" }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  MEDIYATRA Support
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  24/7 Patient Support Line
                </Typography>
                <Button variant="outlined" fullWidth startIcon={<Phone />}>
                  +1-800-MEDIYATRA
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            sx={{
              p: 2,
              bgcolor: "warning.light",
              border: 1,
              borderColor: "warning.main"
            }}
          >
            <Typography variant="h6" color="warning.dark" fontWeight="bold" mb={1}>
              When to Call Emergency
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: "warning.dark" }}>
              <Typography component="li" variant="body2">
                Severe pain not relieved by medication
              </Typography>
              <Typography component="li" variant="body2">
                Signs of infection (fever, excessive swelling)
              </Typography>
              <Typography component="li" variant="body2">
                Difficulty breathing or chest pain
              </Typography>
              <Typography component="li" variant="body2">
                Sudden numbness or inability to move
              </Typography>
              <Typography component="li" variant="body2">
                Heavy bleeding or wound complications
              </Typography>
            </Box>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  )

  const AIChat = () => (
    <Card>
      <CardHeader
        avatar={<SmartToy sx={{ color: "primary.main" }} />}
        title="AI Medical Assistant"
        subheader="Get instant answers to your medical and recovery questions"
      />
      <CardContent>
        <MessageList isAI>
          <ChatMessage
            isAI
            message="Hello Sarah! I'm your AI medical assistant. I can help answer questions about your recovery, medications, exercises, and more. What would you like to know?"
            time="AI Assistant"
          />
          <ChatMessage
            isUser
            avatar="SK"
            message="Is it normal to feel some stiffness in my knee after surgery?"
            time="You"
          />
          <Box
            display="flex"
            alignItems="flex-start"
            gap={1.5}
            mb={2}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <SmartToy sx={{ fontSize: 16, color: "primary.main" }} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: "80%",
                bgcolor: "primary.light",
                borderRadius: 2
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Yes, some stiffness and limited range of motion is completely normal after knee replacement
                surgery. This typically improves with gentle exercises and physical therapy. Here are some tips:
              </Typography>
              <Box component="ul" sx={{ pl: 2, my: 1 }}>
                <Typography component="li" variant="body2">
                  Gentle ankle pumps every hour
                </Typography>
                <Typography component="li" variant="body2">
                  Ice application for 15-20 minutes
                </Typography>
                <Typography component="li" variant="body2">
                  Follow your prescribed exercise routine
                </Typography>
                <Typography component="li" variant="body2">
                  Take pain medication as directed
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                If you experience severe pain or concerning symptoms, please contact Dr. Kumar immediately.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI Assistant
              </Typography>
            </Paper>
          </Box>
          <ChatMessage
            isUser
            avatar="SK"
            message="Thank you! When should I be concerned about the swelling?"
            time="You"
          />
          <Box
            display="flex"
            alignItems="flex-start"
            gap={1.5}
            mb={2}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <SmartToy sx={{ fontSize: 16, color: "primary.main" }} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: "80%",
                bgcolor: "primary.light",
                borderRadius: 2
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Some swelling is expected for the first few weeks. Contact your doctor if you notice:
              </Typography>
              <Box component="ul" sx={{ pl: 2, my: 1 }}>
                <Typography component="li" variant="body2">
                  Sudden increase in swelling
                </Typography>
                <Typography component="li" variant="body2">
                  Redness or warmth around the incision
                </Typography>
                <Typography component="li" variant="body2">
                  Fever above 101°F (38.3°C)
                </Typography>
                <Typography component="li" variant="body2">
                  Unusual pain or tenderness
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Elevating your leg and using ice can help manage normal swelling.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI Assistant
              </Typography>
            </Paper>
          </Box>
        </MessageList>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            placeholder="Ask me anything about your recovery..."
            size="small"
          />
          <IconButton>
            <Mic />
          </IconButton>
          <IconButton color="primary">
            <Send />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Messages & Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Secure communication with your medical team
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                width: 'fit-content',
              }}
            >
          <Tab label="Doctor Chat" />
          <Tab label="Support" />
          <Tab label="Emergency" />
          <Tab label="AI Assistant" />
        </StyledTabs>

        {activeTab === 0 && <DoctorChat />}
        {activeTab === 1 && <Support />}
        {activeTab === 2 && <Emergency />}
        {activeTab === 3 && <AIChat />}
      </Box>
    </Box>
  )
}

export default MessagesSection;