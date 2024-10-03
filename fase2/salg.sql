-- kunder solgt mest --
SELECT orders.ship_name, SUM(order_details.quantity) AS quant
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
GROUP BY orders.ship_name
ORDER BY quant DESC;
