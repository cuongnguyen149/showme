angular.module('showme.controllers', []).
controller('apiController', function($scope) {
	var responseObject = [
		{
			name: 'leaderStart',
			responseExample: {
				data:{
					leader:{
						leader_id:"1"
					}	
				}
			}
		},
		{
			name: 'callEnd',
			responseExample: {
				data:{
					call:{
						call_end:"2016-05-20T18:50:16.000Z",
						call_start:"2016-05-20T18:49:16.000Z",
						create_date:"2016-05-20T18:49:16.000Z",
						dialog_id:"1231",
						id:4,
						is_payment:0,
						leader_id:"1",
						merchandise_fee:0,
						price:0,
						total:676.4426944444444,
						service_fee:0,
						shipping_fee:0,
						update_date:"2016-05-20T18:49:16.000Z",
						user_id:"12"						
					}
				}
			}
		},
		{
			name: 'getCallByUserId',
			responseExample: {
				data:{
					call:{
						call_end:"0000-00-00 00:00:00",
						call_start:"2016-05-20T18:49:16.000Z",
						create_date:"2016-05-20T18:49:16.000Z",
						dialog_id:"1231",
						id:4,
						is_payment:0,
						leader_id:"1",
						merchandise_fee:0,
						price:0,
						total:676.4426944444444,
						service_fee:0,
						shipping_fee:0,
						update_date:"2016-05-20T18:49:16.000Z",
						user_id:"12"						
					}
				}
			}
		},
		{
			name: 'callStart',
			responseExample: {
				data:{
					call:{
						call_end:"0000-00-00 00:00:00",
						call_start:"2016-05-20T18:49:16.000Z",
						create_date:"2016-05-20T18:49:16.000Z",
						dialog_id:"1231",
						id:4,
						is_payment:0,
						leader_id:"1",
						merchandise_fee:0,
						price:0,
						total:676.4426944444444,
						service_fee:0,
						shipping_fee:0,
						update_date:"2016-05-20T18:49:16.000Z",
						user_id:"12"						
					}
				}
			}
		},
		{
			name: 'getPrice',
			responseExample: {
				data:{
					callPrice:{
						call_end:"0000-00-00 00:00:00",
						call_start:"2016-05-20T18:49:16.000Z",
						create_date:"2016-05-20T18:49:16.000Z",
						dialog_id:"1231",
						id:4,
						is_payment:0,
						leader_id:"1",
						merchandise_fee:0,
						price:0,
						service_fee:0,
						shipping_fee:0,
						total:676.4426944444444,
						update_date:"2016-05-20T18:49:16.000Z",
						user_id:"12"
					}
				}
			}
		},
		{
			name: 'merchandiseRequest',
			responseExample: {
				data:{
					merchanRequest:{
						merchandise_fee:"12",
						merchandise_type:"VIP",
						shipping_fee:"32"	
					}
				}
			}
		},
		{
			name: 'acceptMerchandiseRequest',
			responseExample: {
				data: {
					call:{
					call_end:"0000-00-00 00:00:00",
					call_start:"2016-05-20T18:49:16.000Z",
					create_date:"2016-05-20T18:49:16.000Z",
					dialog_id:"1231",
					id:4,
					is_payment:0,
					leader_id:"1",
					merchandise_fee:0,
					price:0,
					service_fee:0,
					shipping_fee:0,
					update_date:"2016-05-20T18:49:16.000Z",
					user_id:"12"	
					}
				}
			}
		}
	];
	$scope.getResponseExample = function(string){
		// for (var i = 0; i< responseObject.length; i++){
		// 	if(responseObject[i].name == string){
		// 		$scope.response = responseObject[i].responseExample;
		// 		break;
		// 	}else{
		// 		$scope.response = "Response unavailable."
		// 	}
		// };	
		for (var i =0 in responseObject){
			if(responseObject[i].name == string){
				$scope.response = responseObject[i].responseExample;
				$scope.name     = responseObject[i].name;
				break;
			}else{
				$scope.response = "Response unavailable."
			}
		}
	};
});