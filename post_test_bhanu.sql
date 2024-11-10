-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2024 at 04:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `post_test_bhanu`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` bigint(20) NOT NULL,
  `department_name` varchar(255) DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  `manager_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `location_id`, `manager_id`) VALUES
(1, 'Administration', 1, 1),
(2, 'Marketing', 2, 2),
(3, 'Purchasing', 3, 3),
(4, 'Human Resources', 1, 4),
(5, 'Shipping', 4, 5),
(6, 'IT', 5, 6),
(7, 'Public Relations', 6, 7),
(8, 'Sales', 7, 8),
(9, 'Executive', 8, 9),
(10, 'Accounting', 9, 10);

-- --------------------------------------------------------

--
-- Table structure for table `department_seq`
--

CREATE TABLE `department_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_seq`
--

INSERT INTO `department_seq` (`next_val`) VALUES
(14);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` bigint(20) NOT NULL,
  `commission_pct` decimal(38,2) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `manager_id` bigint(20) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `salary` decimal(38,2) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `job_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `commission_pct`, `email`, `first_name`, `hire_date`, `last_name`, `manager_id`, `phone_number`, `salary`, `department_id`, `job_id`) VALUES
(36, 15.00, 'dika@gmail.com', 'Dika', '2024-11-08', 'Handika', 1, '0812345567844', 4000.00, 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee_seq`
--

CREATE TABLE `employee_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_seq`
--

INSERT INTO `employee_seq` (`next_val`) VALUES
(39);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` bigint(20) NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `min_salary` bigint(20) DEFAULT NULL,
  `max_salary` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `job_title`, `min_salary`, `max_salary`) VALUES
(1, 'Front End Developer', 6000, 8000),
(2, 'Back End Developer', 6000, 8000),
(5, 'Administration Manager', 8000, 9000),
(6, 'Marketing Specialist', 8000, 9000),
(7, 'Purchasing Officer', 5000, 7000),
(8, 'HR Manager', 9000, 11000),
(9, 'Shipping Coordinator', 6000, 7000),
(10, 'IT Support Specialist', 6000, 7000),
(11, 'Public Relations Officer', 7000, 8500),
(12, 'Sales Executive', 9000, 10000),
(13, 'Executive Assistant', 9000, 10000),
(14, 'Accounting Clerk', 6000, 8000);

-- --------------------------------------------------------

--
-- Table structure for table `job_history`
--

CREATE TABLE `job_history` (
  `job_history_id` bigint(20) NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date NOT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `employee_id` bigint(20) NOT NULL,
  `job_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_history`
--

INSERT INTO `job_history` (`job_history_id`, `end_date`, `start_date`, `department_id`, `employee_id`, `job_id`) VALUES
(4, NULL, '2024-11-08', 6, 36, 1);

-- --------------------------------------------------------

--
-- Table structure for table `job_history_seq`
--

CREATE TABLE `job_history_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_history_seq`
--

INSERT INTO `job_history_seq` (`next_val`) VALUES
(7);

-- --------------------------------------------------------

--
-- Table structure for table `job_seq`
--

CREATE TABLE `job_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_seq`
--

INSERT INTO `job_seq` (`next_val`) VALUES
(17);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `FKgy4qe3dnqrm3ktd76sxp7n4c2` (`department_id`),
  ADD KEY `FKnpqyu6u0fdh2rmqtoue23gxb4` (`job_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `job_history`
--
ALTER TABLE `job_history`
  ADD PRIMARY KEY (`job_history_id`),
  ADD KEY `FK7y43ipy5e5g2jd2vaiskn76c9` (`department_id`),
  ADD KEY `FKhbqeamoyj90wvkw4a25camb4n` (`employee_id`),
  ADD KEY `FK6wr8te1t0a1gqbfkfgtqhhkqf` (`job_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `FKgy4qe3dnqrm3ktd76sxp7n4c2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `FKnpqyu6u0fdh2rmqtoue23gxb4` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

--
-- Constraints for table `job_history`
--
ALTER TABLE `job_history`
  ADD CONSTRAINT `FK6wr8te1t0a1gqbfkfgtqhhkqf` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),
  ADD CONSTRAINT `FK7y43ipy5e5g2jd2vaiskn76c9` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `FKhbqeamoyj90wvkw4a25camb4n` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
