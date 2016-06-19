CREATE TABLE client_user(
   user_id VARCHAR(100) NOT NULL,
   user_name VARCHAR(100),
   pwd VARCHAR(100) NOT NULL,
   firstname VARCHAR(100),
   lastname VARCHAR(100),
   dob DATE,
   email VARCHAR(100)  NOT NULL,
   address VARCHAR(200),
   avatar TEXT,
   country VARCHAR(100),
   language VARCHAR(100),
   sex VARCHAR(10),
   phone VARCHAR(20),
   description VARCHAR(500), 
   role VARCHAR(10) DEFAULT 'user',
   rating DOUBLE default 0,
   rating_connection DOUBLE default 0,
   rating_visit DOUBLE default 0,
   rating_guide DOUBLE default 0,
   rating_recommend DOUBLE default 0,
   rating_counter INT default 0,
   fee_per_hour DOUBLE default 0,
   possible_purchase DOUBLE default 0,
   month_income DOUBLE,
   is_active BOOL DEFAULT false,
   longitude DOUBLE,
   latitude DOUBLE,
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   device_uiid VARCHAR(500),
   token VARCHAR(500), 
   PRIMARY KEY ( user_id )
);

CREATE TABLE user_transaction(
	transaction_id INT NOT NULL AUTO_INCREMENT,
	leader_id VARCHAR(100) NOT NULL,
	user_id VARCHAR(100) NOT NULL,
	call_start TIMESTAMP,
   call_end TIMESTAMP,
   role VARCHAR(10),
   rating_connection DOUBLE default 0,
   rating_visit DOUBLE default 0,
   rating_guide DOUBLE default 0,
   rating_recommend DOUBLE default 0,
   total_fee DOUBLE ,
   user_comment VARCHAR(500),
   leader_comment VARCHAR(500),
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
   call_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   call_end TIMESTAMP,
   is_payment BOOL default true,
   shipping_fee DOUBLE default 0,
   merchandise_fee DOUBLE default 0,
   tip DOUBLE default 0,
   total DOUBLE default 0,
   price DOUBLE default 0,
   service_fee DOUBLE default 0,
   list_number_merchandise VARCHAR(200) default '',
   create_date TIMESTAMP default now(),
   update_date TIMESTAMP default now() on update now(),
   PRIMARY KEY (id)
);

CREATE TABLE merchandise_type(
   id INT NOT NULL AUTO_INCREMENT,
   shipping_fee INT NOT NULL,
   merchandise_type VARCHAR(100) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE list_bought_merchandise(
   id INT NOT NULL AUTO_INCREMENT,
   transaction_price_id INT NOT NULL,
   merchandise_type_id INT NOT NULL,
   merchandise_fee DOUBLE default 0,
   PRIMARY KEY (id)
);

CREATE TABLE user_card_information(
   user_id VARCHAR(100) NOT NULL,
   card_number VARCHAR(50) NOT NULL,
   expiration_date VARCHAR(10) NOT NULL,
   cvv VARCHAR(10),
   PRIMARY KEY (user_id)
);