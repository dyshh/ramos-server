/*
 Navicat Premium Data Transfer

 Source Server         : pky
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : chatroom

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 29/06/2019 14:58:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS
= 0;
SET SQL_MODE
= "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT
= 0;
START TRANSACTION;
SET time_zone
= "+00:00";

-- ----------------------------
-- Table structure for group_info
-- ----------------------------
DROP TABLE IF EXISTS `group_info`;
CREATE TABLE `group_info`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `to_group_id` char
(100) NOT NULL,
  `name` char
(10) CHARACTER
SET utf8
COLLATE utf8_general_ci NOT NULL,
  `group_notice` varchar
(100) NOT NULL DEFAULT '',
  `creator_id` int
(11) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group_msg
-- ----------------------------
DROP TABLE IF EXISTS `group_msg`;
CREATE TABLE `group_msg`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `from_user_id` int
(11) NOT NULL,
  `to_group_id` char
(100) NOT NULL,
  `message` text CHARACTER
SET utf8
COLLATE utf8_general_ci,
  `created_at` datetime NOT NULL,
  `type` int
(11) NOT NULL DEFAULT '1',
  `url` varchar
(255) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  KEY `to_group_id`
(`to_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group_user_relation
-- ----------------------------
DROP TABLE IF EXISTS `group_user_relation`;
CREATE TABLE `group_user_relation`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `to_group_id` char
(100) NOT NULL,
  `user_id` int
(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `latest_read_time` datetime DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for private_msg
-- ----------------------------
DROP TABLE IF EXISTS `private_msg`;
CREATE TABLE `private_msg`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `from_user_id` int
(11) NOT NULL,
  `to_user_id` int
(11) NOT NULL,
  `message` text,
  `created_at` datetime NOT NULL,
  `type` int
(11) NOT NULL,
  `url` varchar
(255) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  KEY `from_user`
(`from_user_id`),
  KEY `to_user`
(`to_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` varchar
(20) NOT NULL DEFAULT '',
  `password` varchar
(100) CHARACTER
SET utf8
COLLATE utf8_general_ci NOT NULL,
  `avatar` varchar
(250) CHARACTER
SET utf8
COLLATE utf8_general_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `status` tinyint
(1) NOT NULL DEFAULT '0',
  `socket_id` varchar
(20) DEFAULT NULL,
  `salt` varchar
(50) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_user_relation
-- ----------------------------
DROP TABLE IF EXISTS `user_user_relation`;
CREATE TABLE `user_user_relation`
(
  `id` int
(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int
(11) NOT NULL,
  `friend_id` int
(11) NOT NULL,
  `remark` varchar
(10) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `latest_read_time` datetime DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS
= 1;
