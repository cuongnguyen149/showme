CREATE TABLE client_user(
   user_id VARCHAR(100) NOT NULL,
   user_name VARCHAR(100),
   pwd VARCHAR(100) NOT NULL,
   firstname VARCHAR(100),
   lastname VARCHAR(100),
   dob DATE,
   email VARCHAR(100)  NOT NULL,
   address VARCHAR(200) default 'cau ong lanh',
   avatar TEXT,
   country VARCHAR(100) default 'Viet Nam',
   language VARCHAR(100) default 'English',
   sex VARCHAR(10) default 'male',
   phone VARCHAR(20) default '+841234567890',
   description VARCHAR(500) default "Je suis architecte et passionné d'architecture. Paris est une ville formidable que je vous ferai visiter avec passion.",
   role VARCHAR(10) DEFAULT 'user',
   rating DOUBLE default 4,
   rating_counter INT default 8,
   fee_per_hour DOUBLE default 25,
   possible_purchase DOUBLE default 150,
   month_income DOUBLE,
   is_active BOOL DEFAULT false,
   longitude DOUBLE,
   latitude DOUBLE,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   device_uiid VARCHAR(500), 
   PRIMARY KEY ( user_id )
);

CREATE TABLE user_transaction(
	transaction_id INT NOT NULL AUTO_INCREMENT,
	leader_id VARCHAR(100) NOT NULL,
	user_id VARCHAR(100) NOT NULL,
	call_start TIMESTAMP,
   call_end TIMESTAMP,
   rating_connection FLOAT,
   rating_visit FLOAT,
   rating_guide FLOAT,
   rating_recommend FLOAT,
   total_fee FLOAT,
   user_comment VARCHAR(500),
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   PRIMARY KEY ( transaction_id )
);

CREATE TABLE dialog(
   id INT NOT NULL AUTO_INCREMENT,
   dialog_id VARCHAR(100) NOT NULL,
   user_id VARCHAR(100) NOT NULL,
   leader_id VARCHAR(100) NOT NULL,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   PRIMARY KEY (id),
   UNIQUE KEY dialog_id (dialog_id)
);

CREATE TABLE transaction_price(
   id INT NOT NULL AUTO_INCREMENT,
   dialog_id VARCHAR(100) NOT NULL,
   user_id VARCHAR(100) NOT NULL,
   leader_id VARCHAR(100) NOT NULL,
   call_start TIMESTAMP,
   call_end TIMESTAMP,
   is_payment BOOL DEFAULT false,
   shipping_fee DOUBLE DEFAULT 0,
   buying_fee DOUBLE DEFAULT 0,
   price DOUBLE DEFAULT 0,
   service_fee DEFAULT 0,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   PRIMARY KEY (id)
);