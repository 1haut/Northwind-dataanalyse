

-- mest solgte varer && lagerbeholdning--
SELECT products.product_name, COUNT(products.product_id) AS product_sales, products.units_in_stock
FROM order_details
JOIN products
ON order_details.product_id = products.product_id
GROUP BY products.product_id
ORDER BY product_sales DESC;

