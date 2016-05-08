-- MySQL dump 10.13  Distrib 5.6.28, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: showme_db
-- ------------------------------------------------------
-- Server version	5.6.28-0ubuntu0.15.10.1

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
-- Table structure for table `client_user`
--

DROP TABLE IF EXISTS `client_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_user` (
  `user_id` varchar(100) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `pwd` varchar(100) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(200) DEFAULT 'cau ong lanh',
  `avatar` text,
  `country` varchar(100) DEFAULT 'Viet Nam',
  `language` varchar(100) DEFAULT 'English',
  `sex` varchar(10) DEFAULT 'male',
  `phone` varchar(20) DEFAULT '+841234567890',
  `description` varchar(500) DEFAULT 'Je suis architecte et passionné d''architecture. Paris est une ville formidable que je vous ferai visiter avec passion.',
  `role` varchar(10) DEFAULT 'user',
  `rating` double DEFAULT '4',
  `rating_counter` int(11) DEFAULT '12',
  `fee_per_hour` double DEFAULT '25',
  `possible_purchase` double DEFAULT '150',
  `month_income` double DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `device_uiid` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_user`
--

LOCK TABLES `client_user` WRITE;
/*!40000 ALTER TABLE `client_user` DISABLE KEYS */;
INSERT INTO `client_user` VALUES ('1',NULL,'123','Ana','Lucia','1999-12-21','a1@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.700848,10.764477,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('10',NULL,'123','Jack','Sheper','1999-12-21','a10@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar4.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.686936,10.753976,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('11',NULL,'123','John','Lock','1999-12-21','a11@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.681795,10.765214,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('12',NULL,'123','Sara','Oliver','1999-12-21','a12@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar5.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.686218,10.766046,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('12229547',NULL,'12345678SM','user','name 2','1989-04-02','user2@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.7107433,10.82512,'2016-05-02 04:24:06','2016-05-02 04:43:15','cvMMpMYM-a8:APA91bHs1UVOHRt_rDIvJ2DyWibUEgS9x_hepfeTYRFVavBOHifPQ2rFbN1qNk8SwjnFFiIptozdfPlCrficmKCdymH588-EZhJdHqgjG5YjugYCEi3lEolrV7TQp3T3VOSWfbHoE5DU'),('12229727',NULL,'12345678SM','name','nenw','1991-04-02','user3@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,NULL,NULL,'2016-05-02 04:34:38','2016-05-02 04:34:38','dchFgkhVVs8:APA91bEtQ9QmeD-DJm8rSStE2wfVW8RXPgDhQpto2f0mkurt4a_o3-_XE6fdqdxTiD0YoHjLl8O56E3jc-_QHHPvujvzWtIpQ3wyb_xyLnSCZ4ejRq4qEe0oDwirYS80Z67Z4hnK_qkp'),('12229920',NULL,'12345678SM','new','name','1993-04-02','leader@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.7107433,10.82512,'2016-05-02 04:46:50','2016-05-02 05:14:52','eVjwVXeD92I:APA91bEXPGGBSM-Y_G7oCLizVYHE532Tk3t-ipZ7CTF3Eu183hi7HoGvc4Fp1nGuX3ogM2vvbqCosW4PO6UNfNb4AC90dp80s40IveK8i7JCALkj7kgJiq8sPq21ig_xjtjpj2uMKygS'),('12234736',NULL,'VanHuy91SM','Van Huy','TRINH','1991-08-27','kingofspeed6@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,NULL,NULL,'2016-05-02 08:57:42','2016-05-02 08:57:42','dn0o67Qs3TY:APA91bG6rA421klMS3tI34NK-pOmAXu4HMeAn3Pmcukloh-dQs957oXHL7Sym_i8iwKAy564n1aS-6q5PB3hOXFuqr9tVEFmFQg-bgllKPSdRCyMcg4pAA92-PHEXAmPfiOn1-pUi1H4'),('12234815',NULL,'12345678SM','Felix ','Becquart ','1990-01-13','felixthefelix@hotmail.fr','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,2.3542288,48.8935529,'2016-05-02 09:00:49','2016-05-02 12:33:48','cNaaTuq1pWE:APA91bHAmHu0upaqOD4E2xg5sGkxCKY7Bgl9XnmXsKWtJQZ0S3TJdPOuvk9hzpuzxG7prHeEu5ptL5PCbRpzFoHbYCIZxmZVPh_dI2FzShFdrx5TmY6FpXrBrHJoH8DtNggGcRYO7Amv'),('12278735',NULL,'testshowmeSM','jean','ram','1990-06-06','jrama33@yahoo.fr','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,2.29211,48.8906783,'2016-05-03 14:04:09','2016-05-05 11:38:36','dgTZHx4g_VI:APA91bHQlBvO96PLQaU6_LCbn_Er7AdQOVcEKZFEmBOx8WS7jDIUHbzlvM7dO_TWFSjBgJeCLO07ekHG11xgOJX09QrTXEh9pnyvgyBf7fY5PO0gLaeeISfOqvV7nlEP6IYTm3UxIBOj'),('12340544',NULL,'alextestSM','axelle','ram','1983-06-08','aramage33@yahoo.fr','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,NULL,NULL,'2016-05-05 11:26:43','2016-05-05 11:26:43','f_NpXEg5Usg:APA91bHxFp1KVmmyOE7HLOmv_NviQyCbR5KsdTyBP2ZX9wP8MDNXB_TefT9m9W3176OqgvsLw6ishBT9ERXQ40fagkOoPbIP3IhxKTKbqXWZeDDxGFhWQ0SP0mLv80gAXYIuLtHzNXqK'),('12340763',NULL,'852852852SM','Uly','Dev','1980-04-30','ulysse741741741@yahoo.fr','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,NULL,NULL,'2016-05-05 11:35:26','2016-05-05 20:22:09','dhEaX1BlywY:APA91bGD2DHzP2swnsYGixxzvWTcCdiW0QBKxw-C3W24t5XBpVIQJJvKSbaIT9rVwcnPl7Wv8J7gSwb5lwIAbAkFLRcDwR8fYFA5gnzJ8sS9_k4FDJJF9yAqknzMt3nGIEwfnvfJeusw'),('12346933',NULL,'12345678SM','user','nick','1999-04-05','user4@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,NULL,NULL,'2016-05-05 15:08:26','2016-05-05 15:08:26','cF8L8V4pLR8:APA91bHaCvOxE-4146PTO4hA7R6a3fJMWTztkwa_iciAanMeltZ62kkggEgSyjRlkYSZVYO2Vi4uZpp7n3G3REoURN8GsTytr0XGzVM07PGhyZ2N0VKUI6pOX_xtZNwqzYqB8V8Q614H'),('12346943',NULL,'12345678SM','user','nick','1999-04-05','sng1@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,106.6961898,10.7655439,'2016-05-05 15:08:43','2016-05-07 14:09:41','cX5Vyzhz50c:APA91bH_Gg5TiS2CvHo5jgAT0DQ-8o0IBPFkd-_ZsIB81IS7_LnIexZLlgMgImRTOWuRwS63RKJF5pPgHQR6OEpmYKFyReDFKQbSghpB16sutlMlNahxeP8LQYfiCiiMeFs2hTv4082y'),('12348559',NULL,'12345678SM','so ','hai','1990-04-05','sng2@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.7100677,10.7695894,'2016-05-05 16:07:12','2016-05-08 15:13:41','fakGvYR6MGw:APA91bHPUlLx_1pJZiGtsth1LPzFgejEVj3QG8leaP0VS9ymqrQ7QFediqPscUkDFEIo3yOU7qgC-Zg0AE7yFrsAj5sJ2OY-HH-mpoFdPmwV6JyG9REo-rLE5eOhiyHQMu-Ai63SI6nN'),('12400312',NULL,'12345678SM','sng','so 5','1988-04-07','sng5@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,NULL,NULL,'2016-05-07 02:52:14','2016-05-07 04:18:13','c1ZHPjTCacU:APA91bFleRvBwGPlrGOPAidirKcS6IMrXl4PBTXido7B-3wjQqFWJW9T9ITMttikr6TImkTYho93ed-J472rx_YsSHXWA2CG_p4U5t6KxeYGHKD7fGm9gYiFdSC_QS98nGzevlT6_FE_'),('12409865',NULL,'12345678SM','sng ','sng 6','2002-04-07','sng6@gmail.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','user',4,12,25,150,NULL,0,106.7189407,10.7855739,'2016-05-07 10:41:04','2016-05-08 14:32:35','cAzYixWUnmg:APA91bHXHB0nTVsHh_9Pd8Lrk0WEo66Mje6wJFVE__s87GP1DGQJZG7fi_j2xNrdkaHkkttvMh03kbLdni7F01t--76FAdSHfDKEl24su9ShU4lJC6GZgfTDE_0IRSpQxd25ATHUf4yq'),('13',NULL,'123','Leo','Messi','1999-12-21','a13@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar6.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.690965,10.765931,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('14',NULL,'123','John','Lock','1999-12-21','a14@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.68916,10.759585,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('15',NULL,'123','John','Lock','1999-12-21','a15@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.686237,10.764797,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('2',NULL,'123','John','Lock','1999-12-21','a2@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.697577,10.764199,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('3',NULL,'123','John','Lock','1999-12-21','a3@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar1.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.699855,10.770996,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('4',NULL,'123','Selena','Henry','1999-12-21','a4@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar2.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.703706,10.773743,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('5',NULL,'123','John','Lock','1999-12-21','a5@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.702622,10.772678,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('6',NULL,'123','Randy','Joe','1999-12-21','a6@a.com','cau ong lanh','http://51.254.98.255/showme/v1/image/user/avatar/avatar3.jpg','Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.694169,10.770171,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('7',NULL,'123','John','Lock','1999-12-21','a7@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.697946,10.76377,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('8',NULL,'123','John','Lock','1999-12-21','a8@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.715035,10.770675,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL),('9',NULL,'123','John','Lock','1999-12-21','a9@a.com','cau ong lanh',NULL,'Viet Nam','English','male','+841234567890','Je suis architecte et passionné d\'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.','leader',4,12,25,150,NULL,0,106.702048,10.779018,'2016-05-02 04:22:20','2016-05-02 04:22:20',NULL);
/*!40000 ALTER TABLE `client_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leader_comment`
--

DROP TABLE IF EXISTS `leader_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leader_comment` (
  `leader_id` varchar(100) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `leader_comment` varchar(500) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`leader_id`,`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leader_comment`
--

LOCK TABLES `leader_comment` WRITE;
/*!40000 ALTER TABLE `leader_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `leader_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leader_user`
--

DROP TABLE IF EXISTS `leader_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leader_user` (
  `leader_id` varchar(100) NOT NULL,
  `leader_name` varchar(100) DEFAULT NULL,
  `pwd` varchar(100) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `avatar` text,
  `country` varchar(100) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `fee_per_hour` float DEFAULT NULL,
  `month_income` float DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `longitude` varchar(20) DEFAULT NULL,
  `lattitude` varchar(20) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `device_uiid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leader_user`
--

LOCK TABLES `leader_user` WRITE;
/*!40000 ALTER TABLE `leader_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `leader_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_comment`
--

DROP TABLE IF EXISTS `user_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_comment` (
  `user_id` varchar(100) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `user_comment` varchar(500) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `rating_1` float DEFAULT NULL,
  `rating_2` float DEFAULT NULL,
  PRIMARY KEY (`user_id`,`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_comment`
--

LOCK TABLES `user_comment` WRITE;
/*!40000 ALTER TABLE `user_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_transaction`
--

DROP TABLE IF EXISTS `user_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_transaction` (
  `transaction_id` varchar(100) NOT NULL,
  `leader_id` varchar(100) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `call_start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `call_end` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fee` float DEFAULT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_transaction`
--

LOCK TABLES `user_transaction` WRITE;
/*!40000 ALTER TABLE `user_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-08 19:47:10
