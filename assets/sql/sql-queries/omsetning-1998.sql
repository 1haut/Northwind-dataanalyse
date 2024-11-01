

WITH total_price AS (
	SELECT
	orders.order_date,
	order_details.unit_price * order_details.quantity * (1 - order_details.discount) price
	FROM orders
	JOIN order_details ON orders.order_id = order_details.order_id
)

SELECT ROUND(SUM(price)::numeric) total_revenue FROM total_price WHERE order_date > '1998-01-01'