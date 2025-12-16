// src/services/laporanService.js
import prisma from '../prismaClient.js'; // Sesuaikan path jika berbeda

// Pilihan data pelapor yang ingin disertakan saat mengambil laporan
const includePelaporData = {
  pelapor: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export const createLaporanService = async (laporanData) => {
  const {
    alamat,
    koordinatLatitude,
    koordinatLongitude,
    description,
    imageUrl,
    pelaporId, // ID user yang membuat laporan
    status,    // Opsional, default akan digunakan jika tidak ada
  } = laporanData;

  if (!alamat || koordinatLatitude == null || koordinatLongitude == null || !imageUrl || pelaporId == null) {
    const error = new Error('Data tidak lengkap: alamat, koordinat, imageUrl, dan pelaporId wajib diisi.');
    error.statusCode = 400;
    throw error;
  }

  // Validasi tipe data tambahan jika perlu (misalnya, koordinat adalah angka)
  const lat = parseFloat(koordinatLatitude);
  const lon = parseFloat(koordinatLongitude);
  // const pId = parseInt(pelaporId, 10); // MongoDB uses string IDs

  if (isNaN(lat) || isNaN(lon) || !pelaporId) {
    const error = new Error('Format koordinat atau pelaporId tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  try {
    // Cek apakah user pelapor ada
    const userExists = await prisma.user.findUnique({ where: { id: pelaporId } });
    if (!userExists) {
      const error = new Error(`User dengan ID ${pelaporId} tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    const newLaporan = await prisma.laporan.create({
      data: {
        alamat,
        koordinatLatitude: lat,
        koordinatLongitude: lon,
        description,
        imageUrl,
        status: status || 'BELUM_DIPROSES', // Gunakan status dari input atau default dari skema
        pelapor: {
          connect: { id: pelaporId },
        },
      },
      include: includePelaporData,
    });
    return newLaporan;
  } catch (dbError) {
    console.error("Prisma Error in createLaporanService:", dbError);
    // Error P2025 (Record to connect to not found) sudah ditangani oleh pengecekan userExists
    const error = new Error('Gagal membuat laporan di database.');
    error.statusCode = 500;
    throw error;
  }
};

export const getAllLaporanService = async (filters = {}) => {
  // filters bisa digunakan untuk pagination, filter berdasarkan status, user, dll. di masa depan
  try {
    const laporanList = await prisma.laporan.findMany({
      where: filters.where, // Contoh: filters.where = { status: 'BARU' }
      orderBy: {
        createdAt: 'desc',
      },
      include: includePelaporData,
    });
    return laporanList;
  } catch (dbError) {
    console.error("Prisma Error in getAllLaporanService:", dbError);
    const error = new Error('Gagal mengambil data laporan dari database.');
    error.statusCode = 500;
    throw error;
  }
};

export const getLaporanByIdService = async (laporanId) => {
  // const id = parseInt(laporanId, 10);
  if (!laporanId) {
    const error = new Error('ID Laporan tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const laporan = await prisma.laporan.findUnique({
      where: { id: laporanId },
      include: includePelaporData,
    });

    if (!laporan) {
      const error = new Error('Laporan tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }
    return laporan;
  } catch (dbError) {
    console.error("Prisma Error in getLaporanByIdService:", dbError);
    const error = new Error('Gagal mengambil data laporan dari database.');
    error.statusCode = 500;
    throw error;
  }
};

export const updateLaporanService = async (laporanId, updateData) => {
  // Dalam aplikasi nyata, tambahkan logika otorisasi di sini:
  // Siapa yang boleh update? Admin? User yang membuat laporan?
  // const id = parseInt(laporanId, 10);
  if (!laporanId) {
    const error = new Error('ID Laporan tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  const dataToUpdate = { ...updateData };
  // Hapus field yang tidak seharusnya diupdate langsung atau dikelola Prisma
  delete dataToUpdate.id;
  delete dataToUpdate.createdAt;
  delete dataToUpdate.updatedAt;
  delete dataToUpdate.pelaporId; // Relasi diubah melalui pelapor: { connect: ... } jika perlu
  delete dataToUpdate.pelapor;

  // Konversi tipe data jika perlu
  if (dataToUpdate.koordinatLatitude !== undefined) {
    dataToUpdate.koordinatLatitude = parseFloat(dataToUpdate.koordinatLatitude);
    if (isNaN(dataToUpdate.koordinatLatitude)) delete dataToUpdate.koordinatLatitude; // Hapus jika tidak valid
  }
  if (dataToUpdate.koordinatLongitude !== undefined) {
    dataToUpdate.koordinatLongitude = parseFloat(dataToUpdate.koordinatLongitude);
    if (isNaN(dataToUpdate.koordinatLongitude)) delete dataToUpdate.koordinatLongitude; // Hapus jika tidak valid
  }


  if (Object.keys(dataToUpdate).length === 0) {
    const error = new Error('Tidak ada data untuk diperbarui.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const updatedLaporan = await prisma.laporan.update({
      where: { id: laporanId },
      data: dataToUpdate,
      include: includePelaporData,
    });
    return updatedLaporan;
  } catch (dbError) {
    if (dbError.code === 'P2025') { // Record to update not found
      const error = new Error('Laporan tidak ditemukan untuk diperbarui.');
      error.statusCode = 404;
      throw error;
    }
    console.error("Prisma Error in updateLaporanService:", dbError);
    const error = new Error('Gagal memperbarui laporan di database.');
    error.statusCode = 500;
    throw error;
  }
};

export const deleteLaporanService = async (laporanId) => {
  // Dalam aplikasi nyata, tambahkan logika otorisasi di sini
  // const id = parseInt(laporanId, 10);
  if (!laporanId) {
    const error = new Error('ID Laporan tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  try {
    await prisma.laporan.delete({
      where: { id: laporanId },
    });
    // Tidak ada data yang dikembalikan
  } catch (dbError) {
    if (dbError.code === 'P2025') { // Record to delete not found
      const error = new Error('Laporan tidak ditemukan untuk dihapus.');
      error.statusCode = 404;
      throw error;
    }
    console.error("Prisma Error in deleteLaporanService:", dbError);
    const error = new Error('Gagal menghapus laporan dari database.');
    error.statusCode = 500;
    throw error;
  }
};