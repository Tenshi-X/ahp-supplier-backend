-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 03:54 AM
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
(1, 'admin2', '098127127', 'jamur', 21, 7, '2025-06-01');

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id` int(11) NOT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kriteria`
--

INSERT INTO `kriteria` (`id`, `kode`, `nama`) VALUES
(1, 'C1', 'Jarak'),
(2, 'C2', 'Kualitas'),
(3, 'C3', 'Harga'),
(4, 'C4', 'Layanan');

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
(1, 1, 'Jarak', 88);

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
  `approved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `catatan_supply_id`, `file_path`, `catatan_validasi`, `status`, `tanggal_laporan`, `approved_by`) VALUES
(1, 1, '', 'ga ada', 'menunggu', '2025-06-01', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `nama`, `alamat`, `contact`, `nama_supply`, `maksimal_produksi`, `keterangan`) VALUES
(1, 'PT Jokowi Boti', 'Solo', '+6285747255088', 'Sempak', 99, 'Ga Ada');

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

--
-- Dumping data for table `usedcriteria`
--

INSERT INTO `usedcriteria` (`id`, `reportId`, `criteriaName`, `criteriaValue`) VALUES
(1, 1, 'Jarak', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
