-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 11:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ahp-supply`
--

-- --------------------------------------------------------

--
-- Table structure for table `catatan_supply`
--

CREATE TABLE `catatan_supply` (
  `id` int(11) NOT NULL,
  `nama_pemesan` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `nama_kebutuhan` varchar(255) NOT NULL,
  `jumlah_kebutuhan` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catatan_supply`
--

INSERT INTO `catatan_supply` (`id`, `nama_pemesan`, `no_hp`, `nama_kebutuhan`, `jumlah_kebutuhan`, `staff_id`, `tanggal`) VALUES
(1, 'admin2', '098127127', 'jamur', 21, 7, '2025-06-01'),
(2, 'gustian', '08888', 'mur', 200, 6, '2025-06-01'),
(3, 'gustian', '0888888', 'mur', 300, 6, '2025-06-01'),
(4, 'gustian', '088447777', 'obeng', 300, 6, '2025-06-01'),
(5, 'gustian', '088888888', 'jokowi', 300, 6, '2025-06-01'),
(6, 'gustian', '0888811111', 'Benang', 300, 6, '2025-06-01'),
(7, 'gustian', '0883337774', 'Benang', 400, 6, '2025-06-01');

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id` int(11) NOT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `pertimbangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kriteria`
--

INSERT INTO `kriteria` (`id`, `kode`, `nama`, `pertimbangan`) VALUES
(5, 'C1', 'Kualitas', 'Kualitas bahan baku harus sesuai dengan spesifikasi yang ditetapkan serta didukung oleh surat keberterimaan, sehingga memastikan standar produk yang dihasilkan tetap terjaga.'),
(6, 'C2', 'Pengiriman', 'Proses pengiriman harus tepat waktu, tepat jumlah, dan sesuai dengan administrasi yang telah disepakati agar produksi tidak terganggu dan target operasional dapat tercapai.'),
(7, 'C3', 'Harga', 'Harga yang ditawarkan supplier harus menyesuaikan dengan Harga Perkiraan Sendiri (HPS) perusahaan agar tetap kompetitif dan sesuai dengan anggaran pengadaan.'),
(8, 'C4', 'Kondisi finansial', 'Supplier harus memiliki kondisi finansial yang stabil untuk menjamin kelangsungan kerja sama dan meminimalisir risiko ketidakmampuan dalam memenuhi pesanan. Selain itu, fleksibilitas penagihan juga menjadi pertimbangan dalam melihat situasi dan kondisi ke'),
(9, 'C5', 'Kepatuhan prosedur', 'Supplier harus mengikuti aturan dan prosedur pengadaan yang berlaku di perusahaan guna memastikan kepatuhan terhadap regulasi yang telah ditetapkan.'),
(10, 'C6', 'Layanan perbaikan', 'Supplier harus memiliki layanan perbaikan yang siap dan responsif dalam menangani kendala atau masalah pada bahan baku yang telah dikirim agar tidak menghambat proses produksi.');

-- --------------------------------------------------------

--
-- Table structure for table `nilaikriteriasupplier`
--

CREATE TABLE `nilaikriteriasupplier` (
  `id` int(11) NOT NULL,
  `supplierId` int(11) NOT NULL,
  `namaKriteria` varchar(100) NOT NULL,
  `nilai` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nilaikriteriasupplier`
--

INSERT INTO `nilaikriteriasupplier` (`id`, `supplierId`, `namaKriteria`, `nilai`) VALUES
(8, 1, 'Kualitas', 4),
(9, 1, 'Pengiriman', 3),
(10, 1, 'Harga', 2),
(11, 1, 'Kondisi finansial', 5),
(12, 1, 'Kepatuhan prosedur', 1),
(13, 1, 'Layanan perbaikan', 3),
(14, 2, 'Kualitas', 2),
(15, 2, 'Pengiriman', 5),
(16, 2, 'Harga', 4),
(17, 2, 'Kondisi finansial', 3),
(18, 2, 'Kepatuhan prosedur', 1),
(19, 2, 'Layanan perbaikan', 2),
(20, 3, 'Kualitas', 5),
(21, 3, 'Pengiriman', 4),
(22, 3, 'Harga', 3),
(23, 3, 'Kondisi finansial', 2),
(24, 3, 'Kepatuhan prosedur', 1),
(25, 3, 'Layanan perbaikan', 4),
(26, 4, 'Kualitas', 3),
(27, 4, 'Pengiriman', 1),
(28, 4, 'Harga', 4),
(29, 4, 'Kondisi finansial', 5),
(30, 4, 'Kepatuhan prosedur', 2),
(31, 4, 'Layanan perbaikan', 2),
(32, 5, 'Kualitas', 4),
(33, 5, 'Pengiriman', 2),
(34, 5, 'Harga', 5),
(35, 5, 'Kondisi finansial', 3),
(36, 5, 'Kepatuhan prosedur', 1),
(37, 5, 'Layanan perbaikan', 4),
(38, 6, 'Kualitas', 2),
(39, 6, 'Pengiriman', 3),
(40, 6, 'Harga', 4),
(41, 6, 'Kondisi finansial', 1),
(42, 6, 'Kepatuhan prosedur', 5),
(43, 6, 'Layanan perbaikan', 3);

-- --------------------------------------------------------

--
-- Table structure for table `rankingsuppliers`
--

CREATE TABLE `rankingsuppliers` (
  `id` int(11) NOT NULL,
  `reportId` int(11) NOT NULL,
  `supplierName` varchar(100) NOT NULL,
  `nama_supply` varchar(255) NOT NULL,
  `ranking` int(11) NOT NULL,
  `alokasi_kebutuhan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rankingsuppliers`
--

INSERT INTO `rankingsuppliers` (`id`, `reportId`, `supplierName`, `nama_supply`, `ranking`, `alokasi_kebutuhan`) VALUES
(2, 9, 'CV Makmur Jaya', 'Benang', 1, 200),
(3, 10, 'CV Makmur Jaya', 'Benang', 1, 200),
(4, 10, 'PT Jokowi Boti', 'Benang', 2, 200),
(5, 10, 'PT Sinar Terang Abadi', 'Benang', 3, 0),
(6, 10, 'PT Laju Prima', 'Benang', 4, 0),
(7, 10, 'UD Tekstil Mandiri', 'Benang', 5, 0),
(8, 10, 'CV Bintang Timur', 'Benang', 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `catatan_supply_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `catatan_validasi` text DEFAULT NULL,
  `status` enum('disetujui','ditolak','menunggu') DEFAULT 'menunggu',
  `tanggal_laporan` date NOT NULL,
  `approved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `catatan_supply_id`, `file_path`, `catatan_validasi`, `status`, `tanggal_laporan`, `approved_by`) VALUES
(1, 1, '', 'ga ada', 'menunggu', '2025-06-01', NULL),
(2, 2, '', 'mantap', 'menunggu', '2025-06-01', NULL),
(3, 2, '', 'mantap', 'menunggu', '2025-06-01', NULL),
(4, 2, '', 'mantap', 'menunggu', '2025-06-01', NULL),
(5, 3, '', 'luar biasa', 'menunggu', '2025-06-01', NULL),
(6, 4, '', 'harus besok', 'menunggu', '2025-06-01', NULL),
(7, 5, '', 'harus besok', 'menunggu', '2025-06-01', NULL),
(8, 5, '', 'harus besok', 'menunggu', '2025-06-01', NULL),
(9, 6, '', 'cccc', 'menunggu', '2025-06-01', NULL),
(10, 7, '', 'mantap sekali', 'menunggu', '2025-06-01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `nama_supply` varchar(255) NOT NULL,
  `maksimal_produksi` int(11) NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `nama`, `alamat`, `contact`, `nama_supply`, `maksimal_produksi`, `keterangan`) VALUES
(1, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Sempak', 99, 'Ga Ada'),
(2, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Kain Katun', 150, 'Tepat waktu dan responsif'),
(3, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Benang', 200, 'Kualitas tinggi, harga bersaing'),
(4, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Resleting', 120, 'Pernah delay sekali'),
(5, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Kancing', 180, 'Fast response support'),
(6, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Kain Drill', 100, 'Belum ada kerja sama sebelumnya'),
(50, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Sempak', 118, 'Ga Ada'),
(51, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Kain Katun', 178, 'Ga Ada'),
(52, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Benang', 99, 'Ga Ada'),
(53, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Resleting', 121, 'Ga Ada'),
(54, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Kancing', 109, 'Ga Ada'),
(55, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Kain Drill', 102, 'Ga Ada'),
(56, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Sempak', 102, 'Tepat waktu dan responsif'),
(57, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Kain Katun', 124, 'Tepat waktu dan responsif'),
(58, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Benang', 116, 'Tepat waktu dan responsif'),
(59, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Resleting', 130, 'Tepat waktu dan responsif'),
(60, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Kancing', 102, 'Tepat waktu dan responsif'),
(61, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Kain Drill', 161, 'Tepat waktu dan responsif'),
(62, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Sempak', 179, 'Kualitas tinggi, harga bersaing'),
(63, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Kain Katun', 94, 'Kualitas tinggi, harga bersaing'),
(64, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Benang', 93, 'Kualitas tinggi, harga bersaing'),
(65, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Resleting', 102, 'Kualitas tinggi, harga bersaing'),
(66, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Kancing', 150, 'Kualitas tinggi, harga bersaing'),
(67, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Kain Drill', 128, 'Kualitas tinggi, harga bersaing'),
(68, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Sempak', 107, 'Pernah delay sekali'),
(69, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Kain Katun', 193, 'Pernah delay sekali'),
(70, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Benang', 85, 'Pernah delay sekali'),
(71, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Resleting', 127, 'Pernah delay sekali'),
(72, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Kancing', 180, 'Pernah delay sekali'),
(73, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Kain Drill', 198, 'Pernah delay sekali'),
(74, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Sempak', 133, 'Fast response support'),
(75, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Kain Katun', 111, 'Fast response support'),
(76, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Benang', 198, 'Fast response support'),
(77, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Resleting', 95, 'Fast response support'),
(78, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Kancing', 163, 'Fast response support'),
(79, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Kain Drill', 91, 'Fast response support'),
(80, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Sempak', 127, 'Belum ada kerja sama sebelumnya'),
(81, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Kain Katun', 163, 'Belum ada kerja sama sebelumnya'),
(82, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Benang', 113, 'Belum ada kerja sama sebelumnya'),
(83, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Resleting', 116, 'Belum ada kerja sama sebelumnya'),
(84, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Kancing', 163, 'Belum ada kerja sama sebelumnya'),
(85, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Kain Drill', 149, 'Belum ada kerja sama sebelumnya');

-- --------------------------------------------------------

--
-- Table structure for table `usedcriteria`
--

CREATE TABLE `usedcriteria` (
  `id` int(11) NOT NULL,
  `reportId` int(11) NOT NULL,
  `criteriaName` varchar(100) NOT NULL,
  `criteriaValue` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usedcriteria`
--

INSERT INTO `usedcriteria` (`id`, `reportId`, `criteriaName`, `criteriaValue`) VALUES
(1, 1, 'Jarak', 0),
(2, 2, 'Kualitas', 1),
(3, 2, 'Pengiriman', 2),
(4, 2, 'Harga', 3),
(5, 2, 'Kondisi finansial', 4),
(6, 2, 'Kepatuhan prosedur', 5),
(7, 2, 'Layanan perbaikan', 6),
(8, 3, 'Kualitas', 1),
(9, 3, 'Pengiriman', 2),
(10, 3, 'Harga', 3),
(11, 3, 'Kondisi finansial', 4),
(12, 3, 'Kepatuhan prosedur', 5),
(13, 3, 'Layanan perbaikan', 6),
(14, 4, 'Kualitas', 1),
(15, 4, 'Pengiriman', 2),
(16, 4, 'Harga', 3),
(17, 4, 'Kondisi finansial', 4),
(18, 4, 'Kepatuhan prosedur', 5),
(19, 4, 'Layanan perbaikan', 6),
(20, 5, 'Kualitas', 1),
(21, 5, 'Pengiriman', 2),
(22, 5, 'Harga', 3),
(23, 5, 'Kondisi finansial', 5),
(24, 5, 'Kepatuhan prosedur', 4),
(25, 5, 'Layanan perbaikan', 6),
(26, 6, 'Kualitas', 2),
(27, 6, 'Pengiriman', 1),
(28, 6, 'Harga', 3),
(29, 6, 'Kondisi finansial', 4),
(30, 6, 'Kepatuhan prosedur', 5),
(31, 6, 'Layanan perbaikan', 6),
(32, 7, 'Kualitas', 2),
(33, 7, 'Pengiriman', 1),
(34, 7, 'Harga', 3),
(35, 7, 'Kondisi finansial', 4),
(36, 7, 'Kepatuhan prosedur', 5),
(37, 7, 'Layanan perbaikan', 6),
(38, 8, 'Kualitas', 2),
(39, 8, 'Pengiriman', 1),
(40, 8, 'Harga', 3),
(41, 8, 'Kondisi finansial', 4),
(42, 8, 'Kepatuhan prosedur', 5),
(43, 8, 'Layanan perbaikan', 6),
(44, 9, 'Kualitas', 1),
(45, 9, 'Pengiriman', 2),
(46, 9, 'Harga', 3),
(47, 9, 'Kondisi finansial', 4),
(48, 9, 'Kepatuhan prosedur', 5),
(49, 9, 'Layanan perbaikan', 6),
(50, 10, 'Kualitas', 2),
(51, 10, 'Harga', 3),
(52, 10, 'Pengiriman', 1),
(53, 10, 'Kondisi finansial', 4),
(54, 10, 'Kepatuhan prosedur', 5),
(55, 10, 'Layanan perbaikan', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`) VALUES
(6, 'gustian', '$2b$10$yrIMsRdd7N94F.Ac2PEqnefF2YRH4pcrOyx8Vqgcckraqi.8wMf2e', 'gustian1234@gmail.com', 'staff'),
(7, 'admin2', '$2b$10$mg.qcK2AYEcPkG6LSby9MuGuf8qwoWPbaTn4kxz0ff.iiSyKy64WC', 'admin2@gmail.com', 'staff'),
(9, 'manager', '$2b$10$755QRVyin5FT9UE7M2eFI.Z100WOemmag8g0HQI0bD82iRJqzrzmu', 'managerasik@gmail.com', 'junior_manager');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catatan_supply`
--
ALTER TABLE `catatan_supply`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierId` (`supplierId`);

--
-- Indexes for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reportId` (`reportId`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `catatan_supply_id` (`catatan_supply_id`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reportId` (`reportId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catatan_supply`
--
ALTER TABLE `catatan_supply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  ADD CONSTRAINT `nilaikriteriasupplier_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `supplier` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  ADD CONSTRAINT `rankingsuppliers_ibfk_1` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`catatan_supply_id`) REFERENCES `catatan_supply` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  ADD CONSTRAINT `usedcriteria_ibfk_1` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
