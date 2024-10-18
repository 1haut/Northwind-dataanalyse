-- ansatt solgt mest --
SELECT employees.title_of_courtesy, employees.first_name, employees.last_name, COUNT(employees.employee_id) AS number_of_sales
FROM orders
JOIN employees
ON orders.employee_id = employees.employee_id
GROUP BY employees.employee_id
ORDER BY number_of_sales DESC;
