SELECT
	shippers.company_name,
	ROUND(
	CAST
	(AVG(DATE_PART('day', orders.shipped_date::TIMESTAMP - orders.order_date::TIMESTAMP)) AS numeric), 1)
	 AS shipping_days
FROM orders
JOIN shippers
ON orders.ship_via = shippers.shipper_id
GROUP BY shippers.shipper_id
ORDER BY shipping_days;