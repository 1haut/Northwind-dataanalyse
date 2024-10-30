SELECT 
	TO_CHAR(order_date, 'YYYY-MM') AS order_month,
	COUNT(*)
FROM orders
GROUP BY order_month
ORDER BY order_month