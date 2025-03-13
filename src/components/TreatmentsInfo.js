import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

// Treatment data
const treatmentsData = {
  ivf: {
    title: "IVF (In Vitro Fertilization) Treatments",
    description: "IVF is an advanced fertility treatment that involves fertilizing an egg outside the body and implanting it in the uterus. It is used to treat infertility due to various reasons like blocked fallopian tubes, male infertility, ovulation disorders, endometriosis, or unexplained infertility.",
    treatments: [
      {
        name: "Conventional IVF",
        description: "Conventional IVF is the most common assisted reproductive technology. It involves stimulating the ovaries to produce multiple eggs, retrieving them, fertilizing them in a lab, and transferring the best embryos into the uterus.",
        procedure: [
          "Ovarian Stimulation: Daily hormone injections (FSH & LH) for 8–14 days to stimulate multiple egg production. Regular monitoring via blood tests and ultrasounds.",
          "Egg Retrieval (Oocyte Aspiration): Once eggs mature (18-22 mm), a trigger shot (hCG) is given. 34–36 hours later, eggs are retrieved using a transvaginal needle under mild sedation.",
          "Sperm Collection & Fertilization: A sperm sample is collected and processed. Eggs and sperm are combined in a culture dish for fertilization.",
          "Embryo Culture & Selection: Fertilized eggs (zygotes) are monitored for 3-5 days. The best-quality embryos are selected.",
          "Embryo Transfer (ET): 1 or 2 embryos are transferred into the uterus using a thin catheter.",
          "Pregnancy Test (Beta hCG): After 10–14 days, a blood test confirms pregnancy."
        ],
        recovery: "1–2 days after embryo transfer.",
        benefits: "Higher success rates, allows embryo screening, treats severe infertility cases.",
        risks: "Ovarian Hyperstimulation Syndrome (OHSS): Fluid buildup in abdomen due to excessive hormone response. Multiple Pregnancies: Higher chance of twins or triplets. Ectopic Pregnancy: Implantation outside the uterus."
      },
      {
        name: "ICSI (Intracytoplasmic Sperm Injection)",
        description: "A specialized form of IVF where a single sperm is injected directly into an egg to increase fertilization success. Used for male infertility (low sperm count, poor motility, DNA fragmentation).",
        procedure: [
          "Same as conventional IVF, except fertilization:",
          "A skilled embryologist selects a single sperm under a microscope.",
          "The sperm is injected into the egg using a microneedle."
        ],
        benefits: "Overcomes severe male infertility, improves fertilization rates.",
        risks: "Higher chance of genetic disorders, birth defects, and failed fertilization."
      },
      {
        name: "Frozen Embryo Transfer (FET)",
        description: "A previously frozen embryo from an earlier IVF cycle is thawed and transferred to the uterus.",
        procedure: [
          "The patient's uterine lining is prepared using hormones.",
          "The embryo is thawed and placed into the uterus."
        ],
        benefits: "Less stressful than fresh cycles, higher success rates in some cases.",
        risks: "Lower implantation rate compared to fresh embryos, embryo damage during thawing."
      },
      {
        name: "Mini IVF (Mild Stimulation IVF)",
        description: "A low-dose IVF approach using minimal stimulation to retrieve fewer but high-quality eggs.",
        procedure: [
          "Lower doses of hormone injections for controlled egg growth.",
          "Fewer eggs retrieved and fertilized using ICSI or IVF."
        ],
        benefits: "Fewer side effects, reduced cost.",
        risks: "Lower egg count, may require multiple cycles."
      },
      {
        name: "Preimplantation Genetic Testing (PGT)",
        description: "A genetic test to screen embryos for chromosomal abnormalities or inherited diseases before implantation.",
        procedure: [
          "A small biopsy is taken from a blastocyst (5-day-old embryo).",
          "DNA is analyzed for genetic defects."
        ],
        benefits: "Prevents genetic diseases, improves IVF success.",
        risks: "Embryo damage, misdiagnosis."
      }
    ]
  },
  cosmetic: {
    title: "Cosmetic Treatments",
    description: "Cosmetic procedures are performed to enhance appearance, correct aesthetic concerns, or reverse aging signs. They can be surgical (involving incisions) or non-surgical (minimally invasive treatments).",
    treatments: [
      {
        name: "Botox and Dermal Fillers",
        description: "Botox (Botulinum Toxin): A purified neurotoxin that temporarily relaxes facial muscles to reduce wrinkles and fine lines. Dermal Fillers: Gel-like substances (commonly hyaluronic acid) injected under the skin to restore volume, plump lips, and smooth lines.",
        procedure: [
          "Botox: The targeted area (forehead, crow's feet, frown lines) is cleaned. Small amounts of Botox are injected into muscles using a fine needle. The procedure takes 10-20 minutes with no downtime.",
          "Dermal Fillers: A numbing cream is applied to the injection area. Fillers (hyaluronic acid, collagen, or fat) are injected into cheeks, lips, jawline, or under-eye hollows. The area is gently massaged for even distribution."
        ],
        recovery: "Botox: Effects appear in 3–7 days, lasting 3–6 months. Fillers: Immediate results, lasting 6 months–2 years depending on the filler type.",
        benefits: "Quick, non-invasive, no anesthesia required. Smooths wrinkles, restores facial volume. Prevents new wrinkles from forming.",
        risks: "Botox: Temporary bruising, headaches, drooping eyelids (if injected incorrectly). Fillers: Allergic reactions, overfilling, uneven results, rare risk of vascular occlusion (blocked blood vessels)."
      },
      {
        name: "Rhinoplasty (Nose Reshaping Surgery)",
        description: "Rhinoplasty (nose job) reshapes the nose for aesthetic or functional improvements, such as fixing a crooked nose, hump, wide nostrils, or breathing issues (deviated septum).",
        procedure: [
          "Anesthesia: General or local anesthesia with sedation.",
          "Incisions: Open rhinoplasty: A small cut between the nostrils. Closed rhinoplasty: Incisions inside the nose (leaves no visible scars).",
          "Reshaping the Structure: Cartilage and bone are adjusted or grafts are placed. In some cases, cartilage from the ear or rib is used.",
          "Nasal Tissues Are Repositioned & Sutured. A nasal splint is placed for support."
        ],
        recovery: "Swelling & bruising: 2–4 weeks. Final results: 6 months–1 year as swelling gradually subsides.",
        benefits: "Enhances facial symmetry and improves breathing. Permanent results.",
        risks: "Difficulty breathing, infection, scarring, dissatisfaction with results (revision surgery may be needed)."
      },
      {
        name: "Liposuction",
        description: "Liposuction is a fat removal surgery that contours the body by suctioning out excess fat from areas like abdomen, thighs, arms, and chin.",
        procedure: [
          "Anesthesia: General or local anesthesia.",
          "Tumescent Solution Injection: A saline + lidocaine + epinephrine solution is injected to reduce bleeding and pain.",
          "Fat Removal: A cannula (thin tube) is inserted through small incisions, and fat is suctioned out.",
          "Incisions Are Closed & Bandaged."
        ],
        recovery: "Swelling & bruising: 2–4 weeks. Compression garments: Worn for 6 weeks to reduce swelling. Final results: Visible in 3–6 months.",
        benefits: "Permanent fat removal (if weight is maintained). Improves body proportions.",
        risks: "Lumpy skin, asymmetry, fluid buildup. Blood clots (rare but serious). Skin necrosis (tissue death in the treated area)."
      }
    ]
  },
  hair: {
    title: "Hair Treatments",
    description: "Hair restoration treatments help with baldness, hair thinning, and scalp conditions.",
    treatments: [
      {
        name: "Hair Transplant (FUE & FUT)",
        description: "A surgical procedure that transplants hair follicles from a donor area (back of the scalp) to bald or thinning areas.",
        procedure: [
          "FUE (Follicular Unit Extraction): Individual hair follicles are extracted one by one and implanted into balding areas. No stitches, minimal scarring.",
          "FUT (Follicular Unit Transplantation): A strip of skin with hair follicles is removed, divided into grafts, and transplanted. Leaves a linear scar on the donor site."
        ],
        recovery: "Scabbing & redness: 7–10 days. Hair shedding (shock loss): 2–4 weeks post-surgery. New hair growth starts in 3–6 months, full results in 12–18 months.",
        benefits: "Permanent, natural hair growth. FUE has no visible scarring.",
        risks: "Shock loss (temporary shedding of existing hair). Infection, unnatural-looking results."
      },
      {
        name: "PRP (Platelet-Rich Plasma) for Hair Loss",
        description: "A non-surgical hair restoration treatment using platelet-rich plasma from your own blood to stimulate hair growth.",
        procedure: [
          "A small amount of blood is drawn.",
          "Blood is spun in a centrifuge to separate the platelet-rich plasma.",
          "PRP is injected into the scalp to stimulate hair follicles."
        ],
        recovery: "No downtime. Results appear after 3–6 sessions over several months.",
        benefits: "Safe, natural, no surgery needed. Strengthens existing hair follicles.",
        risks: "Mild swelling, soreness, temporary hair shedding."
      }
    ]
  },
  dental: {
    title: "Dental Treatments",
    description: "Dental treatments restore oral health, function, and aesthetics.",
    treatments: [
      {
        name: "Dental Implants",
        description: "A permanent tooth replacement where a titanium post is implanted in the jawbone to hold an artificial tooth (crown).",
        procedure: [
          "Bone preparation (if needed): Bone grafting is done if jawbone density is low.",
          "Implant Placement: A titanium post is surgically placed in the jaw.",
          "Healing Period (Osseointegration): Takes 3–6 months as the implant fuses with bone.",
          "Crown Attachment: A custom-made tooth (crown) is fixed on the implant."
        ],
        benefits: "Permanent, durable. Prevents bone loss.",
        risks: "Implant failure (if bone doesn't integrate). Infection, nerve damage."
      },
      {
        name: "Root Canal Treatment (RCT)",
        description: "A procedure to save an infected or decayed tooth by removing the infected pulp and sealing it.",
        procedure: [
          "Anesthesia & Drilling: A hole is made to access the pulp.",
          "Infected Pulp Removal: Root canals are cleaned.",
          "Filling & Sealing: The space is filled with gutta-percha and sealed."
        ],
        benefits: "Saves natural teeth.",
        risks: "Tooth fracture, persistent infection."
      }
    ]
  }
};

const TreatmentsInfo = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('ivf');
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        pb: 1
      }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          Know Your Treatment
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab label="IVF" value="ivf" />
          <Tab label="Cosmetic" value="cosmetic" />
          <Tab label="Hair" value="hair" />
          <Tab label="Dental" value="dental" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 0 }}>
        {Object.keys(treatmentsData).map((category) => (
          <Box 
            key={category} 
            sx={{ 
              display: activeTab === category ? 'block' : 'none',
              p: 3
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600} color={theme.palette.primary.main}>
              {treatmentsData[category].title}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {treatmentsData[category].description}
            </Typography>
            
            {treatmentsData[category].treatments.map((treatment, index) => (
              <Accordion 
                key={index} 
                sx={{ 
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: 'none'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {treatment.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body1" paragraph>
                    {treatment.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    {treatment.procedure?.map((step, i) => (
                      <Typography component="li" variant="body2" key={i} sx={{ mb: 1 }}>
                        {step}
                      </Typography>
                    ))}
                  </Box>
                  
                  {treatment.recovery && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Recovery Time
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.recovery}
                      </Typography>
                    </>
                  )}
                  
                  {treatment.benefits && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Benefits
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.benefits}
                      </Typography>
                    </>
                  )}
                  
                  {treatment.risks && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Risks & Complications
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {treatment.risks}
                      </Typography>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </DialogContent>
      
      <DialogActions sx={{ borderTop: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreatmentsInfo;
