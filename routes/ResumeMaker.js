const PDFDocument = require('pdfkit');
const fs = require('fs');
const express = require("express");
const run = require('../AI/Gemini');
const router = express.Router();
const isLoggedin = require('../middlewares/IsLoggedIn');
const debug = require("debug")("development:mongoose")


router.get("/", isLoggedin, function (req, res) {
    res.send("Valid User")
})

router.post("/", isLoggedin, async function (req, res) {


    const dummydata = req.body;


    const AIGen = async (data) => {
        const errors = [];

        try {
            // Professional Summary
            if (data.professionalSummary) {
                const summary1 = await run(data.professionalSummary + " make this ATS friendly, in at least 50 words, and professional. Don't use ## or * or **");
                if (summary1.AIError) {
                    errors.push("Invalid data in Professional Summary.");
                } else {
                    data.professionalSummary = summary1.responseText;
                }
            }

            // Work Experience
            if (Array.isArray(data.workExperience)) {
                for (let i = 0; i < data.workExperience.length; i++) {
                    const summary3 = await run(data.workExperience[i].description + " make this ATS friendly, in at least 50 words, and professional. Don't use ## or * or **");
                    if (summary3.AIError) {
                        errors.push(`Invalid data in Work Experience ${i + 1}.`);
                    } else {
                        data.workExperience[i].description = summary3.responseText;
                    }
                }
            }

            // Projects
            if (Array.isArray(data.projects)) {
                for (let j = 0; j < data.projects.length; j++) {
                    if (data.projects[j].description) {
                        const summary4 = await run(data.projects[j].description + " make this ATS friendly, in at least 50 words, and professional. Don't use ## or * or **");
                        if (summary4.AIError) {
                            errors.push(`Invalid data in Project ${j + 1}.`);
                        } else {
                            data.projects[j].description = summary4.responseText;
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error in AI processing:", error);
            errors.push("Error processing AI data.");
        }

        return errors;
    };

    if (dummydata) {
        const errors = await AIGen(dummydata);
        if (errors.length > 0) {
            console.log("Error aa gaya");
            
            return res.status(400).json({ errors });
        }
    }

    const doc = new PDFDocument({ margin: 40 });

    const filePath = 'resume.pdf';
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.registerFont('Curvy', './fonts/PPNeueMontreal-italic.ttf')
    doc.font('Curvy')
    // Add Name and Contact Info (Header)
    doc.fontSize(28).text(dummydata.fullName, { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.fontSize(16)
        .text('GitHub', { continued: true, link: dummydata.githubUrl, underline: true })
        .text('        ', { continued: true, underline: false })
        .text('LinkedIn', { continued: true, link: dummydata.linkedinUrl, underline: true })
        .text('        ', { continued: true, underline: false })
        .text('Personal Site', { continued: true, link: dummydata.portfolioUrl, underline: true })
        .text('        ', { continued: true, underline: false })
        .text('Email', { continued: true, link: dummydata.email, underline: true })
        .text('        ', { continued: true, underline: false })
        .text("+91" + dummydata.mobileNumber, { align: 'center', bold: true });

    doc.moveDown(1.5);

    // Professional Summary
    doc.fontSize(20).fillColor('black').text('Professional Summary', { bold: true, underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(dummydata.professionalSummary);
    doc.moveDown(1);

    // Work Experience
    doc.fontSize(20).text('Work Experience', { bold: true, underline: true });
    doc.moveDown(0.2);
    for (let j = 0; j < dummydata.workExperience.length; j++) {
        doc.fontSize(16)
            .text(dummydata.workExperience[j].role, { continued: true, bold: true, underline: true }).fontSize(12)
            .text(`${dummydata.workExperience[j].from} - ${dummydata.workExperience[j].to}`, { link: dummydata.projects[j].demoLink, underline: false, align: 'right', bold: true })
            .fillColor('black');
        doc.fontSize(12).moveDown(0.4);
        doc.text(dummydata.workExperience[j].description);
        doc.moveDown(0.5);
    }


    doc.fontSize(20).text('Projects', { bold: true, underline: true });
    doc.moveDown(0.2);

    for (let j = 0; j < dummydata.projects.length; j++) {
        doc.fontSize(16)
            .text(dummydata.projects[j].title, { continued: true, bold: true, underline: true })
            .fillColor('blue')
            .text('Link to Demo', { link: dummydata.projects[j].demoLink, underline: true, align: 'center' })
            .fillColor('black');
        doc.fontSize(12).text(dummydata.projects[j].description);
        doc.moveDown(0.5);
    }

    // Add Education Section
    doc.fontSize(16).text('Education', { bold: true, underline: true });
    doc.moveDown(0.3);

    for (let j = 0; j < dummydata.education.length; j++) {
        doc.fontSize(12).text(dummydata.education[j].school + "      -      " + dummydata.education[j].percentage +"%");
        doc.moveDown(0.1);
    }
    doc.moveDown(0.5)

    // Add Skills Section
    doc.fontSize(16).text('Skills', { bold: true, underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(dummydata.skills);


    // Finalize PDF
    doc.end();

    writeStream.on('finish', function () {
        res.download(filePath, 'resume.pdf', function (err) {
            if (err) {
                console.error("Error sending file for download:", err);
                res.status(500).send("Error downloading the file");
            }
        });
    });

    writeStream.on('error', function (err) {
        console.error("Error generating PDF:", err);
        res.status(500).send("Error generating PDF");
    });
});

module.exports = router;
