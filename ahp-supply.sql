-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 07:59 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

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
-- Table structure for table `ahp_results`
--

CREATE TABLE `ahp_results` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `final_score` decimal(10,6) DEFAULT NULL,
  `ranking_position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ahp_results`
--

INSERT INTO `ahp_results` (`id`, `session_id`, `supplier_id`, `final_score`, `ranking_position`) VALUES
(91, 17, 50, '0.166667', 1),
(92, 17, 56, '0.166667', 2),
(93, 17, 62, '0.166667', 3),
(94, 17, 68, '0.166667', 4),
(95, 17, 74, '0.166667', 5),
(96, 17, 80, '0.166667', 6);

-- --------------------------------------------------------

--
-- Table structure for table `ahp_sessions`
--

CREATE TABLE `ahp_sessions` (
  `id` bigint(20) NOT NULL,
  `nama_supply` varchar(255) NOT NULL,
  `status` enum('draft','completed') DEFAULT 'draft',
  `consistency_ratio` decimal(10,6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ahp_sessions`
--

INSERT INTO `ahp_sessions` (`id`, `nama_supply`, `status`, `consistency_ratio`, `created_at`, `updated_at`) VALUES
(17, 'Besi Baja', 'completed', NULL, '2025-06-03 17:55:51', '2025-06-03 17:55:51');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `catatan_supply`
--

INSERT INTO `catatan_supply` (`id`, `nama_pemesan`, `no_hp`, `nama_kebutuhan`, `jumlah_kebutuhan`, `staff_id`, `tanggal`) VALUES
(42, 'a', 'a', 'Besi Baja', 1, 7, '2025-06-04');

-- --------------------------------------------------------

--
-- Table structure for table `criteria_comparisons`
--

CREATE TABLE `criteria_comparisons` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `criteria_a_id` int(11) DEFAULT NULL,
  `criteria_b_id` int(11) DEFAULT NULL,
  `comparison_value` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `criteria_weights`
--

CREATE TABLE `criteria_weights` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `criteria_id` int(11) DEFAULT NULL,
  `weight_value` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `detail_supplier`
--

CREATE TABLE `detail_supplier` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `nama_supply` varchar(255) DEFAULT NULL,
  `maksimal_produksi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `detail_supplier`
--

INSERT INTO `detail_supplier` (`id`, `supplier_id`, `nama_supply`, `maksimal_produksi`) VALUES
(1, 50, 'Sempak', 118),
(7, 56, 'Sempak', 102),
(13, 62, 'Sempak', 179),
(19, 68, 'Sempak', 107),
(25, 74, 'Sempak', 133),
(31, 80, 'Sempak', 127),
(64, 50, 'Besi Baja', 118),
(65, 50, 'Aluminium Sheet', 130),
(66, 50, 'Kabel Listrik', 95),
(67, 50, 'Baut & Mur', 110),
(68, 50, 'Oli Industri', 105),
(69, 50, 'Pipa PVC', 126),
(70, 56, 'Besi Baja', 102),
(71, 56, 'Aluminium Sheet', 111),
(72, 56, 'Kabel Listrik', 98),
(73, 56, 'Baut & Mur', 120),
(74, 56, 'Oli Industri', 101),
(75, 56, 'Pipa PVC', 115),
(76, 62, 'Besi Baja', 179),
(77, 62, 'Aluminium Sheet', 140),
(78, 62, 'Kabel Listrik', 138),
(79, 62, 'Baut & Mur', 160),
(80, 62, 'Oli Industri', 150),
(81, 62, 'Pipa PVC', 155),
(82, 68, 'Besi Baja', 107),
(83, 68, 'Aluminium Sheet', 109),
(84, 68, 'Kabel Listrik', 100),
(85, 68, 'Baut & Mur', 105),
(86, 68, 'Oli Industri', 108),
(87, 68, 'Pipa PVC', 112),
(88, 74, 'Besi Baja', 133),
(89, 74, 'Aluminium Sheet', 135),
(90, 74, 'Kabel Listrik', 120),
(91, 74, 'Baut & Mur', 125),
(92, 74, 'Oli Industri', 130),
(93, 74, 'Pipa PVC', 128),
(94, 80, 'Besi Baja', 127),
(95, 80, 'Aluminium Sheet', 129),
(96, 80, 'Kabel Listrik', 122),
(97, 80, 'Baut & Mur', 135),
(98, 80, 'Oli Industri', 126),
(99, 80, 'Pipa PVC', 120);

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id` int(11) NOT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `pertimbangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `nilaikriteriasupplier`
--

INSERT INTO `nilaikriteriasupplier` (`id`, `supplierId`, `namaKriteria`, `nilai`) VALUES
(44, 50, 'Kualitas', 12),
(45, 50, 'Pengiriman', 12),
(46, 50, 'Harga', 12),
(47, 50, 'Kondisi finansial', 12),
(48, 50, 'Kepatuhan prosedur', 12),
(49, 50, 'Layanan perbaikan', 12);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `approved_by` int(11) DEFAULT NULL,
  `ahp_session_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `nama`, `alamat`, `contact`, `keterangan`) VALUES
(50, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Ga Ada'),
(56, 'PT Sinar Terang Abadi', 'Jakarta', '+6281234567890', 'Tepat waktu dan responsif'),
(62, 'CV Makmur Jaya', 'Bandung', '+6282234567891', 'Kualitas tinggi, harga bersaing'),
(68, 'PT Laju Prima', 'Surabaya', '+6283234567892', 'Pernah delay sekali'),
(74, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Fast response support'),
(80, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Belum ada kerja sama sebelumnya');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_comparisons`
--

CREATE TABLE `supplier_comparisons` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `criteria_id` int(11) DEFAULT NULL,
  `supplier_a_id` int(11) DEFAULT NULL,
  `supplier_b_id` int(11) DEFAULT NULL,
  `comparison_value` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `usedcriteria`
--

CREATE TABLE `usedcriteria` (
  `id` int(11) NOT NULL,
  `reportId` int(11) NOT NULL,
  `criteriaName` varchar(100) NOT NULL,
  `criteriaValue` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
-- Indexes for table `ahp_results`
--
ALTER TABLE `ahp_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `fk_session` (`session_id`);

--
-- Indexes for table `ahp_sessions`
--
ALTER TABLE `ahp_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `catatan_supply`
--
ALTER TABLE `catatan_supply`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `criteria_comparisons`
--
ALTER TABLE `criteria_comparisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `criteria_a_id` (`criteria_a_id`),
  ADD KEY `criteria_ab_id` (`criteria_b_id`);

--
-- Indexes for table `criteria_weights`
--
ALTER TABLE `criteria_weights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sessions` (`session_id`),
  ADD KEY `fk_kriteria` (`criteria_id`);

--
-- Indexes for table `detail_supplier`
--
ALTER TABLE `detail_supplier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

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
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_report_ahp_session` (`ahp_session_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_comparisons`
--
ALTER TABLE `supplier_comparisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_a_id` (`supplier_a_id`),
  ADD KEY `supplier_b_id` (`supplier_b_id`),
  ADD KEY `criteria_id` (`criteria_id`),
  ADD KEY `sessions_id` (`session_id`);

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
-- AUTO_INCREMENT for table `ahp_results`
--
ALTER TABLE `ahp_results`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `ahp_sessions`
--
ALTER TABLE `ahp_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `catatan_supply`
--
ALTER TABLE `catatan_supply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `criteria_comparisons`
--
ALTER TABLE `criteria_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `criteria_weights`
--
ALTER TABLE `criteria_weights`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detail_supplier`
--
ALTER TABLE `detail_supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `supplier_comparisons`
--
ALTER TABLE `supplier_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ahp_results`
--
ALTER TABLE `ahp_results`
  ADD CONSTRAINT `fk_session` FOREIGN KEY (`session_id`) REFERENCES `ahp_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_id` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `criteria_comparisons`
--
ALTER TABLE `criteria_comparisons`
  ADD CONSTRAINT `criteria_a_id` FOREIGN KEY (`criteria_a_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ab_id` FOREIGN KEY (`criteria_b_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `session_id` FOREIGN KEY (`session_id`) REFERENCES `ahp_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `criteria_weights`
--
ALTER TABLE `criteria_weights`
  ADD CONSTRAINT `fk_kriteria` FOREIGN KEY (`criteria_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sessions` FOREIGN KEY (`session_id`) REFERENCES `ahp_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `detail_supplier`
--
ALTER TABLE `detail_supplier`
  ADD CONSTRAINT `detail_supplier_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `report_ibfk_3` FOREIGN KEY (`ahp_session_id`) REFERENCES `ahp_sessions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `supplier_comparisons`
--
ALTER TABLE `supplier_comparisons`
  ADD CONSTRAINT `criteria_id` FOREIGN KEY (`criteria_id`) REFERENCES `kriteria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sessions_id` FOREIGN KEY (`session_id`) REFERENCES `ahp_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_a_id` FOREIGN KEY (`supplier_a_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_b_id` FOREIGN KEY (`supplier_b_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  ADD CONSTRAINT `usedcriteria_ibfk_1` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
