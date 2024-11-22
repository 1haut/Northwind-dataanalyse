// Render Line Chart
function renderLineChart() {
    $.getJSON('/api/line-chart', function (data) {
        const labels = data.map(item => item.month);
        const salesData = data.map(item => item.sales_count);

        const gradientFill = $('#lineChart')[0].getContext("2d")
            .createLinearGradient(0, 250, 0, 32);
        gradientFill.addColorStop(1, 'rgb(173, 216, 230)');
        gradientFill.addColorStop(0, 'rgb(255,255,255)');

        new Chart($('#lineChart')[0], {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Sales',
                    data: salesData,
                    borderColor: 'rgb(173, 216, 230)',
                    fill: {
                        target: 'origin',
                        above: gradientFill
                    },
                    tension: 0.1
                }]
            },
            options: {
                animation: {
                    easing: "easeInOutExpo"
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

// Render Bar Chart
function renderBarChart() {
    $.getJSON('/api/bar-chart', function (data) {
        const labels = data.map(item => item.full_name);
        const orderData = data.map(item => item.number_of_sales);

        new Chart($('#barChart')[0], {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Orders',
                    data: orderData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    });
}

// Render Pie Chart
function renderPieChart() {
    $.getJSON('/api/pie-chart', function (data) {
        const labels = data.map(item => item.category_name);
        const productData = data.map(item => item.sales_per_category);

        new Chart($('#pieChart')[0], {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Orders',
                    data: productData,
                    backgroundColor: [
                        'rgb(244, 122, 31)',
                        'rgb(253, 187, 47)',
                        'rgb(55, 123, 43)',
                        'rgb(122, 193, 66)',
                        'rgb(0, 124, 195)',
                        'rgb(0, 82, 155)',
                        'rgb(138, 43, 226)',
                        'rgb(227, 38, 54)'
                    ]
                }]
            }
        });
    });
}

// Render Combo Chart
function renderComboChart() {
    $.getJSON('/api/combo-chart', function (data) {
        const newLabels = data.map(item => item.product_name);
        const lineData = data.map(item => item.product_sales);
        const barData = data.map(item => item.units_in_stock);

        new Chart($('#comboBarLine')[0], {
            type: 'bar',
            data: {
                labels: newLabels,
                datasets: [
                    {
                        label: 'Units (Bar)',
                        data: barData,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        type: 'bar'
                    },
                    {
                        label: 'Sales (Line)',
                        data: lineData,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        type: 'line',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

// Render Orders
function renderOrders() {
    $.getJSON('/api/orders-num', function (ordersCount) {
        $('.card-value').text(ordersCount);
    });
}

// Render Revenue
function renderRevenue() {
    $.getJSON('/api/revenue', function (revenueUSD) {
        $('.revenue-card .card-value').text('$ ' + revenueUSD);
    });
}

// Render Customers
function renderCustomers() {
    $.getJSON('/api/customers', function (customers) {
        $('.customers-card .card-value').text(customers);
    });
}

function dataTable1() {
    const $tableForm = $('#table-picker')
    let displayTable = $('#table-picker :selected').val() // Default table shown

    console.log(displayTable)

    const titleCase = (s) =>
        s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())

    $tableForm.on('change', function () {
        // Clears the table
        $('#example').DataTable().destroy();
        $('#example').empty();

        displayTable = $('#table-picker :selected').val()
        console.log(displayTable)
        $.ajax({
            url: `/${displayTable}`,
            method: 'GET',
            success: function (data) {
                if (data.length > 0 && displayTable.length > 0) {
                    const columns = Object.keys(data[0]).map(key => ({
                        title: titleCase(key),
                        data: key
                    }));


                    // Action buttons (Edit/Delete)
                    if (displayTable !== 'orders' && columns[columns.length - 1].title !== 'Actions') {
                        columns.push({
                            title: 'Actions',
                            data: null,
                            defaultContent: `
                  <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                `,
                            orderable: false
                        });
                    }

                    // Initialize DataTable
                    $('#example').DataTable({
                        data: data,
                        columns: columns
                    });

                    const allData = $('#example').DataTable().rows().data()
                    const firstRow = $('#example').DataTable().row().data()


                    // Populate form data
                    const $form = $('.modal-form');
                    if ($form.children().length > 0) {
                        $('.modal-body .mb-3').remove();
                    }

                    const $container = $('<div>', { class: 'mb-3' }).appendTo($form);
                    for (let i = 0; i < Object.keys(firstRow).length; i++) {
                        const column = Object.keys(firstRow)[i]
                        $container.append(`<label for="${column}" class="form-label">${titleCase(column)} </label>`);
                        $container.append(`<input type="text" class="form-control" id="${column}" name="${column}" placeholder="${titleCase(column)}">`);
                    }


                    // Handle Delete button click
                    $('#example tbody').on('click', '.delete-btn', function () {
                        const rowData = $('#example').DataTable().row($(this).parents('tr')).data();
                        let rowId

                        if (displayTable === 'customers') {
                            for (let i = 0; i < allData.length; i++) {
                                if (allData[i].customer_id == rowData.customer_id) {
                                    console.log(i + 1, rowData.customer_id, displayTable)
                                    rowId = i + 1
                                }
                            }
                        }

                        if (confirm('Are you sure you want to delete this record?')) {
                            $.ajax({
                                url: `/${displayTable}/${rowData.order_id || rowData.product_id || rowData.employee_id || rowId}`,
                                method: 'DELETE',
                                success: function (response) {
                                    alert('Record deleted successfully.');
                                    location.reload()
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error deleting record:', error);
                                    alert('Failed to delete the record. Please try again.');
                                }
                            });
                        }
                    });


                    // Handle Edit button click
                    $('#example tbody').on('click', '.edit-btn', function () {
                        const rowData = $('#example').DataTable().row($(this).parents('tr')).data();
                        $form.attr('method', '')
                        for (let i = 0; i < Object.keys(rowData).length; i++) {
                            const objKey = Object.keys(rowData)[i]
                            const objVal = Object.values(rowData)[i]
                            $(`.modal-body #${objKey}`).val(objVal)
                        }
                        $('#exampleModal').modal('show');
                        console.log('Edit clicked for:', rowData);
                    })

                    // Handle New button click
                    $('.new-btn').on('click', function () {
                        $form.attr('method', 'post')
                        for (let i = 0; i < Object.keys(firstRow).length; i++) {
                            const objKey = Object.keys(firstRow)[i]
                            $(`.modal-body #${objKey}`).val('')
                        }
                    })
                } else {
                    console.warn('No data available to populate the table.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Failed to fetch data:', error);
            }
        });
    })
}

function postClick() {
    $(document).ready(function () {
        $('#saveChangesBtn').on('click', function () {
            const displayTable = $('#table-picker :selected').val()
            const allData = $('#example').DataTable().rows().data()
            let rowId
            // Collect form data
            const formData = {};
            $('.modal-form input').each(function () {
                formData[$(this).attr('name')] = $(this).val();
            });



            if (displayTable === 'customers') {
                for (let i = 0; i < allData.length; i++) {
                    if (allData[i].customer_id == formData.customer_id) {
                        console.log(i + 1, formData.customer_id, displayTable)
                        rowId = i
                    }
                }
            }

            const method = $('.modal-form').attr('method') === 'post' ? 'POST' : 'PATCH';
            const url = method === 'POST' ? `/${displayTable}` : `/${displayTable}/${formData.order_id || formData.product_id || formData.employee_id || rowId}`;
            console.log(method, url, formData)

            // Send HTTP request
            $.ajax({
                url: url,
                method: method,
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function (response) {
                    alert('Success.');
                    location.reload()
                },
                error: function (xhr, status, error) {
                    console.error('Error saving changes:', error);
                    alert('Failed to save changes. Please try again.');
                }
            });
        });
    });
}

function initPopover() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

// Call the functions
document.addEventListener("DOMContentLoaded", () => {
    renderLineChart();
    renderBarChart();
    renderPieChart();
    renderComboChart();
    renderOrders();
    renderRevenue();
    renderCustomers();
    dataTable1();
    postClick();
    initPopover();
});
