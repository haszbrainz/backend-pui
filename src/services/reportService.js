import prisma from '../prismaClient.js';

export const createReport = async (data) => {
    return await prisma.report.create({
        data: {
            userId: data.userId,
            fishReferenceId: data.fishReferenceId || null,
            description: data.description,
            photoUrl: data.photoUrl,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            addressText: data.addressText,
            status: 'PENDING'
        }
    });
};

export const getReportsByUserId = async (userId) => {
    return await prisma.report.findMany({
        where: { userId },
        include: { fishReference: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const getApprovedReports = async () => {
    return await prisma.report.findMany({
        where: { status: 'APPROVED' },
        include: {
            fishReference: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};
