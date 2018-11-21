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
INSERT INTO `driverlocate` VALUES (4,12.345,12.2,0),(8,2,2,1);
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
  `idUser` int(11) DEFAULT NULL,
  `idDriver` int(11) DEFAULT NULL,
  `BeginPlace` varchar(300) CHARACTER SET utf8 DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `Note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `Time` varchar(20) DEFAULT NULL,
  `State` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
INSERT INTO `request` VALUES (237,1,NULL,'Avenida Rivadavia 5160, Zarate, Buenos Aires, Argentina',NULL,NULL,NULL,'1542546892638','Located'),(238,1,NULL,'Avenida Rivadavia 5160, Zarate, Buenos Aires, Argentina',NULL,NULL,NULL,'1542546921108','requesting'),(239,1,NULL,'Avenida Rivadavia 5160, Zarate, Buenos Aires, Argentina',NULL,NULL,NULL,'1542546947318','Located'),(240,1,4,'Avenida Rivadavia 5160, Zarate, Buenos Aires, Argentina',12.345,12.2,NULL,'1542546973255','Waiting'),(241,1,7,'Avenida Rivadavia 5160, Zarate, Buenos Aires, Argentina',NULL,NULL,NULL,'1542546989166','waiting');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('Ta','4QrcOUm6Wau+VuBX8g+IPg==',1,'Hoai Minh',125678392,1),('too','4QrcOUm6Wau+VuBX8g+IPg==',2,'chi ',178928321,2),('Jun','4QrcOUm6Wau+VuBX8g+IPg==',3,'Junlila',167894612,3),('wendy','4QrcOUm6Wau+VuBX8g+IPg==',4,'John',125678932,4),('duy','4QrcOUm6Wau+VuBX8g+IPg==',5,'duy',1223344,1),('a','4QrcOUm6Wau+VuBX8g+IPg==',6,'Minh',122222,2),('b','4QrcOUm6Wau+VuBX8g+IPg==',7,'Le',1111,4),('c','4QrcOUm6Wau+VuBX8g+IPg==',8,'mina',11223,4);
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
INSERT INTO `userRefreshTokenExt` VALUES (1,'MUVGFKSLGf8tIhApKEfmaniJnvheIy543xuzNs00lfqaREQfFME7NOMu2Os2wZRKSckEqb79YChv7ApW','2018-11-18 15:32:26'),(2,'mCWxX2l32ab4QeulQf8DkZCzen0yGr9UoIyTURold131cYDlMKlHuyGMgAZidTM3Tpk2wg2mFaGKobB5','2018-11-18 14:58:08'),(3,'vk3Lr5Blh7M9cBu5ky1i2Tgcgw7lKv2IMkbaMFTEDTt9UV8jleJ2wi19pDDeozV8OxsQMpC0ohe20Y6H','2018-11-15 15:08:36'),(4,'yi4oI83WY8B2qdzeI5Vn8HKZIF1VSdTMchfero5zdAWzre2z1tXKsYLBLgo8onON0SlORaub1oznd4xZ','2018-11-18 19:10:39'),(5,'tLQ0o3eQ5WiBEa1XwAMLClxqM0nVUZ6JiuegGYJCSfuW3qQYJoB3VKTLr8VbThOc1C1lPjDXUwBNaJAw','2018-11-18 15:51:33'),(6,'TDjtCCz5KYKtJ9tTpW20ixS4yf8OknO4mzO3VDTQbxVrcwgqV0zVp7vpz7itbncYbvGFB6wnH3EC2qVI','2018-11-18 15:51:50'),(7,'64U2uDJTaJAhbjfWh2krjNiuvZZWLA43xoGIQ4NykP7bQCNPllMV71GefKN3P9Ezo5j8PfjGfZcFhFXv','2018-11-18 19:16:20'),(8,'ysoJklrCV8Vpcalo9c9hzmLOp5a6lwUiYo9kUtqhQoi8wRb96V8kriYXHIv8V5xSnYemHWpKHY4tSkVO','2018-11-18 19:15:44');
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

-- Dump completed on 2018-11-21  9:54:25
