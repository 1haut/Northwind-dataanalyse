-- ordrenummer --
SELECT order_id FROM orders;

-- ordredato --
SELECT order_date FROM orders;

-- kundenavn --
SELECT ship_name FROM orders;

-- produktnavn --
SELECT order_details.order_id, products.product_name
FROM order_details
JOIN products
ON order_details.product_id = products.product_id;

-- antall --
SELECT quantity FROM order_details;

-- kombinert --
SELECT order_details.order_id, orders.order_date, products.product_name, orders.ship_name, order_details.quantity
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
JOIN products ON order_details.product_id = products.product_id;

-- kunder solgt mest --
SELECT orders.ship_name, SUM(order_details.quantity) AS quant
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
GROUP BY orders.ship_name
ORDER BY quant DESC;

-- beste kunder --
SELECT orders.ship_name, SUM(order_details.quantity) AS quant
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
GROUP BY orders.ship_name
ORDER BY quant DESC
LIMIT 10;
