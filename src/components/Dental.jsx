import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Dental = () => (
  <Box sx={{ display: 'block', p: 3 }}>
    {/* Title */}
    <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
      Dental Procedures
    </Typography>

    {/* Description */}
    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
      Dental procedures cover a wide range of treatments aimed at improving oral health, function, and appearance. They include preventive care, restorative treatments, cosmetic enhancements, and surgical interventions.
    </Typography>

    {/* Image */}
    <Box
      component="img"
      src="/dental/dental.webp"
      alt="Dental Treatment"
      sx={{
        width: "100%",
        maxWidth: 700,
        height: "auto",
        borderRadius: 2,
        boxShadow: 3,
        display: "block",
        mx: "auto",
        mb: 2,
      }}
    />

    {/* Introduction */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Introduction to Dental Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Dental procedures are important to maintain oral hygiene, prevent infections, restore functionality for chewing and speaking, enhance aesthetic appearance, and prevent long-term complications like gum disease and tooth loss.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Anyone can benefit from dental procedures, especially those with tooth decay, missing teeth, gum disease, misaligned teeth, or seeking cosmetic improvements.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>

    {/* Preventive */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Preventive Dental Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="body1" paragraph>
              Procedures focused on preventing dental problems before they occur.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Dental Cleaning (Scaling & Polishing) – Removes plaque, tartar, and stains.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Fluoride Treatment – Strengthens enamel and prevents cavities.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Dental Sealants – Protective coating applied to prevent decay.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Oral Cancer Screening – Early detection of abnormal growths.
              </Typography>
            </Box>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/dental polishing.webp"
            alt="Dental Polishing"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
              mb: 2,
            }}
          />
        </Box>

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Minimal risks; temporary sensitivity possible.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Restorative */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Restorative Dental Procedures
        </Typography>
      </AccordionSummary>
      <Box
        component="img"
        src="/dental/dental filling.webp"
        alt="Dental Filling"
        sx={{
          width: "100%",
          maxWidth: 700,
          height: "auto",
          borderRadius: 2,
          boxShadow: 3,
          display: "block",
          mx: "auto",
          mb: 2,
          px: 1,
        }}
      />
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Treatments that repair or replace damaged teeth and restore oral function.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dental Fillings – Repairs cavities using composite resin, amalgam, or porcelain.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Root Canal Treatment (Endodontics) – Saves infected or damaged teeth.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dental Crowns – Caps placed over weak or broken teeth.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dental Bridges – Fixed replacements for missing teeth.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dentures (Partial/Complete) – Removable replacements for missing teeth.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dental Implants – Permanent solution for missing teeth using titanium posts.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Restores function and appearance, prevents further damage.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Infection, sensitivity, potential for retreatment in some cases.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Cosmetic */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Cosmetic Dental Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Treatments designed primarily to improve the appearance of teeth and smile.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Teeth Whitening (Bleaching) – Lightens stains for a brighter smile.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Dental Veneers – Thin porcelain covers for an improved appearance.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Gum Contouring – Reshapes gums for better symmetry.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Composite Bonding – Fixes chipped or discolored teeth with resin.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Enhanced appearance, increased confidence, minimal recovery time.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/gum contouring.webp"
            alt="gum contouring"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
              mb: 2,
            }}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Tooth sensitivity, uneven results, potential damage to enamel with some treatments.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Orthodontic */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Orthodontic Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Treatments that correct the alignment of teeth and jaws for improved function and appearance.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Traditional Braces – Metal brackets and wires to align teeth.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Invisalign (Clear Aligners) – Discreet teeth-straightening solution.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Retainers – Maintains alignment after braces.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Palatal Expanders – Widens upper jaw in children.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Improved bite, easier cleaning, enhanced appearance.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/dental braces.webp"
            alt="Dental Braces"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
              mb: 2,
            }}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Discomfort, temporary speech changes, potential relapse without retainer use.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Surgical */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Surgical Dental Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          More invasive treatments that require surgical intervention for complex dental issues.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Tooth Extraction – Removal of decayed, impacted, or infected teeth.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Wisdom Tooth Removal – Extraction of problematic wisdom teeth.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Bone Grafting – Strengthens jawbone for implants.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Gum Surgery (Periodontal Surgery) – Treats severe gum disease.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Resolves serious dental issues, prevents spread of infection, prepares for restorative work.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Risks & Complications
            </Typography>
            <Typography variant="body2" paragraph>
              Bleeding, swelling, infection, nerve damage in rare cases.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/dental surgery.webp"
            alt="Dental Surgery"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
            }}
          />
        </Box>

      </AccordionDetails>
    </Accordion>

    {/* Cavity Filling */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Procedure Details: Cavity Filling
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          A common procedure to repair teeth affected by decay.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Local Anesthesia – Numbs the tooth.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Decay Removal – Dentist drills out infected part.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Filling Application – Composite resin or amalgam is applied.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Hardening & Polishing – Filling is shaped and hardened with light.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Recovery Time
            </Typography>
            <Typography variant="body2" paragraph>
              Immediate return to normal activities, avoid hard foods for 24 hours.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Stops decay progression, restores tooth function, prevents pain.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/cavity filling.webp"
            alt="Cavity Filling"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
              mb: 2,
            }}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Tooth sensitivity, potential need for replacement over time.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Root Canal */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Procedure Details: Root Canal
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          A treatment to save severely infected or damaged teeth by removing the infected pulp.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Procedure
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Anesthesia & Isolation – The tooth is numbed and isolated.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Removal of Infection – Pulp is cleaned out.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Sealing – Canals are filled with a biocompatible material.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Crown Placement – A crown is added for protection.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Recovery Time
            </Typography>
            <Typography variant="body2" paragraph>
              1-2 weeks for full recovery, mild discomfort for a few days.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Saves natural teeth, eliminates pain, prevents extraction.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/dental/root canal.webp"
            alt="IVF Treatment"
            sx={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              display: "block",
              mx: { xs: "auto", md: 0 },
              mb: 2,
            }}
          />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Reinfection, tooth fracture, need for retreatment in some cases.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Dental Implant */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Procedure Details: Dental Implant
        </Typography>
      </AccordionSummary>
      <Box
        component="img"
        src="/dental/dental implant.webp"
        alt="Dental Treatment"
        sx={{
          width: "100%",
          maxWidth: 700,
          height: "auto",
          borderRadius: 2,
          boxShadow: 3,
          display: "block",
          mx: "auto",
          mb: 2,
          px: 2,
        }}
      />
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          A permanent solution for replacing missing teeth using titanium posts that fuse with the jawbone.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Consultation & X-rays – Dentist assesses jawbone health.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Implant Placement – Titanium post is surgically inserted.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Healing (Osseointegration) – Bone fuses with the implant over months.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Abutment & Crown Placement – The final artificial tooth is attached.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Recovery Time
        </Typography>
        <Typography variant="body2" paragraph>
          3-6 months for complete integration, initial healing within 1-2 weeks.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Looks and functions like natural teeth, prevents bone loss, doesn't affect adjacent teeth.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Infection, implant failure, nerve damage, sinus issues (for upper implants).
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Costs & FAQs */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Costs & FAQs
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Information about pricing factors and common questions about dental procedures.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Cost factors include: type of procedure, location, materials used, and dentist's expertise.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Estimated prices: Cleaning ($50-$200), Fillings ($100-$500), Root Canal ($500-$1,500), Whitening ($300-$1,000), Implants ($3,000-$6,000).
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Visit dentist every 6 months for routine checkups.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Most treatments use anesthesia, making them painless.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Teeth whitening typically lasts 6 months to 2 years, depending on lifestyle.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Understanding costs helps with financial planning for dental care.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Insurance coverage varies widely; out-of-pocket expenses may be significant for some procedures.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Aftercare & Tips */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Aftercare & Tips
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Guidance for recovery and maintaining results after dental procedures.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Maintain oral hygiene: Brush twice daily and floss regularly.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Avoid hard foods after procedures to prevent damage.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Use prescribed medications (antibiotics/pain relievers) as directed.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Attend regular dental visits to ensure long-term oral health.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Prioritize preventive care to avoid costly treatments.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Choose skilled dentists for complex procedures.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Get multiple consultations before major treatments.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Follow aftercare instructions for faster healing and better results.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Proper aftercare extends the lifespan of dental work and prevents complications.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Neglecting aftercare can lead to treatment failure and additional procedures.
        </Typography>
      </AccordionDetails>
    </Accordion>
  </Box>
);

export default Dental;
