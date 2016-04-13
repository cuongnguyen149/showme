SELECT * FROM test_location.location_double;

INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.764477, 106.700848 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.764199, 106.697577 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.770996, 106.699855 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.773743, 106.703706 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.772678, 106.702622 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.770171, 106.694169 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.763770, 106.697946 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.770675, 106.715035 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.779018, 106.702048 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.753976, 106.686936 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.765214, 106.681795 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.766046, 106.686218 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.765931, 106.690965 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.759585, 106.689160 );
INSERT INTO test_location.location_double ( lat , lon ) VALUES ( 10.764797, 106.686237 );


SELECT id , lat, lon, ( 6371 * acos( cos( radians(106.686237) ) * cos( radians( lat ) ) 
* cos( radians( lon ) - radians(10.764797) ) + sin( radians(106.686237) ) * sin(radians(lat)) ) ) AS distance 
FROM test_location.location_double 
HAVING distance < 2
ORDER BY distance 
LIMIT 0 , 20;