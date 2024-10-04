SELECT
	products.product_name AS prod_name,
	to_char(orders.order_date, 'yyyy-mm') AS order_month,
	COUNT(*) AS number_of_sales
FROM order_details
JOIN products ON order_details.product_id = products.product_id
JOIN orders ON order_details.order_id = orders.order_id
WHERE orders.order_date >= '1997-01-01' 
	AND orders.order_date < '1998-01-01' 
	AND (products.product_name = 'Geitost'
	OR products.product_name = 'Louisiana Fiery Hot Pepper Sauce'
	OR products.product_name = 'Zaanse koeken'
	OR products.product_name = 'Boston Crab Meat'
	OR products.product_name = 'Lakkalikööri'
	OR products.product_name = 'Röd Kaviar'
	OR products.product_name LIKE 'Sirop%')
GROUP BY prod_name, order_month
ORDER BY prod_name