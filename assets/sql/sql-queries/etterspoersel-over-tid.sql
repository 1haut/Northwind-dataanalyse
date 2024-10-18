WITH months AS (
    SELECT to_char(date_trunc('month', generate_series(
        (SELECT MIN(order_date) FROM orders), 
        (SELECT MAX(order_date) FROM orders),
        '1 month'::interval
    )), 'yyyy-mm') AS order_month
)
SELECT
    'Geitost' AS prod_name,
    months.order_month,
    COUNT(CASE WHEN products.product_name = 'Geitost' THEN order_details.order_id END) AS number_of_sales
FROM months
LEFT JOIN orders ON to_char(date_trunc('month', orders.order_date), 'yyyy-mm') = months.order_month
LEFT JOIN order_details ON order_details.order_id = orders.order_id
LEFT JOIN products ON order_details.product_id = products.product_id
GROUP BY months.order_month
ORDER BY months.order_month;
