SELECT
    CASE 
        WHEN unit_price * (1 - discount) <= 10 THEN '0-10'
        WHEN unit_price * (1 - discount) <= 20 THEN '10.001-20'
        WHEN unit_price * (1 - discount) <= 30 THEN '20.001-30'
        WHEN unit_price * (1 - discount) <= 40 THEN '30.001-40'
        WHEN unit_price * (1 - discount) <= 50 THEN '40.001-50'
        WHEN unit_price * (1 - discount) <= 60 THEN '50.001-60'
        WHEN unit_price * (1 - discount) <= 70 THEN '60.001-70'
        WHEN unit_price * (1 - discount) <= 80 THEN '70.001-80'
        WHEN unit_price * (1 - discount) <= 90 THEN '80.001-90'
        WHEN unit_price * (1 - discount) <= 100 THEN '90.001-100'
		WHEN unit_price * (1 - discount) > 100 THEN 'over 100'
    END AS price_range,
    COUNT(*) AS amount_sales
FROM order_details
GROUP BY price_range
ORDER BY price_range;
