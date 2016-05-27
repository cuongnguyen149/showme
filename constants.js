var constants = {
	ERROR : "error",
	MESSAGE: "message",
	MESSAGE_QUICKBLOX_ERR: "Opp! something went wrong with Quickblox!",
	MESSAGE_DATABASE_ERR: "Opp! something went wrong with Database!",
	BAD_PARAMETERS: "Bad parameters.",
	//DATABASE TABLE
	CLIENT_USER: "client_user",
	LEADER_USER: "leader_user",
	USER_TRANSACTION: "user_transaction",
	TRANSACTION_PRICE: "transaction_price",
	MERCHANDISE_TYPE: "merchandise_type",
	
	//USER
	USER_ID: "user_id",
	PWD: "pwd",
	USER_NAME: "user_name",
	

	//LEADER
	LEADER_ID: "leader_id",
	LEADER_NAME: "leader_name",
	DESCRIPTION: "description",
	RATING: "rating",
	RATING_COUNTER: "rating_counter",
	FEE_PER_HOUR: "fee_per_hour",
	POSSIBLE_PURCHASE: "possible_purchase",
	MONTH_INCOME: "month_income",
	IS_ACTIVE: "is_active",
	LONGITUDE: "longitude",
	LATITUDE: "latitude",

	//TRANSACTION
	TRANSACTION_ID: "transaction_id",
	RATING_CONNECTION: "rating_connection",
	RATING_VISIT: "rating_visit",
	RATING_GUIDE: "rating_guide",
	RATING_RECOMMEND:"rating_recommend",
	USER_COMMENT: "user_comment",
	LEADER_COMMENT: "leader_comment",
	TOTAL_FEE: "total_fee",
	IS_PAYMENT: "is_payment",
	MERCHANDISE_FEE: "merchandise_fee",
	SHIPPING_FEE:"shipping_fee",
	SERVICE_FEE: "SERVICE_FEE",
	PRICE: "price",
	TYPE: "type",

	//DIALOG
	DIALOG: "dialog",
	ID : "id",
	DIALOG_ID: "dialog_id",
	//COMMON	
	FIRSTNAME: "firstname",
	LASTNAME: "lastname",
	DOB: "dob",
	EMAIL: "email",
	LANGUAGE : "language",
	ADDRESS : "address",
	AVATAR: "avatar",
	COUNTRY : "country",
	SEX: "sex",
	PHONE: "phone",
	CREATE_DATE: "create_date",
	UPDATE_DATE: "update_date",
	CALL_START: "call_start",
	CALL_END: "call_end",
	ROLE: "role",
	DEVICE_UIID: "device_uiid",
	LEADER: "leader",
	USER: "user",
	PWD_ADD: "SM",
	//RETURN CODE
	ERROR_CODE : 1000,
	SUCCESS_CODE : 2000,
	CREATE_CODE : 2002,
	DATABASE_ERROR_CODE : 1001,
	QUICKBLOX_ERROR_CODE : 1002,
	NO_TOKEN_CODE : 1003,
	TOKEN_EXPIRE_CODE: 1004,
	TOKEN_ERROR_CODE : 1005
}
module.exports = constants;