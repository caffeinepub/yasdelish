import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";

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
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  type CartProduct = {
    product : Product;
    quantity : Nat;
  };

  module CartProduct {
    public func compare(cartProduct1 : CartProduct, cartProduct2 : CartProduct) : Order.Order {
      Nat.compare(cartProduct1.product.id, cartProduct2.product.id);
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
    public func compare(order1 : BakeryOrder, order2 : BakeryOrder) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  let products = Map.singleton<Nat, Product>(0, {
    id = 0;
    name = "Espresso";
    description = "Strong coffee without milk";
    category = "COFFEE";
    price = 5;
    imageUrl = "espresso.jpg";
  });

  var nextOrderId = 1;
  let orders = Map.empty<Nat, BakeryOrder>();

  func getCartProducts(cartItems : [(Nat, Nat)]) : [CartProduct] {
    cartItems.map(
      func((productId, quantity)) {
        let product = switch (products.get(productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?p) { p };
        };
        {
          product;
          quantity;
        };
      }
    );
  };

  func calculateTotal(cartProducts : [CartProduct]) : Nat {
    cartProducts.foldLeft(0, func(accum, item) { accum + (item.product.price * item.quantity) });
  };

  public query ({ caller }) func getMenu() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func placeOrder(name : Text, notes : Text, address : Text, phone : Text, cartItems : [(Nat, Nat)]) : async Nat {
    let cartProducts = getCartProducts(cartItems);
    let order : BakeryOrder = {
      id = nextOrderId;
      cart = {
        items = cartProducts;
        total = calculateTotal(cartProducts);
      };
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

  public query ({ caller }) func getOrders() : async [BakeryOrder] {
    orders.values().toArray().sort();
  };
};
