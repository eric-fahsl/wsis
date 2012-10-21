-- MySQL dump 10.13  Distrib 5.5.24, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: wsis
-- ------------------------------------------------------
-- Server version	5.5.24-0ubuntu0.12.04.1

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
-- Table structure for table `resort_master`
--

DROP TABLE IF EXISTS `resort_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resort_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `region` varchar(45) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `wund_query` varchar(45) DEFAULT NULL,
  `web_url` varchar(100) DEFAULT NULL,
  `weather_report_url` varchar(100) DEFAULT NULL,
  `last24_element` varchar(45) DEFAULT NULL,
  `active` binary(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resort_master`
--

LOCK TABLES `resort_master` WRITE;
/*!40000 ALTER TABLE `resort_master` DISABLE KEYS */;
INSERT INTO `resort_master` VALUES (3,'Arapahoe Basin','Rockies','CO',39.665,-105.879,'pws:MGZPC2','http://www.arapahoebasin.com','http://www.arapahoebasin.com/ABasin/snow-conditions/default.aspx',NULL,'T'),(4,'Alpental','Pacific Northwest','WA',47.4395,-121.418,'pws:MALP31','http://www.summitatsnoqualmie.com/Mountains/Alpental','http://www.summitatsnoqualmie.com/Weather',NULL,'T'),(5,'White Pass','Pacific Northwest','WA',46.6287,-121.396,'NA','http://skiwhitepass.com','http://skiwhitepass.com/index.php?option=com_content&view=article&id=58&Itemid=90',NULL,'T');
/*!40000 ALTER TABLE `resort_master` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-10-21 10:53:24
