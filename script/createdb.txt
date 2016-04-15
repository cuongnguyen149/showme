CREATE TABLE client_user(
   user_id VARCHAR(100) NOT NULL,
   user_name VARCHAR(100),
   pwd VARCHAR(100) NOT NULL,
   firstname VARCHAR(100),
   lastname VARCHAR(100),
   dob DATE,
   email VARCHAR(100)  NOT NULL,
   google_id VARCHAR(100),
   facebook_id VARCHAR(100),
   address VARCHAR(100),
   avatar TEXT,
   country VARCHAR(100),
   sex VARCHAR(10),
   phone VARCHAR(20),
   description VARCHAR(500),
   role VARCHAR(10) DEFAULT 'user',
   rating DOUBLE,
   fee_per_hour DOUBLE,
   month_income DOUBLE,
   is_active BOOL DEFAULT true,
   longitude DOUBLE,
   lattitude DOUBLE,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   device_uiid VARCHAR(100), 
   PRIMARY KEY ( user_id )
);

CREATE TABLE leader_user(
   leader_id VARCHAR(100) NOT NULL,
   leader_name VARCHAR(100),
   pwd VARCHAR(100) NOT NULL,
   firstname VARCHAR(100),
   lastname VARCHAR(100),
   dob DATE,
   email VARCHAR(100) NOT NULL,
   google_id VARCHAR(100),
   facebook_id VARCHAR(100),
   address VARCHAR(100),
   avatar TEXT,
   country VARCHAR(100),
   sex VARCHAR(10),
   phone VARCHAR(20),
   description VARCHAR(500),
   rating FLOAT,
   fee_per_hour FLOAT,
   month_income FLOAT,
   is_active BOOL,
   longitude DOUBLE,
   lattitude DOUBLE,
   create_date TIMESTAMP,
   update_date TIMESTAMP,
   device_uiid VARCHAR(100), 
   PRIMARY KEY ( leader_id )
);

CREATE TABLE user_comment(
	user_id VARCHAR(100) NOT NULL,
	transaction_id VARCHAR(100) NOT NULL,
	user_comment VARCHAR(500),
	create_date TIMESTAMP,
   update_date TIMESTAMP,
   rating_1 FLOAT,
   rating_2 FLOAT,
   PRIMARY KEY ( user_id, transaction_id )
);

CREATE TABLE leader_comment(
	leader_id VARCHAR(100) NOT NULL,
	transaction_id VARCHAR(100) NOT NULL,
	leader_comment VARCHAR(500),
	create_date TIMESTAMP,
   update_date TIMESTAMP,
   PRIMARY KEY ( leader_id, transaction_id )
);

CREATE TABLE user_transaction(
	transaction_id VARCHAR(100) NOT NULL,
	leader_id VARCHAR(100) NOT NULL,
	user_id VARCHAR(100) NOT NULL,
	call_start TIMESTAMP,
   call_end TIMESTAMP,
   fee FLOAT,
   PRIMARY KEY ( transaction_id )
);
