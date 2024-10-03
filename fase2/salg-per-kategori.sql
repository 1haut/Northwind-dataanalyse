-- salg per kategori --
SELECT categories.category_name, COUNT(categories.category_id) AS sales_per_category
FROM products
JOIN order_details ON products.product_id = order_details.product_id
JOIN categories ON products.category_id = categories.category_id
GROUP BY categories.category_id

