SELECT 
	orders.ship_name,
	AVG(
	order_details.unit_price * order_details.quantity * (1 - order_details.discount)
	)
	AS total_price
FROM order_details
JOIN orders
ON order_details.order_id = orders.order_id
GROUP BY orders.ship_name
ORDER BY total_price DESC;