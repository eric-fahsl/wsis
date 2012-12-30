CREATE TABLE `snowfall_totals` (
  `resort` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `updated_time` varchar(80),
  `snowfall` float DEFAULT NULL,
  PRIMARY KEY (`resort`,`updated_time`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;