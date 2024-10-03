-- kombiner varenummer, beskrivelser, pris og lagerbeholdning -- 
SELECT products.product_id, 
	products.product_name, 
	products.quantity_per_unit, 
	suppliers.company_name AS supplier_name,
	suppliers.country,
	products.units_in_stock
FROM products
JOIN suppliers
ON products.supplier_id = suppliers.supplier_id;