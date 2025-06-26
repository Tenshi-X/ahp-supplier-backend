-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2025 at 04:24 PM
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
-- Table structure for table `ahp_results`
--

CREATE TABLE `ahp_results` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `final_score` decimal(10,6) DEFAULT NULL,
  `ranking_position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ahp_results`
--

INSERT INTO `ahp_results` (`id`, `session_id`, `supplier_id`, `final_score`, `ranking_position`) VALUES
(95, 17, 74, 0.166667, 5),
(96, 17, 80, 0.166667, 6),
(101, 19, 74, 0.166667, 5),
(102, 19, 80, 0.166667, 6),
(107, 20, 74, 0.166667, 5),
(108, 20, 80, 0.166667, 6),
(113, 21, 74, 0.166667, 5),
(114, 21, 80, 0.166667, 6),
(119, 22, 74, 0.166667, 5),
(120, 22, 80, 0.166667, 6),
(125, 23, 74, 0.166667, 5),
(126, 23, 80, 0.166667, 6),
(131, 24, 74, 0.166667, 5),
(132, 24, 80, 0.166667, 6),
(134, 25, 74, 0.333333, 2),
(135, 25, 80, 0.333333, 3);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ahp_sessions`
--

INSERT INTO `ahp_sessions` (`id`, `nama_supply`, `status`, `consistency_ratio`, `created_at`, `updated_at`) VALUES
(17, 'Besi Baja', 'completed', NULL, '2025-06-03 17:55:51', '2025-06-03 17:55:51'),
(19, 'Aluminium Sheet', 'completed', 0.008800, '2025-06-24 13:59:13', '2025-06-24 13:59:13'),
(20, 'Besi Baja', 'completed', 0.022807, '2025-06-24 14:02:38', '2025-06-24 14:02:38'),
(21, 'Aluminium Sheet', 'completed', 0.022665, '2025-06-24 14:26:42', '2025-06-24 14:26:42'),
(22, 'Kabel Listrik', 'completed', 0.008800, '2025-06-24 14:30:12', '2025-06-24 14:30:12'),
(23, 'Baut & Mur', 'completed', 0.008800, '2025-06-24 14:34:06', '2025-06-24 14:34:06'),
(24, 'Aluminium Sheet', 'completed', 0.008800, '2025-06-24 14:37:55', '2025-06-24 14:37:55'),
(25, 'Aluminium Sheet', 'completed', 0.039944, '2025-06-25 16:57:34', '2025-06-25 16:57:34');

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
(42, 'a', 'a', 'Besi Baja', 1, 7, '2025-06-04'),
(44, 'gus', '086543234567', 'Aluminium Sheet', 444, 10, '2025-06-24'),
(45, 'gusss', '0987654321', 'Besi Baja', 432, 10, '2025-06-24'),
(46, 'ttt', '0865432234567', 'Aluminium Sheet', 433, 10, '2025-06-24'),
(47, 'wer', '087654323456', 'Kabel Listrik', 442, 10, '2025-06-24'),
(48, 'ggg', '0856765434', 'Baut & Mur', 6543, 10, '2025-06-24'),
(49, 'ewrt', '086543234567', 'Aluminium Sheet', 3245, 10, '2025-06-24'),
(50, 'gdd', '08543456543', 'Aluminium Sheet', 544, 11, '2025-06-25');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criteria_comparisons`
--

INSERT INTO `criteria_comparisons` (`id`, `session_id`, `criteria_a_id`, `criteria_b_id`, `comparison_value`) VALUES
(31, 19, 5, 6, 1.000000),
(32, 19, 5, 7, 1.000000),
(33, 19, 5, 8, 1.000000),
(34, 19, 5, 9, 1.000000),
(35, 19, 5, 10, 1.000000),
(36, 19, 6, 5, 1.000000),
(37, 19, 6, 7, 1.000000),
(38, 19, 6, 8, 0.500000),
(39, 19, 6, 9, 1.000000),
(40, 19, 6, 10, 1.000000),
(41, 19, 7, 5, 1.000000),
(42, 19, 7, 6, 1.000000),
(43, 19, 7, 8, 1.000000),
(44, 19, 7, 9, 1.000000),
(45, 19, 7, 10, 1.000000),
(46, 19, 8, 5, 1.000000),
(47, 19, 8, 6, 2.000000),
(48, 19, 8, 7, 1.000000),
(49, 19, 8, 9, 1.000000),
(50, 19, 8, 10, 1.000000),
(51, 19, 9, 5, 1.000000),
(52, 19, 9, 6, 1.000000),
(53, 19, 9, 7, 1.000000),
(54, 19, 9, 8, 1.000000),
(55, 19, 9, 10, 1.000000),
(56, 19, 10, 5, 1.000000),
(57, 19, 10, 6, 1.000000),
(58, 19, 10, 7, 1.000000),
(59, 19, 10, 8, 1.000000),
(60, 19, 10, 9, 1.000000),
(61, 20, 5, 6, 1.000000),
(62, 20, 5, 7, 1.000000),
(63, 20, 5, 8, 1.000000),
(64, 20, 5, 9, 1.000000),
(65, 20, 5, 10, 1.000000),
(66, 20, 6, 5, 1.000000),
(67, 20, 6, 7, 1.000000),
(68, 20, 6, 8, 1.000000),
(69, 20, 6, 9, 0.333333),
(70, 20, 6, 10, 1.000000),
(71, 20, 7, 5, 1.000000),
(72, 20, 7, 6, 1.000000),
(73, 20, 7, 8, 1.000000),
(74, 20, 7, 9, 1.000000),
(75, 20, 7, 10, 1.000000),
(76, 20, 8, 5, 1.000000),
(77, 20, 8, 6, 1.000000),
(78, 20, 8, 7, 1.000000),
(79, 20, 8, 9, 1.000000),
(80, 20, 8, 10, 1.000000),
(81, 20, 9, 5, 1.000000),
(82, 20, 9, 6, 3.000000),
(83, 20, 9, 7, 1.000000),
(84, 20, 9, 8, 1.000000),
(85, 20, 9, 10, 1.000000),
(86, 20, 10, 5, 1.000000),
(87, 20, 10, 6, 1.000000),
(88, 20, 10, 7, 1.000000),
(89, 20, 10, 8, 1.000000),
(90, 20, 10, 9, 1.000000),
(91, 21, 5, 6, 1.000000),
(92, 21, 5, 7, 1.000000),
(93, 21, 5, 8, 1.000000),
(94, 21, 5, 9, 1.000000),
(95, 21, 5, 10, 1.000000),
(96, 21, 6, 5, 1.000000),
(97, 21, 6, 7, 1.000000),
(98, 21, 6, 8, 1.000000),
(99, 21, 6, 9, 1.000000),
(100, 21, 6, 10, 1.000000),
(101, 21, 7, 5, 1.000000),
(102, 21, 7, 6, 1.000000),
(103, 21, 7, 8, 3.000000),
(104, 21, 7, 9, 1.000000),
(105, 21, 7, 10, 1.000000),
(106, 21, 8, 5, 1.000000),
(107, 21, 8, 6, 1.000000),
(108, 21, 8, 7, 0.330000),
(109, 21, 8, 9, 1.000000),
(110, 21, 8, 10, 1.000000),
(111, 21, 9, 5, 1.000000),
(112, 21, 9, 6, 1.000000),
(113, 21, 9, 7, 1.000000),
(114, 21, 9, 8, 1.000000),
(115, 21, 9, 10, 1.000000),
(116, 21, 10, 5, 1.000000),
(117, 21, 10, 6, 1.000000),
(118, 21, 10, 7, 1.000000),
(119, 21, 10, 8, 1.000000),
(120, 21, 10, 9, 1.000000),
(121, 22, 5, 6, 1.000000),
(122, 22, 5, 7, 1.000000),
(123, 22, 5, 8, 1.000000),
(124, 22, 5, 9, 1.000000),
(125, 22, 5, 10, 1.000000),
(126, 22, 6, 5, 1.000000),
(127, 22, 6, 7, 0.500000),
(128, 22, 6, 8, 1.000000),
(129, 22, 6, 9, 1.000000),
(130, 22, 6, 10, 1.000000),
(131, 22, 7, 5, 1.000000),
(132, 22, 7, 6, 2.000000),
(133, 22, 7, 8, 1.000000),
(134, 22, 7, 9, 1.000000),
(135, 22, 7, 10, 1.000000),
(136, 22, 8, 5, 1.000000),
(137, 22, 8, 6, 1.000000),
(138, 22, 8, 7, 1.000000),
(139, 22, 8, 9, 1.000000),
(140, 22, 8, 10, 1.000000),
(141, 22, 9, 5, 1.000000),
(142, 22, 9, 6, 1.000000),
(143, 22, 9, 7, 1.000000),
(144, 22, 9, 8, 1.000000),
(145, 22, 9, 10, 1.000000),
(146, 22, 10, 5, 1.000000),
(147, 22, 10, 6, 1.000000),
(148, 22, 10, 7, 1.000000),
(149, 22, 10, 8, 1.000000),
(150, 22, 10, 9, 1.000000),
(151, 23, 5, 6, 1.000000),
(152, 23, 5, 7, 1.000000),
(153, 23, 5, 8, 1.000000),
(154, 23, 5, 9, 1.000000),
(155, 23, 5, 10, 1.000000),
(156, 23, 6, 5, 1.000000),
(157, 23, 6, 7, 1.000000),
(158, 23, 6, 8, 2.000000),
(159, 23, 6, 9, 1.000000),
(160, 23, 6, 10, 1.000000),
(161, 23, 7, 5, 1.000000),
(162, 23, 7, 6, 1.000000),
(163, 23, 7, 8, 1.000000),
(164, 23, 7, 9, 1.000000),
(165, 23, 7, 10, 1.000000),
(166, 23, 8, 5, 1.000000),
(167, 23, 8, 6, 0.500000),
(168, 23, 8, 7, 1.000000),
(169, 23, 8, 9, 1.000000),
(170, 23, 8, 10, 1.000000),
(171, 23, 9, 5, 1.000000),
(172, 23, 9, 6, 1.000000),
(173, 23, 9, 7, 1.000000),
(174, 23, 9, 8, 1.000000),
(175, 23, 9, 10, 1.000000),
(176, 23, 10, 5, 1.000000),
(177, 23, 10, 6, 1.000000),
(178, 23, 10, 7, 1.000000),
(179, 23, 10, 8, 1.000000),
(180, 23, 10, 9, 1.000000),
(181, 24, 5, 6, 1.000000),
(182, 24, 5, 7, 1.000000),
(183, 24, 5, 8, 1.000000),
(184, 24, 5, 9, 1.000000),
(185, 24, 5, 10, 1.000000),
(186, 24, 6, 5, 1.000000),
(187, 24, 6, 7, 1.000000),
(188, 24, 6, 8, 0.500000),
(189, 24, 6, 9, 1.000000),
(190, 24, 6, 10, 1.000000),
(191, 24, 7, 5, 1.000000),
(192, 24, 7, 6, 1.000000),
(193, 24, 7, 8, 1.000000),
(194, 24, 7, 9, 1.000000),
(195, 24, 7, 10, 1.000000),
(196, 24, 8, 5, 1.000000),
(197, 24, 8, 6, 2.000000),
(198, 24, 8, 7, 1.000000),
(199, 24, 8, 9, 1.000000),
(200, 24, 8, 10, 1.000000),
(201, 24, 9, 5, 1.000000),
(202, 24, 9, 6, 1.000000),
(203, 24, 9, 7, 1.000000),
(204, 24, 9, 8, 1.000000),
(205, 24, 9, 10, 1.000000),
(206, 24, 10, 5, 1.000000),
(207, 24, 10, 6, 1.000000),
(208, 24, 10, 7, 1.000000),
(209, 24, 10, 8, 1.000000),
(210, 24, 10, 9, 1.000000),
(211, 25, 5, 6, 1.000000),
(212, 25, 5, 7, 1.000000),
(213, 25, 5, 8, 1.000000),
(214, 25, 5, 9, 1.000000),
(215, 25, 5, 10, 1.000000),
(216, 25, 6, 5, 1.000000),
(217, 25, 6, 7, 1.000000),
(218, 25, 6, 8, 2.000000),
(219, 25, 6, 9, 0.333333),
(220, 25, 6, 10, 1.000000),
(221, 25, 7, 5, 1.000000),
(222, 25, 7, 6, 1.000000),
(223, 25, 7, 8, 1.000000),
(224, 25, 7, 9, 1.000000),
(225, 25, 7, 10, 1.000000),
(226, 25, 8, 5, 1.000000),
(227, 25, 8, 6, 0.500000),
(228, 25, 8, 7, 1.000000),
(229, 25, 8, 9, 1.000000),
(230, 25, 8, 10, 1.000000),
(231, 25, 9, 5, 1.000000),
(232, 25, 9, 6, 3.000000),
(233, 25, 9, 7, 1.000000),
(234, 25, 9, 8, 1.000000),
(235, 25, 9, 10, 1.000000),
(236, 25, 10, 5, 1.000000),
(237, 25, 10, 6, 1.000000),
(238, 25, 10, 7, 1.000000),
(239, 25, 10, 8, 1.000000),
(240, 25, 10, 9, 1.000000);

-- --------------------------------------------------------

--
-- Table structure for table `criteria_weights`
--

CREATE TABLE `criteria_weights` (
  `id` bigint(20) NOT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `criteria_id` int(11) DEFAULT NULL,
  `weight_value` decimal(10,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criteria_weights`
--

INSERT INTO `criteria_weights` (`id`, `session_id`, `criteria_id`, `weight_value`) VALUES
(7, 19, 5, 0.165165),
(8, 19, 6, 0.149486),
(9, 19, 7, 0.165165),
(10, 19, 8, 0.189855),
(11, 19, 9, 0.165165),
(12, 19, 10, 0.165165),
(13, 20, 5, 0.162829),
(14, 20, 6, 0.140197),
(15, 20, 7, 0.162829),
(16, 20, 8, 0.162829),
(17, 20, 9, 0.208486),
(18, 20, 10, 0.162829),
(19, 21, 5, 0.162853),
(20, 21, 6, 0.162853),
(21, 21, 7, 0.208485),
(22, 21, 8, 0.140104),
(23, 21, 9, 0.162853),
(24, 21, 10, 0.162853),
(25, 22, 5, 0.165165),
(26, 22, 6, 0.149486),
(27, 22, 7, 0.189855),
(28, 22, 8, 0.165165),
(29, 22, 9, 0.165165),
(30, 22, 10, 0.165165),
(31, 23, 5, 0.165165),
(32, 23, 6, 0.189855),
(33, 23, 7, 0.165165),
(34, 23, 8, 0.149486),
(35, 23, 9, 0.165165),
(36, 23, 10, 0.165165),
(37, 24, 5, 0.165165),
(38, 24, 6, 0.149486),
(39, 24, 7, 0.165165),
(40, 24, 8, 0.189855),
(41, 24, 9, 0.165165),
(42, 24, 10, 0.165165),
(43, 25, 5, 0.160060),
(44, 25, 6, 0.161036),
(45, 25, 7, 0.160060),
(46, 25, 8, 0.147172),
(47, 25, 9, 0.211611),
(48, 25, 10, 0.160060);

-- --------------------------------------------------------

--
-- Table structure for table `detail_supplier`
--

CREATE TABLE `detail_supplier` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `nama_supply` varchar(255) DEFAULT NULL,
  `maksimal_produksi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_supplier`
--

INSERT INTO `detail_supplier` (`id`, `supplier_id`, `nama_supply`, `maksimal_produksi`) VALUES
(25, 74, 'Sempak', 133),
(31, 80, 'Sempak', 127),
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
(99, 80, 'Pipa PVC', 120),
(102, 114, 'Sempak', 100),
(103, 114, 'Alumunium Sheet', 300);

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
(57, 74, 'Kualitas', 6),
(58, 80, 'Kualitas', 2),
(60, 74, 'Pengiriman', 4),
(61, 80, 'Pengiriman', 1),
(63, 74, 'Harga', 1),
(64, 80, 'Harga', 1),
(66, 74, 'Kondisi finansial', 8),
(67, 80, 'Kondisi finansial', 4),
(69, 74, 'Kepatuhan prosedur', 9),
(70, 80, 'Kepatuhan prosedur', 3),
(72, 74, 'Layanan perbaikan', 8),
(73, 80, 'Layanan perbaikan', 5),
(74, 114, 'Kualitas', 8),
(75, 114, 'Pengiriman', 3),
(76, 114, 'Harga', 8),
(77, 114, 'Kondisi finansial', 9),
(78, 114, 'Kepatuhan prosedur', 2),
(79, 114, 'Layanan perbaikan', 10);

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
(201, 48, 'PT Jokowi Boti', 'Aluminium Sheet', 1, 130),
(202, 48, 'PT Sinar Terang Abadi', 'Aluminium Sheet', 2, 111),
(203, 48, 'CV Makmur Jaya', 'Aluminium Sheet', 3, 140),
(204, 48, 'PT Laju Prima', 'Aluminium Sheet', 4, 109),
(205, 48, 'UD Tekstil Mandiri', 'Aluminium Sheet', 5, 135),
(206, 48, 'CV Bintang Timur', 'Aluminium Sheet', 6, 129),
(207, 49, 'PT Laju Prima', 'Aluminium Sheet', 1, 109),
(208, 49, 'UD Tekstil Mandiri', 'Aluminium Sheet', 2, 135),
(209, 49, 'CV Bintang Timur', 'Aluminium Sheet', 3, 129);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `catatan_supply_id`, `file_path`, `catatan_validasi`, `status`, `tanggal_laporan`, `approved_by`, `ahp_session_id`) VALUES
(48, 49, 'http://localhost:5000/public/pdf/laporan_report_48.pdf', 'ert', 'menunggu', '2025-06-24', NULL, 24),
(49, 50, 'http://localhost:5000/public/pdf/laporan_report_49.pdf', 'hehee', 'menunggu', '2025-06-25', NULL, 25);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `nama`, `alamat`, `contact`, `keterangan`) VALUES
(74, 'UD Tekstil Mandiri', 'Yogyakarta', '+6284234567893', 'Fast response support'),
(80, 'CV Bintang Timur', 'Medan', '+6285234567894', 'Belum ada kerja sama sebelumnya'),
(114, 'PT COBA AJA', 'Sleman', '869587473', 'mantap');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_comparisons`
--

INSERT INTO `supplier_comparisons` (`id`, `session_id`, `criteria_id`, `supplier_a_id`, `supplier_b_id`, `comparison_value`) VALUES
(63, 25, 5, 74, 80, 0.500000),
(64, 25, 5, 80, 74, 2.000000);

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
(239, 48, 'Kualitas', 0.165165),
(240, 48, 'Pengiriman', 0.149486),
(241, 48, 'Harga', 0.165165),
(242, 48, 'Kondisi finansial', 0.189855),
(243, 48, 'Kepatuhan prosedur', 0.165165),
(244, 48, 'Layanan perbaikan', 0.165165),
(245, 49, 'Kualitas', 0.16006),
(246, 49, 'Pengiriman', 0.161036),
(247, 49, 'Harga', 0.16006),
(248, 49, 'Kondisi finansial', 0.147172),
(249, 49, 'Kepatuhan prosedur', 0.211611),
(250, 49, 'Layanan perbaikan', 0.16006);

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
(9, 'manager', '$2b$10$755QRVyin5FT9UE7M2eFI.Z100WOemmag8g0HQI0bD82iRJqzrzmu', 'managerasik@gmail.com', 'junior_manager'),
(11, 'seva', '$2b$10$B5L6NRQhMnk9H/rjUJ3T3eKss05eX85gD/bC7Y1gkCvtBuUu53NJq', 'seva@gmail.com', 'staff');

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `ahp_sessions`
--
ALTER TABLE `ahp_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `catatan_supply`
--
ALTER TABLE `catatan_supply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `criteria_comparisons`
--
ALTER TABLE `criteria_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;

--
-- AUTO_INCREMENT for table `criteria_weights`
--
ALTER TABLE `criteria_weights`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `detail_supplier`
--
ALTER TABLE `detail_supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `nilaikriteriasupplier`
--
ALTER TABLE `nilaikriteriasupplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `rankingsuppliers`
--
ALTER TABLE `rankingsuppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `supplier_comparisons`
--
ALTER TABLE `supplier_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `usedcriteria`
--
ALTER TABLE `usedcriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
