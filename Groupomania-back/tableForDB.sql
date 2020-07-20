-- sn_prototype.users definition

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(72) NOT NULL,
  `timestamp` int(10) unsigned NOT NULL DEFAULT unix_timestamp(),
  `authorization` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_UN` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;


-- sn_prototype.posts definition

CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `categorie` tinytext NOT NULL,
  `title` tinytext NOT NULL,
  `url` tinytext NOT NULL,
  `data` text NOT NULL,
  `timestamp` int(10) unsigned NOT NULL DEFAULT unix_timestamp(),
  `editUserId` int(10) unsigned DEFAULT NULL,
  `editTimestamp` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_FK` (`userId`),
  CONSTRAINT `posts_FK` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;


-- sn_prototype.votes definition

CREATE TABLE `votes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `postId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `spin` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `votes_FK` (`postId`),
  KEY `votes_FK_1` (`userId`),
  CONSTRAINT `votes_FK` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `votes_FK_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- sn_prototype.comments definition

CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `postId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `data` text NOT NULL,
  `timestamp` int(10) unsigned NOT NULL DEFAULT unix_timestamp(),
  PRIMARY KEY (`id`),
  KEY `comments_FK` (`postId`),
  CONSTRAINT `comments_FK` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;