SELECT 
	suppliers.supplier_id, 
	suppliers.company_name,  
	ROUND(
	SUM(order_details.unit_price * order_details.quantity * (1 - order_details.discount))
	) 
	AS total_sales
FROM products
JOIN suppliers ON products.supplier_id = suppliers.supplier_id
JOIN order_details ON products.product_id = order_details.product_id
GROUP BY suppliers.supplier_id
ORDER BY total_sales DESC;
