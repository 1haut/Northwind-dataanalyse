SELECT
	order_details.product_id, 
	products.product_name,
	EXTRACT(quarter FROM orders.order_date) AS quarter, 
	COUNT(*) AS sales
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
JOIN products ON order_details.product_id = products.product_id
WHERE order_details.product_id = 2
GROUP BY order_details.product_id, EXTRACT(quarter FROM orders.order_date), products.product_name
ORDER BY quarter

