import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cart {
    total: bigint;
    items: Array<CartProduct>;
}
export interface CartProduct {
    quantity: bigint;
    product: Product;
}
export interface BakeryOrder {
    id: bigint;
    customerName: string;
    status: string;
    cart: Cart;
    address: string;
    notes: string;
    phone: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface backendInterface {
    getMenu(): Promise<Array<Product>>;
    getOrders(): Promise<Array<BakeryOrder>>;
    placeOrder(name: string, notes: string, address: string, phone: string, cartItems: Array<[bigint, bigint]>): Promise<bigint>;
}
