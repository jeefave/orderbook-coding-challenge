const fs = require('fs');

class OrderBook {

    orders = [];

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    static load(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, data) => {
                if (err) { reject(err); return; }
                resolve(new OrderBook(JSON.parse(data)));
            });
        });
    }

    static save(filename, orderBook) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filename, JSON.stringify(orderBook, null, 2), (err) => {
                if (err) { reject(err); return; }
                resolve();
            });
        });
    }

    getQuantityAtPrice(price) {
        return this.orders
        .filter(p => !p.isBuyOrder && p.price == price && p.isAvailable())
        .map(p => p.quantityAvailable())
        .reduce((a, b) => a + b, 0);
    }

    trade(order) {
        this.orders.push(order);

        // todo: revise O(n2): BST, 2sum. maybe 2 arrays
        let buys = this.orders
            .filter(p => p.isBuyOrder && p.quantityAvailable() > 0).sort((a, b) => b - a);
        let sells = this.orders
            .filter(p => !p.isBuyOrder && p.quantityAvailable() > 0).sort((a, b) => a - b);
 
        sells.forEach(sell => {
            buys.forEach(buy => {
                if(sell.price <= buy.price) {
                    const buyQuantity = buy.quantityAvailable();
                    const sellQuantity = sell.quantityAvailable();
                    var amount = buyQuantity - sellQuantity;
                    if(buyQuantity > 0 && sellQuantity > 0) {
                        if(amount > 0) {
                            buy.executedQuantity += sellQuantity;
                            sell.executedQuantity = sell.quantity;
                        } else if(amount < 0) {
                            buy.executedQuantity += buyQuantity;
                            sell.executedQuantity = buy.quantity;
                        } else {
                            sell.executedQuantity = sell.quantity;
                            buy.executedQuantity = buy.quantity;
                        }
                    }
                }
            })
        });
    }
}

exports.OrderBook = OrderBook;
