import * as ReportService from '../services/reportService.js';

export const createReport = async (req, res) => {
    try {
        const { description, fishReferenceId, latitude, longitude, addressText } = req.body;

        // Handle file upload
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
        if (!photoUrl) {
            return res.status(400).json({ success: false, error: "Photo is required" });
        }

        // Validate coordinates
        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, error: "Coordinates are required" });
        }

        const report = await ReportService.createReport({
            userId: req.user.userId, // From authMiddleware
            fishReferenceId,
            description,
            photoUrl,
            latitude,
            longitude,
            addressText
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        console.error("Create Report Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyReports = async (req, res) => {
    try {
        const reports = await ReportService.getReportsByUserId(req.user.userId);
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
