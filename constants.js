var constants = {
	ERROR : "error",
	MESSAGE: "message",
	MESSAGE_QUICKBLOX_ERR: "Opp! something went wrong with Quickblox!",
	MESSAGE_DATABASE_ERR: "Opp! something went wrong with Database!",
	BAD_PARAMETERS: "Bad parameters.",
	//DATABASE TABLE
	CLIENT_USER: "client_user",
	LEADER_USER: "leader_user",


	//DATABASE COLLUM
	
	//USER
	USER_ID: "user_id",
	PWD: "pwd",
	USER_NAME: "user_name",
	USER_COMMENT: "user_comment",

	//LEADER
	LEADER_ID: "leader_id",
	LEADER_NAME: "leader_name",
	LEADER_COMMENT: "leader_comment",
	DESCRIPTION: "description",
	RATING: "rating",
	FEE_PER_HOUR: "fee_per_hour",
	POSSIBLE_PURCHASE: "possible_purchase",
	MONTH_INCOME: "month_income",
	IS_ACTIVE: "is_active",
	LONGITUDE: "longitude",
	LATITUDE: "latitude",

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