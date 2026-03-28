import Map "mo:core/Map";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    imageUrl : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  type CartProduct = {
    product : Product;
    quantity : Nat;
  };

  module CartProduct {
    public func compare(c1 : CartProduct, c2 : CartProduct) : Order.Order {
      Nat.compare(c1.product.id, c2.product.id);
    };
  };

  type Cart = {
    items : [CartProduct];
    total : Nat;
  };

  type BakeryOrder = {
    id : Nat;
    cart : Cart;
    customerName : Text;
    notes : Text;
    address : Text;
    phone : Text;
    status : Text;
  };

  module BakeryOrder {
    public func compare(o1 : BakeryOrder, o2 : BakeryOrder) : Order.Order {
      Nat.compare(o1.id, o2.id);
    };
  };

  // Keep products stable var for backward compatibility
  let products = Map.empty<Nat, Product>();

  var nextOrderId = 1;
  let orders = Map.empty<Nat, BakeryOrder>();

  public shared func placeOrder(
    name : Text,
    notes : Text,
    address : Text,
    phone : Text,
    cartItems : [(Nat, Nat)]
  ) : async Nat {
    // Build cart items using a placeholder product when not found in DB
    let cartProducts : [CartProduct] = cartItems.map(
      func((productId, quantity)) : CartProduct {
        let product : Product = switch (products.get(productId)) {
          case (?p) { p };
          case null {
            {
              id = productId;
              name = "Item #" # productId.toText();
              description = "";
              category = "";
              price = 0;
              imageUrl = "";
            }
          };
        };
        { product; quantity };
      }
    );
    let total = cartProducts.foldLeft(
      0,
      func(acc : Nat, item : CartProduct) : Nat {
        acc + item.product.price * item.quantity
      }
    );
    let order : BakeryOrder = {
      id = nextOrderId;
      cart = { items = cartProducts; total };
      customerName = name;
      notes;
      address;
      phone;
      status = "Received";
    };
    orders.add(nextOrderId, order);
    let orderId = nextOrderId;
    nextOrderId += 1;
    orderId;
  };

  public query func getOrders() : async [BakeryOrder] {
    orders.values().toArray().sort();
  };
};
