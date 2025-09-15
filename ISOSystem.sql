-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: isosystem
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_results`
--

DROP TABLE IF EXISTS `audit_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empresa_id` int NOT NULL,
  `checklist_id` int NOT NULL,
  `estado` enum('Cumple','No cumple','No aplica') NOT NULL,
  `observaciones` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `empresa_id` (`empresa_id`),
  KEY `checklist_id` (`checklist_id`),
  CONSTRAINT `audit_results_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `registro_iso` (`id`) ON DELETE CASCADE,
  CONSTRAINT `audit_results_ibfk_2` FOREIGN KEY (`checklist_id`) REFERENCES `iso_9001_checklist` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_results`
--

LOCK TABLES `audit_results` WRITE;
/*!40000 ALTER TABLE `audit_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iso_9001_checklist`
--

DROP TABLE IF EXISTS `iso_9001_checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iso_9001_checklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clausula` varchar(20) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iso_9001_checklist`
--

LOCK TABLES `iso_9001_checklist` WRITE;
/*!40000 ALTER TABLE `iso_9001_checklist` DISABLE KEYS */;
INSERT INTO `iso_9001_checklist` VALUES (1,'4.3','Determinación del alcance del sistema de gestión de la calidad'),(2,'4.4','Sistema de gestión de la calidad y sus procesos'),(3,'5.1','Liderazgo y compromiso'),(4,'6.2','Objetivos de la calidad y planificación para lograrlos'),(5,'6.3','Planificación de los cambios'),(6,'7.1.4','Ambiente para la operación de los procesos'),(7,'7.1.6','Conocimientos de la organización'),(8,'7.2','Competencia'),(9,'7.3','Toma de conciencia'),(10,'7.5','Información documentada'),(11,'8.1','Planificación y control operacional'),(12,'8.2','Requisitos para los productos y servicios'),(13,'8.4','Control de los procesos, productos y servicios suministrados externamente'),(14,'8.5.2','Identificación y trazabilidad'),(15,'8.6','Liberación de los productos y servicios'),(16,'8.7','Control de los elementos de la salida del proceso, productos y servicios no conformes'),(17,'9.1','Seguimiento, medición, análisis y evaluación');
/*!40000 ALTER TABLE `iso_9001_checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_iso`
--

DROP TABLE IF EXISTS `registro_iso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_iso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(255) NOT NULL,
  `nit` varchar(50) NOT NULL,
  `representante_legal` varchar(255) NOT NULL,
  `sector_economico` enum('manufactura','tecnologia','servicios','comercio','salud','financiero','educacion','construccion','agricultura','otros') NOT NULL,
  `tipo_empresa` enum('sociedad_anonima','sociedad_ltda','empresa_unipersonal','sociedad_colectiva','cooperativa','microempresa','pyme','gran_empresa') NOT NULL,
  `numero_empleados` int NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `telefonos` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `web` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nit` (`nit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_iso`
--

LOCK TABLES `registro_iso` WRITE;
/*!40000 ALTER TABLE `registro_iso` DISABLE KEYS */;
/*!40000 ALTER TABLE `registro_iso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-15  0:26:07
