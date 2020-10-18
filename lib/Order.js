class Order {

    id;
    quantity;
    price;
    executedQuantity;
    isBuyOrder;

    constructor(obj) {
        this.id = this.uuidv4();
        this.executedQuantity = 0;
        obj && Object.assign(this, obj);
    }

    // Todo: verify uniqueness as Math.random is not guaranteeing to be a high-quality RNG
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    isAvailable(){
        return this.quantity - this.executedQuantity > 0;
    }

    quantityAvailable(){
        return this.quantity - this.executedQuantity;
    }

    executedOrders = []
}
exports.Order = Order;
