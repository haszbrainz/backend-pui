import prisma from '../prismaClient.js';

export const getDashboardStats = async () => {
    const totalReports = await prisma.report.count();
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const pendingReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const approvedReports = await prisma.report.count({ where: { status: 'APPROVED' } });
    const rejectedReports = await prisma.report.count({ where: { status: 'REJECTED' } });

    return {
        totalReports,
        totalUsers,
        reportStats: {
            pending: pendingReports,
            approved: approvedReports,
            rejected: rejectedReports
        }
    };
};

export const getAllReportsForMap = async () => {
    return await prisma.report.findMany({
        include: {
            user: { select: { name: true, email: true } },
            fishReference: { select: { name: true, dangerLevel: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Re-use for list view as it fetches all necessary data
export const getAllReports = async () => {
    return await getAllReportsForMap();
};

export const updateReportStatus = async (reportId, status, adminNote) => {
    return await prisma.report.update({
        where: { id: reportId },
        data: {
            status,
            adminNote
        }
    });
};
