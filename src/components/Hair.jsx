import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Hair = () => (
    <Box sx={{ display: 'block', p: 3 }}>
        {/* Title */}
        <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
            Hair Transplant & Hair Restoration
        </Typography>

        {/* Description */}
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Hair transplant is a surgical procedure that involves extracting hair follicles from one part of the body (usually the back of the scalp) and implanting them into areas affected by hair loss. It is a permanent solution for baldness and thinning hair, providing natural-looking results with minimal maintenance.
        </Typography>

        <Box
            component="img"
            src="/hair/hair.png"
            alt="Hair Treatment"
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

        {/* Accordion 1: Introduction */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Introduction to Hair Transplant & Hair Restoration
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Hair transplants provide a natural-looking solution for hair loss with minimal maintenance. Unlike temporary treatments, transplanted hair continues to grow naturally for a lifetime.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        People who experience the following conditions may benefit from a hair transplant:
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Male Pattern Baldness (Androgenetic Alopecia): The most common cause of hair loss in men. Hair recedes from the temples and crown, leading to a horseshoe-shaped pattern.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Female Pattern Baldness: Thinning on the crown or parting line without complete baldness. Can be caused by hormones, genetics, or stress.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Alopecia Areata: An autoimmune disorder causing patchy hair loss.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Scarring from Injuries or Surgery: Hair transplants can restore hair in areas affected by burns, scars, or previous surgeries.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Hair Loss Due to Medical Conditions: Some people experience hair loss due to conditions like thyroid disorders, iron deficiency, or lupus.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Unsuccessful Previous Hair Transplant: Some patients seek corrective hair transplants after poor results from an earlier procedure.
                    </Typography>
                </Box>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 2: Types of Hair Transplant Procedures */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Types of Hair Transplant Procedures
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography variant="body1" paragraph>
                            Several techniques are available for hair transplantation, each with its own advantages and considerations.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Procedure
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Follicular Unit Transplantation (FUT): A strip of scalp with healthy hair follicles is removed from the donor area, dissected into grafts, and implanted in the bald area. Leaves a linear scar on the donor site. Suitable for large areas of baldness.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Follicular Unit Extraction (FUE): Individual hair follicles are extracted from the donor area and transplanted one by one. No visible scarring, shorter recovery time. Ideal for people who prefer short hair.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Direct Hair Implantation (DHI): A modified version of FUE using a specialized tool for direct implantation. Faster recovery, more precise placement. Higher cost than traditional FUE.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Robotic Hair Transplant: Uses AI-assisted robotic technology to extract and implant follicles with high accuracy. Minimally invasive with excellent precision. Limited availability and expensive.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Synthetic Hair Transplant: Artificial hair fibers are implanted into the scalp. Suitable for people with insufficient donor hair. Requires periodic maintenance and may cause allergic reactions.
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Benefits
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Permanent solution for hair loss, natural-looking results, minimal maintenance required after healing.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Risks & Complications
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Infection, scarring, unnatural appearance if poorly performed, temporary shock loss (shedding before regrowth).
                        </Typography>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="hair/step.jpg"
                        alt="Hair Procedures"
                        sx={{
                            width: "100%",
                            maxHeight: 650,
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

        {/* Accordion 3: Step-by-Step Hair Transplant Process */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Step-by-Step Hair Transplant Process
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    The hair transplant procedure follows a systematic process to ensure optimal results.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Initial Consultation & Evaluation: Scalp analysis to determine the cause and extent of hair loss. Discussion of expectations, available techniques, and cost. Blood tests may be required to rule out medical causes of hair loss.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Donor Area Preparation: Hair in the donor area (back of the scalp) is trimmed. Local anesthesia is administered for a painless experience.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Extraction of Hair Follicles: FUE: Hair follicles are extracted individually using a micropunch tool. FUT: A strip of skin with hair follicles is removed and dissected into grafts.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Recipient Area Preparation: Tiny incisions are made in the bald area for implanting hair follicles. The doctor designs the hairline to ensure a natural look.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Implantation of Hair Grafts: Hair follicles are carefully placed into the incisions in a natural growth pattern.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Post-Procedure Care & Recovery: Bandages may be applied. Pain medication and antibiotics may be prescribed. Mild swelling and redness are common for a few days.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recovery Time
                </Typography>
                <Typography variant="body2" paragraph>
                    First Week: Redness, swelling, and mild discomfort. 2-3 Weeks: Transplanted hair sheds (shock loss). 3-4 Months: New hair begins to grow. 6-12 Months: Significant growth, final results appear.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Permanent solution with natural-looking results. Once healed, transplanted hair requires no special care.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Infection, scarring, unnatural hairline if poorly designed, temporary shock loss (initial shedding before regrowth).
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 4: Non-Surgical Hair Restoration Treatments */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Non-Surgical Hair Restoration Treatments
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    For those who aren't ready for surgery or have early-stage hair loss, several non-surgical options can help restore hair or slow hair loss.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                PRP (Platelet-Rich Plasma) Therapy: A patient's own blood is processed to extract growth factors and injected into the scalp. Stimulates hair growth, improves thickness.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Low-Level Laser Therapy (LLLT): Uses red light lasers to stimulate hair follicles. Painless, non-invasive, and effective for early-stage hair loss.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Hair Growth Medications: Minoxidil (Rogaine): Topical solution that slows hair loss and stimulates new growth. Finasteride (Propecia): Oral medication that prevents further hair loss in men.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Scalp Micropigmentation (SMP): Tattooing technique that creates the illusion of a shaved head or fuller hair.
                            </Typography>
                        </Box>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="/hair/non surgical.jpg"
                        alt="Non Surgical Hair Restoration"
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            height: "auto",
                            borderRadius: 2,
                            boxShadow: 3,
                            display: "block",
                            mx: { xs: "auto", md: 0, },
                            mb: 2,
                        }}
                    />
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recovery Time
                </Typography>
                <Typography variant="body2" paragraph>
                    Most non-surgical treatments require no downtime. Results may take 3-6 months to become noticeable.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    No surgery or anesthesia required, minimal to no downtime, lower cost than surgery, can be combined with surgical options for enhanced results.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Results may be temporary and require ongoing treatments, some medications may have side effects, results vary significantly between individuals.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 5: Risks, Side Effects, and Recovery */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Risks, Side Effects, and Recovery
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Understanding the potential risks and recovery process helps set realistic expectations for hair transplant procedures.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Common Side Effects: Swelling & Redness: Lasts a few days. Itching & Scabbing: Avoid scratching to prevent infection. Temporary Shedding (Shock Loss): Transplanted hair may fall out before regrowth begins.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Possible Complications: Infection: Rare, but possible if aftercare is not followed. Unnatural Hair Growth: Poorly performed transplants may result in an unnatural look. Scarring: More common with FUT.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Recovery Timeline: First Week: Redness, swelling, and mild discomfort. 2-3 Weeks: Transplanted hair sheds (shock loss). 3-4 Months: New hair begins to grow. 6-12 Months: Significant growth, final results appear.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recovery Time
                </Typography>
                <Typography variant="body2" paragraph>
                    Most patients return to work within 1-7 days depending on the procedure type. Avoid strenuous activity for 2 weeks. Protect the scalp from sun exposure for at least 4 weeks.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Understanding the recovery process helps manage expectations and ensures optimal healing.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Not following post-procedure care instructions can lead to complications and suboptimal results.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 6: Success Rates & Factors Affecting Results */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Success Rates & Factors Affecting Results
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Hair transplant success depends on various factors including technique, surgeon expertise, and patient characteristics.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Success Rate: FUT & FUE: 85–95% graft survival rate. PRP Therapy: 60–70% improvement in hair thickness.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Factors Affecting Success: Age: Younger patients may respond better. Donor Hair Quality: Thick, healthy donor hair leads to better results. Post-Surgery Care: Following aftercare guidelines ensures optimal growth.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    High success rates with modern techniques when performed by experienced surgeons.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Results may vary based on individual factors like age, hair type, and extent of hair loss.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 7: FAQs & Glossary */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    FAQs & Glossary
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Common questions about hair transplant procedures and terminology explained.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        How long does a hair transplant take? 4–8 hours, depending on the number of grafts.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Is the procedure painful? Local anesthesia prevents pain, but mild discomfort may occur post-surgery.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        How soon can I see results? Noticeable growth starts around 3–6 months, full results in 12 months.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Will I need another transplant? In some cases, multiple sessions are required for full coverage.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Glossary: FUE: Follicular Unit Extraction. FUT: Follicular Unit Transplantation. PRP: Platelet-Rich Plasma therapy. Shock Loss: Temporary shedding of transplanted hair.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Understanding the procedure timeline and terminology helps set realistic expectations.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Unrealistic expectations can lead to disappointment, even with technically successful procedures.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Accordion 8: Final Tips & Next Steps */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Final Tips & Next Steps
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Guidance for those considering hair transplant or restoration treatments.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Choose a Reputable Clinic: Ensure experienced surgeons and good reviews.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Follow Post-Op Instructions: Avoid exercise, sun exposure, and smoking for better results.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Be Patient: Hair regrowth is a slow process.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Consider Non-Surgical Options: PRP, medications, or laser therapy may be effective alternatives.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Remember: A hair transplant is a long-term investment in your appearance and confidence!
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

export default Hair;
