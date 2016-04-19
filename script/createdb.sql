CREATE TABLE client_user(
   user_id VARCHAR(100) NOT NULL,
   user_name VARCHAR(100),
   pwd VARCHAR(100) NOT NULL,
   firstname VARCHAR(100),
   lastname VARCHAR(100),
   dob DATE,
   email VARCHAR(100)  NOT NULL,
   address VARCHAR(100),
   avatar TEXT,
   country VARCHAR(100) default 'Viet Nam',
   sex VARCHAR(10) default 'male',
   phone VARCHAR(20) default '+841234567890',
   description VARCHAR(500),
   role VARCHAR(10) DEFAULT 'user',
   rating DOUBLE default 4,
   fee_per_hour DOUBLE default 23,
   month_income DOUBLE,
   is_active BOOL DEFAULT true,
   longitude DOUBLE,
   latitude DOUBLE,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   device_uiid VARCHAR(100), 
   PRIMARY KEY ( user_id )
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
