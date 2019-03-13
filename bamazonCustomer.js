
var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,


    user: 'root',

    // Your password
    password: '',
    database: 'Bamazon'
});

function displayProducts() {
    // console.log('___ENTER displayInventory___');

    // Construct the db query string
    queryStr = 'SELECT * FROM  products WHERE item_id <= 10';

    // Make the db query
    connection.query(queryStr, function (err, data) {
        if (err) throw err;
        console.log('...................\n');
        console.log('WHATS IN STOCK!');
        console.log('...................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut='';
            strOut += 'ID: ' + data[i].item_id + ' // ';
            strOut += 'Product Name: ' + data[i].product_name + '// ';
            strOut += 'Department: ' + data[i].department_name + '// ';
            strOut += 'Price: $' + data[i].price + '// ';
            strOut += 'Stock: ' + data[i].stock_quantity +"\n";

            console.log(strOut);
        }

        console.log("---------------------------------------------------------------------\n");

        userInput();
    })
};

function userInput() {
    inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			filter: Number
		}
	]).then(function(input) {
        var item = input.item_id;
        var quantity = input.quantity;

        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {item_id: item}, function(err, data) {
            if (err) throw err;

            var productData = data[0];
            if (quantity <= productData.stock_quantity) {
                console.log("Item in Stock! Purchase going through....")

                var newQuery = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                connection.query(newQuery, function(err, data) {
                    if (err) throw err;

                    console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                    console.log("Thank you for shopping with us! Come again soon (:");
                    console.log("\n------------------------------------\n")

                    connection.end();
                });
            }

            else {
                console.log("I'm sorry. Your order is currently out of stock. Please modify your order");
                console.log("\n------------------------------------\n");
                displayProducts();
            }
        });
    });
};

displayProducts();