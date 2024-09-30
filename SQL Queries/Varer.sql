-- varenummer --
SELECT product_id 
FROM products

-- beskrivelse --
SELECT product_name, quantity_per_unit 
FROM products

-- pris --
SELECT unit_price 
FROM products

-- lagerbeholdning --
SELECT units_in_stock FROM products

-- kombiner alle data --
SELECT *
FROM products
JOIN suppliers
ON products.supplier_id = suppliers.supplier_id

-- kombiner varenummer, beskrivelser, pris og lagerbeholdning -- 
SELECT products.product_id, products.product_name, products.quantity_per_unit, suppliers.company_name, products.units_in_stock
FROM products
JOIN suppliers
ON products.supplier_id = suppliers.supplier_id