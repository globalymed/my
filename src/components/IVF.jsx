import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const IVF = () => (
    <Box sx={{ display: 'block', p: 3 }}>
        {/* Title */}
        <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
            IVF (In Vitro Fertilization) Treatments
        </Typography>

        {/* Description */}
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            In vitro fertilization (IVF) is a fertility treatment where eggs and sperm are combined in a lab to create embryos. The healthiest embryo(s) are then transferred to the uterus to establish a pregnancy.
        </Typography>

        {/* Image */}
        <Box
            component="img"
            src="/ivf/1.webp" // <-- Update with your actual image path
            alt="IVF Treatment"
            sx={{
                width: "100%",
                maxWidth: 600,
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
                display: "block",
                mx: "auto", // centers the image horizontally
                mb: 2,
                px: 1,
            }}
        />

        {/* Introduction to IVF */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Introduction to IVF
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    IVF is often considered when other treatments (e.g., fertility drugs, IUI) fail, or for conditions like blocked fallopian tubes, low sperm count, or unexplained infertility.
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
                        p: 2,
                    }}
                >
                    {/* List Section */}
                    <Box component="ul" sx={{ pl: 2, flex: 1, mb: { xs: 2, md: 0 } }}>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Female Factors: Endometriosis, ovulation disorders, damaged/blocked fallopian tubes.
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Male Factors: Low sperm count, poor motility, or abnormal shape.
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Unexplained Infertility: When no cause is found after testing.
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Genetic Disorders: To avoid passing on inherited conditions.
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                            Same-Sex Couples/Single Parents: Using donor sperm/eggs.
                        </Typography>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="/ivf/intro.jpeg"
                        alt="IVF Treatment"
                        sx={{
                            width: "100%",
                            maxWidth: 350,
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

        {/* Step-by-Step IVF Process */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Step-by-Step IVF Process
                </Typography>
            </AccordionSummary>
            <Box
                component="img"
                src="/ivf/2.webp"
                alt="IVF Steps"
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    height: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "block",
                    mx: "auto", // centers the image horizontally
                    mb: 2,
                    px: 1,
                }}
            />
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    The IVF process involves several key stages from initial consultation to pregnancy testing.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Initial Consultation & Testing: Ovarian reserve testing, semen analysis, and uterine examination.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Ovarian Stimulation: Daily hormone injections to stimulate egg production with regular monitoring.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Egg Retrieval: Under light sedation, eggs are removed from follicles (15-20 mins procedure).
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Sperm Collection: Via masturbation or surgical extraction if needed.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Fertilization: Eggs and sperm combined in lab or using ICSI for male infertility.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Embryo Development: Embryos grow for 3-6 days and are graded for quality.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Embryo Transfer: 1-2 embryos placed into uterus using a catheter (painless, no sedation).
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Post-Transfer & Pregnancy Test: Blood test after 10-14 days to confirm pregnancy.
                    </Typography>
                </Box>
            </AccordionDetails>
        </Accordion>

        {/* Conventional IVF */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Conventional IVF
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Conventional IVF is the most common assisted reproductive technology. It involves stimulating the ovaries to produce multiple eggs, retrieving them, fertilizing them in a lab, and transferring the best embryos into the uterus.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Ovarian Stimulation: Daily hormone injections (FSH & LH) for 8–14 days to stimulate multiple egg production. Regular monitoring via blood tests and ultrasounds.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Egg Retrieval (Oocyte Aspiration): Once eggs mature (18-22 mm), a trigger shot (hCG) is given. 34–36 hours later, eggs are retrieved using a transvaginal needle under mild sedation.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Sperm Collection & Fertilization: A sperm sample is collected and processed. Eggs and sperm are combined in a culture dish for fertilization.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Embryo Culture & Selection: Fertilized eggs (zygotes) are monitored for 3-5 days. The best-quality embryos are selected.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Embryo Transfer (ET): 1 or 2 embryos are transferred into the uterus using a thin catheter.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Pregnancy Test (Beta hCG): After 10–14 days, a blood test confirms pregnancy.
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src="/ivf/3.webp"
                    alt="Conventional IVF"
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
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recovery Time
                </Typography>
                <Typography variant="body2" paragraph>
                    1–2 days after embryo transfer.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Higher success rates, allows embryo screening, treats severe infertility cases.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Ovarian Hyperstimulation Syndrome (OHSS): Fluid buildup in abdomen due to excessive hormone response. Multiple Pregnancies: Higher chance of twins or triplets. Ectopic Pregnancy: Implantation outside the uterus.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* ICSI */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    ICSI (Intracytoplasmic Sperm Injection)
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    A specialized form of IVF where a single sperm is injected directly into an egg to increase fertilization success. Used for male infertility (low sperm count, poor motility, DNA fragmentation).
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Procedure
                        </Typography>
                        {/* List Section */}
                        <Box component="ul" sx={{ pl: 4, flex: 1, mb: { xs: 2, md: 0 } }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Same as conventional IVF, except fertilization:
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                A skilled embryologist selects a single sperm under a microscope.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                The sperm is injected into the egg using a microneedle.
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Benefits
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Overcomes severe male infertility, improves fertilization rates.
                        </Typography>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="/ivf/4.webp"
                        alt="ICSI"
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

                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Higher chance of genetic disorders, birth defects, and failed fertilization.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Frozen Embryo Transfer */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Frozen Embryo Transfer (FET)
                </Typography>
            </AccordionSummary>
            <Box
                component="img"
                src="/ivf/5.webp" // <-- Update with your actual image path
                alt="FET"
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    height: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "block",
                    mx: "auto", // centers the image horizontally
                    mb: 2,
                    px: 1,
                }}
            />
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    A previously frozen embryo from an earlier IVF cycle is thawed and transferred to the uterus.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        The patient's uterine lining is prepared using hormones.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        The embryo is thawed and placed into the uterus.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Less stressful than fresh cycles, higher success rates in some cases.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Lower implantation rate compared to fresh embryos, embryo damage during thawing.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* Mini IVF */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Mini IVF (Mild Stimulation IVF)
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
                            A low-dose IVF approach using minimal stimulation to retrieve fewer but high-quality eggs.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Procedure
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Lower doses of hormone injections for controlled egg growth.
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Fewer eggs retrieved and fertilized using ICSI or IVF.
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Benefits
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Fewer side effects, reduced cost.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Risks & Complications
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Lower egg count, may require multiple cycles.
                        </Typography>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="/ivf/6.webp"
                        alt="Mini IVF"
                        sx={{
                            width: "100%",
                            maxWidth: 350,
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

        {/* PGT */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    PGT (Preimplantation Genetic Testing)
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
                            A genetic test to screen embryos for chromosomal abnormalities or inherited diseases before implantation.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Procedure
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                A small biopsy is taken from a blastocyst (5-day-old embryo).
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                DNA is analyzed for genetic defects.
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Benefits
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Prevents genetic diseases, improves IVF success.
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Risks & Complications
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Embryo damage, misdiagnosis.
                        </Typography>
                    </Box>
                    {/* Image Section */}
                    <Box
                        component="img"
                        src="/ivf/7.webp"
                        alt="PGT"
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

        {/* Success Rates & Factors */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    Success Rates & Factors
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    IVF success rates vary based on several factors, with age being the most significant.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Age: Key factor for success. Live birth rates per cycle:
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Under 35: ~40–50%
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        35–37: ~30–40%
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        38–40: ~20–30%
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Over 40: ~5–15%
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Understanding success factors helps set realistic expectations.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Lifestyle factors like smoking, obesity, or alcohol can lower success rates.
                </Typography>
            </AccordionDetails>
        </Accordion>

        {/* FAQs & Tips */}
        <Accordion sx={{ mb: 2, border: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)', borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }}>
                <Typography variant="h6" fontWeight={600}>
                    FAQs & Tips
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body1" paragraph>
                    Common questions and helpful advice for those considering or undergoing IVF treatment.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Procedure
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        How long does IVF take? 4-6 weeks per cycle.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Is IVF painful? Injections may cause discomfort; retrieval is done under sedation.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Can we choose the embryo's gender? Only permitted for medical reasons.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        What if the first cycle fails? Many couples need 2-3 cycles; discuss adjustments with your doctor.
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Tips: Ask questions, stay organized with medications/appointments, prioritize self-care, and find a clinic you trust.
                    </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body2" paragraph>
                    Being well-informed improves the IVF experience and reduces anxiety.
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risks & Complications
                </Typography>
                <Typography variant="body2" paragraph>
                    Emotional stress is common during treatment; seek support when needed.
                </Typography>
            </AccordionDetails>
        </Accordion>
    </Box >
);

export default IVF;
