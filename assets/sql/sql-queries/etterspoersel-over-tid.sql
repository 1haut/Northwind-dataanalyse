WITH months AS (
    SELECT to_char(date_trunc('month', generate_series(
        (SELECT MIN(order_date) FROM orders), 
        (SELECT MAX(order_date) FROM orders),
        '1 month'::interval
    )), 'yyyy-mm') AS order_month
)
SELECT
    'Geitost' AS prod_name, -- Manually specify the product name to avoid NULLs
    m.order_month,
    COUNT(CASE WHEN p.product_name = 'Geitost' THEN od.order_id END) AS number_of_sales -- Count only for Geitost
FROM months m
LEFT JOIN orders o ON to_char(date_trunc('month', o.order_date), 'yyyy-mm') = m.order_month
LEFT JOIN order_details od ON od.order_id = o.order_id
LEFT JOIN products p ON od.product_id = p.product_id
GROUP BY m.order_month
ORDER BY m.order_month;
