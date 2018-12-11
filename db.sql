-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: ilovexeom
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `driverlocate`
--

DROP TABLE IF EXISTS `driverlocate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driverlocate` (
  `driverid` int(11) NOT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `st` int(11) DEFAULT NULL,
  PRIMARY KEY (`driverid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driverlocate`
--

LOCK TABLES `driverlocate` WRITE;
/*!40000 ALTER TABLE `driverlocate` DISABLE KEYS */;
INSERT INTO `driverlocate` VALUES (4,10.7661,106.664,2),(7,10.7661,106.664,2),(8,10.7681,106.663,0),(9,10.7622,106.642,0);
/*!40000 ALTER TABLE `driverlocate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idDriver` int(11) DEFAULT NULL,
  `BeginPlace` varchar(300) CHARACTER SET utf8 DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `Note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `Time` bigint(20) DEFAULT NULL,
  `State` tinytext,
  `CusName` tinytext NOT NULL,
  `CusPhone` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=552 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
INSERT INTO `request` VALUES (538,4,'49 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8009,106.734,'hehe',1544345882264,'Finished','Duy',1258906910),(539,4,'49 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.7993,106.721,'asdasd',1544346043659,'Finished','duy',12412323),(540,NULL,'46 Phan Xích Long, phường 3, Phú Nhuận, Ho Chi Minh City, Vietnam',10.8031,106.682,'asdasd',1544346211896,'Cancel','dung',1231232),(541,NULL,'45 Phan Xích Long, phường 3, Phú Nhuận, Ho Chi Minh City, Vietnam',10.8032,106.682,'12123',1544346291305,'Cancel','dung',123123213),(542,4,'10 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8026,106.746,'dddd',1544347034058,'Finished','ha',12312333),(543,NULL,'35 Nguyễn Xí, phường 26, Bình Thạnh, Ho Chi Minh City, Vietnam',10.8111,106.711,'dasd',1544347125841,'Cancel','nam',12312312),(544,NULL,'49 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8009,106.734,'asdasd',1544347616256,'located','ddasd',123123),(545,NULL,'19 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8,106.73,'ddd',1544347626702,'Cancel','dddd',123123),(546,NULL,'49 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8009,106.734,'d',1544351603294,'located','asdasd',1312312),(547,NULL,'Santa Fe 4300, Rosario, Santa Fe Province, Argentina',-32.9372,-60.6818,'asdasd',1544351810724,'located','sdasd',123123),(548,NULL,'49 Xa lộ Hà Nội, Thảo Điền, District 2, Ho Chi Minh City, Vietnam',10.8009,106.734,'d',1544351980584,'located','asdasd',123123123),(549,NULL,'Avenida Rivadavia 1238, Buenos Aires, Argentina',-34.6087,-58.384,'d',1544352197326,'located','asdasd',123123),(550,NULL,'Avenida Rivadavia 1238, Buenos Aires, Argentina',-34.6087,-58.384,'ddd',1544352280065,'located','asd',123123213),(551,NULL,'Avenida Rivadavia 1238, Buenos Aires, Argentina',NULL,NULL,'1111',1544352296164,'requesting','1',1111);
/*!40000 ALTER TABLE `request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `UserName` varchar(45) NOT NULL,
  `PassWord` varchar(45) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  `PhoneNumber` int(11) NOT NULL,
  `Permission` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Ta','4QrcOUm6Wau+VuBX8g+IPg==',1,'Hoai Minh',125678392,1),('too','4QrcOUm6Wau+VuBX8g+IPg==',2,'chi ',178928321,2),('Jun','4QrcOUm6Wau+VuBX8g+IPg==',3,'Junlila',167894612,3),('wendy','4QrcOUm6Wau+VuBX8g+IPg==',4,'John',125678932,4),('duy','4QrcOUm6Wau+VuBX8g+IPg==',5,'duy',1223344,1),('a','4QrcOUm6Wau+VuBX8g+IPg==',6,'Minh',122222,2),('b','4QrcOUm6Wau+VuBX8g+IPg==',7,'Le',1111,4),('c','4QrcOUm6Wau+VuBX8g+IPg==',8,'mina',11223,4),('d','4QrcOUm6Wau+VuBX8g+IPg==',9,'Jespine',11123412,4);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userRefreshTokenExt`
--

DROP TABLE IF EXISTS `userRefreshTokenExt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userRefreshTokenExt` (
  `UserId` int(11) NOT NULL,
  `refreshToken` varchar(100) DEFAULT NULL,
  `rdt` datetime DEFAULT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userRefreshTokenExt`
--

LOCK TABLES `userRefreshTokenExt` WRITE;
/*!40000 ALTER TABLE `userRefreshTokenExt` DISABLE KEYS */;
INSERT INTO `userRefreshTokenExt` VALUES (1,'4DUWaDCb1TVu2t6t5REdPmzmwS2QRyCkyHncFDNkqHzIxmZUhIiCHSlLdYsTzlgT6vrbDgFGjl5me2aK','2018-12-09 17:44:21'),(2,'v63LJ9mj7L09Ef1dgxQZ3NQJHpZYC5t6pbn41UV8CUz1n847HVgx55Urkf1QG6UeWfbaXoPWh0klY98D','2018-11-24 18:30:29'),(3,'QFDJHmDxwjOaemwJHsUaDv2DXyqfi5VYGzNjRnCJK9w7yact1ICRCHqGugvFyvHbWIIvAMrxozhgFZwR','2018-12-09 16:09:09'),(4,'L645Q8ZZOglCAdtOKGiTnnuNlzr3CJABm1CZMOKqjuh983KTrna4S14V6QdzZuvAFTKa7uyn6kH6GVVI','2018-12-09 16:26:17'),(5,'ErdRzhmlbxQv3d8shoY7wvTVQ0EPvqfUd0TzPi9pIby91hEJLl1WmLhEyBvsNDx2eAULdBVp1rySOsEf','2018-12-09 16:26:28'),(6,'NV65igKKvY2tf90P9zKLIOLhON3DjEy4vBK3E1EkDbn8NzNmGRFTHtICf4RCCCS3BJ9WNoYa9eNTj0EQ','2018-12-09 17:33:10'),(7,'jkGHlQ6s42iej8jeN4AJGAwpUD7ktlBipsvCoEvidFrmrIqnZdVtzscXDTfdiLL4dVMa9bWsLzfcXaCd','2018-12-09 16:26:41'),(8,'aP4bALY2b7LOFmucryVitwCkZxdAG9y5cS3WNw7qtnZJbPTSznGZfxl7A73Sr0d7V7dHqTL8teqESAlx','2018-11-25 16:36:07'),(9,'tQVwD9mxZOf8zKeTfsU0HL0QwLvKtXewJ5uMfbD1xLMFJUXvjeF253ogumcrIlOdTDDyoIHKIibQZkxA','2018-11-24 21:23:04');
/*!40000 ALTER TABLE `userRefreshTokenExt` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-11 13:27:23
