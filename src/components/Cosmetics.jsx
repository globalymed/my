import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Cosmetic = () => (
  <Box sx={{ display: 'block', p: 3 }}>
    {/* Title */}
    <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
      Cosmetic Procedures
    </Typography>

    {/* Description */}
    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
      Cosmetic procedures include surgical and non-surgical treatments designed to enhance appearance by reshaping structures of the body, reducing signs of aging, or improving skin and hair quality. These treatments can be elective (purely for aesthetic purposes) or reconstructive (to correct deformities or injuries).
    </Typography>

    <Box
      component="img"
      src="/cosmetics/cosmetics.jpg" // <-- Update with your actual image path
      alt="Dental Treatment"
      sx={{
        width: "100%",
        maxWidth: 700,
        height: "auto",
        borderRadius: 2,
        boxShadow: 3,
        display: "block",
        mx: "auto", // centers the image horizontally
        mb: 2,
      }}
    />

    {/* Introduction */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Introduction to Cosmetic Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Cosmetic procedures can enhance self-confidence, reverse signs of aging, correct congenital deformities, repair damage from accidents or injuries, and improve body contouring and symmetry.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            People of all ages and backgrounds consider cosmetic treatments, including:
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Aging Individuals: Seeking anti-aging treatments (Botox, fillers, facelifts).
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Post-Pregnancy: Mothers opting for 'mommy makeovers' (tummy tuck, breast lift).
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Weight Loss Patients: Addressing excess skin after significant weight loss.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Reconstructive Needs: Burn victims, accident survivors, or those with genetic deformities.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Beauty & Aesthetic Goals: Individuals desiring enhancements like lip augmentation or rhinoplasty.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>

    {/* Surgical Cosmetic Procedures */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Surgical Cosmetic Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Surgical cosmetic procedures involve incisions and typically require anesthesia, with longer recovery times but often more dramatic and long-lasting results.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
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
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Facelift (Rhytidectomy) – Tightens skin, reduces wrinkles.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Rhinoplasty (Nose Job) – Reshapes the nose for aesthetic or breathing improvement.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Liposuction – Removes stubborn fat from areas like abdomen, thighs, arms.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Breast Augmentation – Enhances breast size using implants or fat transfer.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Tummy Tuck (Abdominoplasty) – Tightens abdominal muscles and removes excess skin.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Eyelid Surgery (Blepharoplasty) – Removes sagging eyelid skin for a youthful look.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Hair Transplant – Moves hair follicles to balding areas for fuller hair.
              </Typography>
            </Box>
          </Box>

          {/* Image Section */}
          <Box
            component="img"
            src="cosmetics/surgical.jpg"
            alt="Surgical Cosmetics"
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
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Dramatic, long-lasting results; can address significant aesthetic concerns.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Infection, scarring, asymmetry, poor wound healing, excessive bleeding, anesthesia complications.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Non-Surgical Cosmetic Procedures */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Non-Surgical Cosmetic Procedures
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Non-surgical procedures offer less invasive options with minimal downtime, though results may be more subtle and temporary compared to surgical alternatives.
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
                Botox & Dysport – Smooths wrinkles by relaxing facial muscles.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Dermal Fillers – Adds volume to lips, cheeks, and other facial areas.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Laser Skin Resurfacing – Reduces scars, pigmentation, and fine lines.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Chemical Peels – Removes damaged skin layers to reveal fresher skin.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Microneedling – Stimulates collagen for skin rejuvenation.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                CoolSculpting (Cryolipolysis) – Freezes fat cells for non-invasive body contouring.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Thread Lift – Lifts sagging skin using dissolvable sutures.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              Minimal downtime, lower cost, less risk than surgery, gradual enhancement.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Risks & Complications
            </Typography>
            <Typography variant="body2" paragraph>
              Temporary redness, swelling, bruising, allergic reactions, uneven results requiring touch-ups.
            </Typography>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/cosmetics/cosmetics2.jpg"
            alt="Non-Surgical Cosmetics"
            sx={{
              width: "100%",
              maxWidth: 300,
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

    {/* Botox and Dermal Fillers */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Botox and Dermal Fillers
        </Typography>
      </AccordionSummary>
      <Box
        component="img"
        src="/cosmetics/dermal fillers.jpg"
        alt="Dermal Fillers"
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
          Botox (Botulinum Toxin): A purified neurotoxin that temporarily relaxes facial muscles to reduce wrinkles and fine lines. Dermal Fillers: Gel-like substances (commonly hyaluronic acid) injected under the skin to restore volume, plump lips, and smooth lines.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Procedure Time: 15–30 minutes.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Botox: The targeted area (forehead, crow's feet, frown lines) is cleaned. Small amounts of Botox are injected into muscles using a fine needle.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Dermal Fillers: A numbing cream is applied to the injection area. Fillers (hyaluronic acid, collagen, or fat) are injected into cheeks, lips, jawline, or under-eye hollows.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Recovery: No downtime; minor bruising or swelling may occur.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Duration of Results: Botox lasts 3–6 months, fillers 6–24 months.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Recovery Time
        </Typography>
        <Typography variant="body2" paragraph>
          Immediate return to normal activities; avoid strenuous exercise for 24 hours.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Quick, non-invasive, no anesthesia required. Smooths wrinkles, restores facial volume. Prevents new wrinkles from forming.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Botox: Temporary bruising, headaches, drooping eyelids (if injected incorrectly). Fillers: Allergic reactions, overfilling, uneven results, rare risk of vascular occlusion (blocked blood vessels).
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Rhinoplasty */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Rhinoplasty (Nose Reshaping Surgery)
        </Typography>
      </AccordionSummary>
      <Box
        component="img"
        src="/cosmetics/rhinoplasty.webp" // <-- Update with your actual image path
        alt="Dental Treatment"
        sx={{
          width: "100%",
          maxWidth: 700,
          height: "auto",
          borderRadius: 2,
          boxShadow: 3,
          display: "block",
          mx: "auto", // centers the image horizontally
          mb: 2,
          px: 2,
        }}
      />
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Rhinoplasty (nose job) reshapes the nose for aesthetic or functional improvements, such as fixing a crooked nose, hump, wide nostrils, or breathing issues (deviated septum).
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Initial Consultation & Planning: Surgeon evaluates medical history, expectations, and suitability. Some clinics offer 3D imaging to preview results.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Anesthesia: General or local anesthesia with sedation.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Incisions: Open rhinoplasty: A small cut between the nostrils. Closed rhinoplasty: Incisions inside the nose (leaves no visible scars).
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Reshaping the Structure: Cartilage and bone are adjusted or grafts are placed. In some cases, cartilage from the ear or rib is used.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Nasal Tissues Are Repositioned & Sutured. A nasal splint is placed for support.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Follow-up: Stitches removal usually after 7–14 days. Final results visible in weeks to months as swelling subsides.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Recovery Time
        </Typography>
        <Typography variant="body2" paragraph>
          Swelling & bruising: 2–4 weeks. Final results: 6 months–1 year as swelling gradually subsides.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Enhances facial symmetry and improves breathing. Permanent results.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Difficulty breathing, infection, scarring, dissatisfaction with results (revision surgery may be needed).
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Liposuction */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Liposuction
        </Typography>
      </AccordionSummary>
      <Box
        component="img"
        src="/cosmetics/liposuction.jpg" // <-- Update with your actual image path
        alt="Dental Treatment"
        sx={{
          width: "100%",
          maxWidth: 700,
          height: "auto",
          borderRadius: 2,
          boxShadow: 3,
          display: "block",
          mx: "auto", // centers the image horizontally
          mb: 2,
          px: 2,
        }}
      />
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Liposuction is a fat removal surgery that contours the body by suctioning out excess fat from areas like abdomen, thighs, arms, and chin.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Initial Consultation: Surgeon assesses fat deposits and discusses goals.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Anesthesia: General or local anesthesia.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Tumescent Solution Injection: A saline + lidocaine + epinephrine solution is injected to reduce bleeding and pain.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Fat Removal: A cannula (thin tube) is inserted through small incisions, and fat is suctioned out.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Incisions Are Closed & Bandaged.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Compression Garments: Worn for 6 weeks to reduce swelling.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Recovery Time
        </Typography>
        <Typography variant="body2" paragraph>
          Swelling & bruising: 2–4 weeks. Final results: Visible in 3–6 months.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Permanent fat removal (if weight is maintained). Improves body proportions.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Lumpy skin, asymmetry, fluid buildup. Blood clots (rare but serious). Skin necrosis (tissue death in the treated area).
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Laser Skin Resurfacing */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Laser Skin Resurfacing
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          A treatment that uses focused light beams to remove damaged skin layers, stimulate collagen production, and reveal smoother, younger-looking skin.
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
                Procedure Time: 30–90 minutes.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Preparation: Face is cleansed and numbing cream is applied.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Treatment: Laser passes over targeted areas, removing outer skin layers.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Cooling: Treated areas are cooled to reduce discomfort.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Recovery: 5–7 days of redness and peeling.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Results: Gradual improvement over weeks as collagen rebuilds.
              </Typography>
            </Box>
          </Box>
          {/* Image Section */}
          <Box
            component="img"
            src="/cosmetics/laser skin resurfacing.jpg"
            alt="Laser Skin Resurfacing"
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
          Recovery Time
        </Typography>
        <Typography variant="body2" paragraph>
          Redness for 1-2 weeks; sun protection essential for several months.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Reduces fine lines, scars, sun damage, and uneven skin tone. Stimulates natural collagen production.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Prolonged redness, hyperpigmentation, scarring (rare), infection (uncommon).
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* CoolSculpting */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          CoolSculpting (Cryolipolysis)
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          A non-invasive fat reduction procedure that freezes and eliminates stubborn fat cells without surgery or downtime.
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
                Procedure Time: 35–60 minutes per area.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Application: Cooling panels are placed on target areas.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Freezing Process: Fat cells are crystallized (frozen) at specific temperatures.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Massage: Area is massaged after panel removal to break up frozen fat cells.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Natural Elimination: Body naturally processes and removes dead fat cells over time.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Results: Visible fat reduction in 2–3 months.
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Recovery Time
            </Typography>
            <Typography variant="body2" paragraph>
              No downtime; temporary redness, swelling, or numbness possible.
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Benefits
            </Typography>
            <Typography variant="body2" paragraph>
              No surgery or anesthesia required. Permanent fat cell elimination. Resume normal activities immediately.
            </Typography>
          </Box>

          {/* Image Section */}
          <Box
            component="img"
            src="/cosmetics/coolsculpting.jpg"
            alt="CoolSculpting"
            sx={{
              width: "100%",
              maxWidth: 300,
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
          Temporary numbness, redness, or bruising. Paradoxical adipose hyperplasia (rare condition where fat cells grow larger instead of smaller).
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
          Information about pricing factors and common questions about cosmetic procedures.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Factors influencing cost: Type of procedure (non-surgical options are generally cheaper), surgeon's expertise & location, facility fees & aftercare.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Estimated prices: Botox ($200–$800 per session), Rhinoplasty ($4,000–$15,000), Breast Augmentation ($5,000–$10,000), Liposuction ($3,000–$7,000).
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Are cosmetic procedures painful? Surgical procedures require anesthesia, while non-surgical treatments involve minimal discomfort.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            How long do results last? Botox lasts 3–6 months, while surgical enhancements can last a lifetime with proper care.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Can men get cosmetic procedures? Yes, popular treatments for men include rhinoplasty, Botox, and liposuction.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Understanding costs helps with financial planning for cosmetic care.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Insurance typically doesn't cover cosmetic procedures; financing options may have high interest rates.
        </Typography>
      </AccordionDetails>
    </Accordion>

    {/* Tips & Next Steps */}
    <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
        <Typography variant="h6" fontWeight={600}>
          Tips & Next Steps
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Typography variant="body1" paragraph>
          Guidance for those considering cosmetic procedures.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Procedure
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Choose a Board-Certified Surgeon: Ensure safety and quality.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Set Realistic Expectations: Understand what's achievable.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Prioritize Aftercare: Follow post-op instructions for best results.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Consult Multiple Clinics: Compare procedures, prices, and reviews.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Follow-Up Appointments: Attend all scheduled check-ups to monitor healing.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Avoid Strenuous Activity: For at least 2–6 weeks post-surgery.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Sun Protection: Essential after laser treatments or chemical peels.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Patience: Some results take months to fully appear.
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Benefits
        </Typography>
        <Typography variant="body2" paragraph>
          Proper planning and aftercare significantly improve outcomes and satisfaction.
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Risks & Complications
        </Typography>
        <Typography variant="body2" paragraph>
          Rushing decisions or choosing providers based solely on cost can lead to complications or unsatisfactory results.
        </Typography>
      </AccordionDetails>
    </Accordion>
  </Box>
);

export default Cosmetic;
