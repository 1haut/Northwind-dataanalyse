SELECT 
	date_part('year', order_date) || '-' || date_part('month', order_date) AS order_month,
	COUNT(*)
FROM orders
GROUP BY order_month
ORDER BY order_month