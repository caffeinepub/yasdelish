import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ChefHat,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Twitter,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useMenu } from "./hooks/useQueries";

// ---- Types ----
interface CartItem {
  product: Product;
  quantity: number;
}

// ---- Fallback products ----
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: BigInt(1),
    name: "Signature Caramel Latte",
    description:
      "Rich espresso with velvety steamed milk and house-made caramel drizzle",
    price: BigInt(32900),
    category: "Coffee",
    imageUrl: "/assets/generated/yasdelish-latte.dim_600x600.jpg",
  },
  {
    id: BigInt(2),
    name: "Iced Vanilla Cold Brew",
    description:
      "Smooth cold brew steeped 18 hours, sweetened with vanilla syrup over ice",
    price: BigInt(34900),
    category: "Drinks",
    imageUrl: "/assets/generated/yasdelish-cold-brew.dim_600x600.jpg",
  },
  {
    id: BigInt(3),
    name: "Butter Croissant",
    description:
      "Flaky, golden layers of all-butter pastry — warm and perfectly laminated",
    price: BigInt(19900),
    category: "Breakfast",
    imageUrl: "/assets/generated/yasdelish-croissant.dim_600x600.jpg",
  },
  {
    id: BigInt(4),
    name: "Avocado Toast & Egg",
    description:
      "Toasted sourdough, smashed avocado, poached egg, and chili flakes",
    price: BigInt(42900),
    category: "Breakfast",
    imageUrl: "/assets/generated/yasdelish-avocado-toast.dim_600x600.jpg",
  },
  {
    id: BigInt(5),
    name: "Grilled Chicken Sandwich",
    description:
      "Juicy grilled chicken, lettuce, tomato, and garlic aioli on a brioche bun",
    price: BigInt(44900),
    category: "Meals",
    imageUrl: "/assets/generated/yasdelish-chicken-sandwich.dim_600x600.jpg",
  },
  {
    id: BigInt(6),
    name: "Caesar Salad Wrap",
    description:
      "Crispy romaine, parmesan, croutons, and Caesar dressing in a toasted wrap",
    price: BigInt(37900),
    category: "Meals",
    imageUrl: "/assets/generated/yasdelish-caesar-wrap.dim_600x600.jpg",
  },
  {
    id: BigInt(7),
    name: "Creamy Pasta Alfredo",
    description:
      "Fettuccine in parmesan cream sauce with roasted garlic and garden herbs",
    price: BigInt(52900),
    category: "Meals",
    imageUrl: "/assets/generated/yasdelish-pasta-alfredo.dim_600x600.jpg",
  },
  {
    id: BigInt(8),
    name: "Classic Beef Burger",
    description:
      "House-ground beef patty, aged cheddar, caramelized onions, and hand-cut fries",
    price: BigInt(54900),
    category: "Meals",
    imageUrl: "/assets/generated/yasdelish-beef-burger.dim_600x600.jpg",
  },
  {
    id: BigInt(9),
    name: "Cheese Nachos",
    description:
      "Crispy tortilla chips loaded with melted cheese, jalapeños, sour cream, and salsa",
    price: BigInt(34900),
    category: "Snacks",
    imageUrl: "/assets/generated/yasdelish-nachos.dim_600x600.jpg",
  },
  {
    id: BigInt(10),
    name: "Loaded Fries",
    description:
      "Golden fries topped with cheddar sauce, crispy bacon bits, and green onions",
    price: BigInt(29900),
    category: "Snacks",
    imageUrl: "/assets/generated/yasdelish-loaded-fries.dim_600x600.jpg",
  },
  {
    id: BigInt(11),
    name: "Fresh Mango Juice",
    description:
      "Blended Ataulfo mangoes, lightly sweetened — no added water or preservatives",
    price: BigInt(21900),
    category: "Drinks",
    imageUrl: "/assets/generated/yasdelish-mango-juice.dim_600x600.jpg",
  },
  {
    id: BigInt(12),
    name: "Strawberry Smoothie",
    description:
      "Strawberries, banana, and Greek yogurt — thick, creamy, and satisfying",
    price: BigInt(24900),
    category: "Drinks",
    imageUrl: "/assets/generated/yasdelish-strawberry-smoothie.dim_600x600.jpg",
  },
  {
    id: BigInt(13),
    name: "Iced Matcha Latte",
    description:
      "Ceremonial-grade matcha whisked with oat milk and a touch of honey, over ice",
    price: BigInt(27900),
    category: "Drinks",
    imageUrl: "/assets/generated/yasdelish-matcha-latte.dim_600x600.jpg",
  },
  {
    id: BigInt(14),
    name: "Fudge Brownie",
    description:
      "Dense, gooey chocolate brownie with walnuts and a glossy ganache top",
    price: BigInt(17900),
    category: "Snacks",
    imageUrl: "/assets/generated/yasdelish-brownie.dim_600x600.jpg",
  },
  {
    id: BigInt(15),
    name: "New York Cheesecake",
    description:
      "Classic dense cheesecake on a buttery graham crust, crowned with berry compote",
    price: BigInt(22900),
    category: "Snacks",
    imageUrl: "/assets/generated/yasdelish-cheesecake.dim_600x600.jpg",
  },
  // Pizzas
  {
    id: BigInt(16),
    name: "Margherita Pizza",
    description:
      "Hand-stretched base, San Marzano tomato sauce, fresh mozzarella, and garden basil",
    price: BigInt(44900),
    category: "Pizza",
    imageUrl: "/assets/generated/yasdelish-margherita-pizza.dim_600x600.jpg",
  },
  {
    id: BigInt(17),
    name: "Pepperoni Feast",
    description:
      "Classic tomato base loaded with spiced pepperoni slices and bubbling mozzarella",
    price: BigInt(54900),
    category: "Pizza",
    imageUrl: "/assets/generated/yasdelish-pepperoni-pizza.dim_600x600.jpg",
  },
  {
    id: BigInt(18),
    name: "Paneer Tikka Pizza",
    description:
      "Tandoori-spiced paneer, bell peppers, onions, and mint chutney base on a crispy crust",
    price: BigInt(52900),
    category: "Pizza",
    imageUrl: "/assets/generated/yasdelish-paneer-pizza.dim_600x600.jpg",
  },
  {
    id: BigInt(19),
    name: "BBQ Chicken Pizza",
    description:
      "Smoky BBQ sauce, grilled chicken, red onion, and jalapeños with a golden cheese pull",
    price: BigInt(59900),
    category: "Pizza",
    imageUrl: "/assets/generated/yasdelish-bbq-chicken-pizza.dim_600x600.jpg",
  },
  // Burgers
  {
    id: BigInt(20),
    name: "Double Smash Burger",
    description:
      "Two smashed beef patties, American cheese, pickles, caramelized onions, and special sauce",
    price: BigInt(59900),
    category: "Burgers",
    imageUrl: "/assets/generated/yasdelish-smash-burger.dim_600x600.jpg",
  },
  {
    id: BigInt(21),
    name: "Crispy Chicken Burger",
    description:
      "Southern-style fried chicken thigh, coleslaw, pickles, and sriracha mayo on a toasted bun",
    price: BigInt(49900),
    category: "Burgers",
    imageUrl:
      "/assets/generated/yasdelish-crispy-chicken-burger.dim_600x600.jpg",
  },
  {
    id: BigInt(22),
    name: "Mushroom Swiss Burger",
    description:
      "Beef patty, sautéed mushrooms, Swiss cheese, and Dijon mustard on a pretzel bun",
    price: BigInt(54900),
    category: "Burgers",
    imageUrl: "/assets/generated/yasdelish-mushroom-burger.dim_600x600.jpg",
  },
  // Pastas
  {
    id: BigInt(23),
    name: "Penne Arrabbiata",
    description:
      "Penne in a fiery tomato-garlic sauce with fresh basil and a generous parmesan finish",
    price: BigInt(44900),
    category: "Pasta",
    imageUrl: "/assets/generated/yasdelish-penne-arrabbiata.dim_600x600.jpg",
  },
  {
    id: BigInt(24),
    name: "Spaghetti Bolognese",
    description:
      "Slow-cooked beef and tomato ragù over spaghetti, topped with aged parmesan",
    price: BigInt(52900),
    category: "Pasta",
    imageUrl: "/assets/generated/yasdelish-spaghetti-bolognese.dim_600x600.jpg",
  },
  {
    id: BigInt(25),
    name: "Mac & Cheese",
    description:
      "Three-cheese macaroni — cheddar, gruyère, and mozzarella — baked with a crispy breadcrumb crust",
    price: BigInt(39900),
    category: "Pasta",
    imageUrl: "/assets/generated/yasdelish-mac-cheese.dim_600x600.jpg",
  },
];

const CATEGORY_IMAGES: Record<string, string> = {
  Coffee: "/assets/generated/yasdelish-latte.dim_600x600.jpg",
  Drinks: "/assets/generated/yasdelish-latte.dim_600x600.jpg",
  Breakfast: "/assets/generated/yasdelish-croissant.dim_600x600.jpg",
  Meals: "/assets/generated/yasdelish-brunch.dim_600x600.jpg",
  Lunch: "/assets/generated/yasdelish-brunch.dim_600x600.jpg",
  Dinner: "/assets/generated/yasdelish-brunch.dim_600x600.jpg",
  Snacks: "/assets/generated/yasdelish-brownie.dim_600x600.jpg",
  Treats: "/assets/generated/yasdelish-brownie.dim_600x600.jpg",
  Pizza: "/assets/generated/yasdelish-pizza.dim_600x600.jpg",
  Burger: "/assets/generated/yasdelish-burger.dim_600x600.jpg",
  Burgers: "/assets/generated/yasdelish-burger.dim_600x600.jpg",
  Pasta: "/assets/generated/yasdelish-pasta.dim_600x600.jpg",
};

const MENU_CATEGORIES = [
  "All",
  "Breakfast",
  "Meals",
  "Pizza",
  "Burgers",
  "Pasta",
  "Snacks",
  "Drinks",
];

function formatPrice(price: bigint) {
  return `₹${Math.round(Number(price) / 100)}`;
}

function getProductImage(p: Product): string {
  if (p.imageUrl?.startsWith("/")) return p.imageUrl;
  return (
    CATEGORY_IMAGES[p.category] ||
    "/assets/generated/yasdelish-latte.dim_600x600.jpg"
  );
}

// ---- Checkout Modal ----
function CheckoutModal({
  open,
  onClose,
  cart,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onSuccess: () => void;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const cartItems: [bigint, bigint][] = cart.map((item) => [
        item.product.id,
        BigInt(item.quantity),
      ]);
      if (actor) {
        await actor.placeOrder(
          form.name,
          form.notes,
          form.address,
          form.phone,
          cartItems,
        );
      }
      toast.success("Order confirmed! It's on its way to you. 🎉");
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="checkout.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Complete Your Order
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-secondary rounded-xl p-4 space-y-1.5">
            {cart.map((item) => (
              <div
                key={String(item.product.id)}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {formatPrice(
                    BigInt(Number(item.product.price) * item.quantity),
                  )}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(BigInt(subtotal))}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-name">Full Name *</Label>
            <Input
              id="checkout-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              data-ocid="checkout.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-address">Delivery Address *</Label>
            <Input
              id="checkout-address"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Street, City, Zip"
              data-ocid="checkout.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-phone">Phone Number *</Label>
            <Input
              id="checkout-phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+91 98765 43210"
              data-ocid="checkout.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="checkout-notes">Order Notes</Label>
            <Textarea
              id="checkout-notes"
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Allergies, special requests..."
              rows={2}
              data-ocid="checkout.textarea"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="checkout.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground rounded-full px-6"
              data-ocid="checkout.submit_button"
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Bag Sidebar ----
function BagSidebar({
  open,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: bigint, qty: number) => void;
  onRemove: (id: bigint) => void;
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-card shadow-warm z-50 flex flex-col"
              data-ocid="bag.sheet"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="font-display text-xl font-bold">Your Bag</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition"
                  data-ocid="bag.close_button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3"
                    data-ocid="bag.empty_state"
                  >
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                    <p className="font-medium text-muted-foreground">
                      Your bag is empty
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pick something from the menu to get started.
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={String(item.product.id)}
                      className="flex gap-3"
                      data-ocid={`bag.item.${idx + 1}`}
                    >
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-primary font-bold text-sm">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQty(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition"
                            data-ocid={`bag.toggle.${idx + 1}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQty(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition"
                            data-ocid={`bag.toggle.${idx + 1}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(item.product.id)}
                            className="ml-auto p-1 text-muted-foreground hover:text-destructive transition"
                            data-ocid={`bag.delete_button.${idx + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="px-6 py-5 border-t border-border space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Subtotal</span>
                    <span className="text-primary">
                      {formatPrice(BigInt(subtotal))}
                    </span>
                  </div>
                  <Button
                    type="button"
                    className="w-full rounded-full bg-primary text-primary-foreground py-6 text-base font-bold hover:opacity-90 transition"
                    onClick={() => setCheckoutOpen(true)}
                    data-ocid="bag.primary_button"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onSuccess={() => {
          for (const item of cart) onRemove(item.product.id);
          onClose();
        }}
      />
    </>
  );
}

// ---- Featured Card (grid card with hover zoom) ----
function FeaturedCard({
  product,
  onAddToBag,
  index,
}: { product: Product; onAddToBag: (p: Product) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-xs hover:shadow-warm transition-all duration-300 flex flex-col"
      data-ocid={`featured.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-base leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 flex-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-primary text-lg">
            {formatPrice(product.price)}
          </span>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAddToBag(product)}
            className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-4 py-2 hover:opacity-90 transition"
            data-ocid="featured.primary_button"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Menu Item Row ----
function MenuItemCard({
  product,
  onAddToBag,
  idx,
}: { product: Product; onAddToBag: (p: Product) => void; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-warm hover:-translate-y-0.5 transition-all duration-200"
      data-ocid={`menu.item.${idx + 1}`}
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold">{product.name}</h4>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAddToBag(product)}
            className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 hover:opacity-90 transition"
            data-ocid="menu.primary_button"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main App ----
export default function App() {
  const [bagOpen, setBagOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const menuRef = useRef<HTMLElement>(null);

  const { data: rawMenu = FALLBACK_PRODUCTS } = useMenu();

  // Normalize categories: map Lunch/Dinner → Meals, Burger → Burgers
  const menuItems: Product[] = rawMenu.map((p) => {
    if (p.category === "Lunch" || p.category === "Dinner") {
      return { ...p, category: "Meals" };
    }
    if (p.category === "Burger") {
      return { ...p, category: "Burgers" };
    }
    return p;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItems = menuItems.slice(0, 6);

  function addToBag(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to your bag!`);
  }

  function updateQty(id: bigint, qty: number) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)),
    );
  }

  function removeFromCart(id: bigint) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function scrollToMenu() {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" />

      {/* Top Banner */}
      <div className="bg-foreground text-primary-foreground text-center py-2.5 text-xs tracking-widest font-semibold">
        Skip the queue. Order online, enjoy at home. 🍽️
      </div>

      {/* Sticky Nav */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="font-display font-black text-2xl tracking-widest text-foreground"
            data-ocid="nav.link"
          >
            YASDELISH
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "HOME", href: "/" },
              { label: "MENU", href: "#menu" },
              { label: "ABOUT", href: "#why-us" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold tracking-wider text-foreground/70 hover:text-primary transition"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            className="relative flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition"
            data-ocid="nav.open_modal_button"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
                {cartCount}
              </Badge>
            )}
            <span className="hidden sm:inline text-sm font-semibold">BAG</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        <img
          src="/assets/generated/yasdelish-hero.dim_1600x900.jpg"
          alt="YASDELISH cafe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white text-xs font-semibold tracking-widest uppercase">
              Online-Only · No Dine-In
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5"
          >
            Your Next Meal Is
            <br />
            One Tap Away
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-white/85 text-lg mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Hot food and cold drinks, available from morning through midnight —
            just tell us where to send it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToMenu}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-bold tracking-wide px-8 py-4 text-base shadow-warm hover:opacity-90 transition"
              data-ocid="hero.primary_button"
            >
              Place Your Order <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Offer Banner */}
      <div className="bg-primary text-primary-foreground text-center py-3 px-4">
        <p className="text-sm font-semibold tracking-wide">
          🎉 First order? Use code{" "}
          <span className="font-black bg-white/20 rounded px-1.5 py-0.5">
            WELCOME15
          </span>{" "}
          for 15% off your total.
        </p>
      </div>

      {/* Featured Items Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-wide">
              On Everyone's List
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Crowd-pleasing picks — the ones people order again and again.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredItems.map((product, index) => (
              <FeaturedCard
                key={String(product.id)}
                product={product}
                onAddToBag={addToBag}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full Menu Section with Category Nav */}
      <section ref={menuRef} id="menu" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-wide">
                Browse the Full Menu
              </h2>
              <p className="text-muted-foreground mt-2">
                Everything we serve, all in one place.
              </p>
            </div>
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-full"
              data-ocid="menu.search_input"
            />
          </motion.div>

          {/* Category Pills */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {MENU_CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold border transition-all duration-200 flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-ocid="menu.tab"
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Menu Grid */}
          {filteredItems.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="menu.empty_state"
            >
              <p className="text-lg font-semibold">Nothing here yet</p>
              <p className="text-sm mt-1">
                Try a different category or clear the search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((product, idx) => (
                <MenuItemCard
                  key={String(product.id)}
                  product={product}
                  onAddToBag={addToBag}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-wide">
              What Sets Us Apart
            </h2>
            <p className="text-muted-foreground mt-3">
              Four reasons people keep coming back.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-7 h-7" />,
                title: "Ready When You Are",
                desc: "Morning coffee or a midnight snack, the menu stays open. Order on your schedule.",
              },
              {
                icon: <ChefHat className="w-7 h-7" />,
                title: "Made to Order",
                desc: "Nothing sits under a lamp waiting. Every item is prepared after you confirm.",
              },
              {
                icon: <MapPin className="w-7 h-7" />,
                title: "Straight to Your Door",
                desc: "No parking, no queues. Your order travels from our kitchen directly to you.",
              },
              {
                icon: <Star className="w-7 h-7" />,
                title: "Consistency You Can Count On",
                desc: "Same recipe, same quality, every single time. No off days.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="flex flex-col items-center text-center p-7 rounded-2xl bg-card border border-border hover:shadow-warm hover:-translate-y-1 transition-all duration-300"
                data-ocid="whyus.card"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                stat: "4.9★",
                label: "Average Rating",
                sub: "Based on 2,400+ reviews",
              },
              {
                stat: "15,000+",
                label: "Orders Placed",
                sub: "And counting, every week",
              },
              {
                stat: "100%",
                label: "Freshly Prepared",
                sub: "No pre-made shortcuts",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="flex flex-col items-center"
                data-ocid="trust.card"
              >
                <span className="font-display font-black text-4xl text-primary">
                  {item.stat}
                </span>
                <span className="font-bold text-base mt-1">{item.label}</span>
                <span className="text-sm text-muted-foreground mt-0.5">
                  {item.sub}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coffee-footer text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display font-black text-2xl tracking-widest mb-3">
              YASDELISH
            </h3>
            <p className="text-sm" style={{ color: "oklch(0.72 0.02 70)" }}>
              Great food, no commute. We operate exclusively online so every
              order gets our full attention.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-1">
              Quick Links
            </h4>
            {[
              { label: "Menu", href: "#menu" },
              { label: "Why Choose Us", href: "#why-us" },
              { label: "Contact", href: "mailto:hello@yasdelish.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm hover:text-primary transition"
                style={{ color: "oklch(0.72 0.02 70)" }}
                data-ocid="footer.link"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-sm mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {[
                {
                  icon: <Instagram className="w-5 h-5" />,
                  label: "Instagram",
                  href: "https://instagram.com",
                },
                {
                  icon: <Twitter className="w-5 h-5" />,
                  label: "Twitter",
                  href: "https://twitter.com",
                },
                {
                  icon: <Facebook className="w-5 h-5" />,
                  label: "Facebook",
                  href: "https://facebook.com",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition"
                  style={{ color: "oklch(0.72 0.02 70)" }}
                  data-ocid="footer.link"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          className="border-t px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{
            borderColor: "oklch(0.28 0.03 45)",
            color: "oklch(0.55 0.02 60)",
          }}
        >
          <span>
            © {new Date().getFullYear()} YASDELISH — great food, no commute.
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </footer>

      {/* Bag Sidebar */}
      <BagSidebar
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
      />

      {/* Floating Order Now FAB */}
      <AnimatePresence>
        {cartCount === 0 && !bagOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToMenu}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-full px-5 py-3.5 shadow-warm animate-pulse-soft"
            data-ocid="fab.primary_button"
            aria-label="Order Now"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm">Order Now</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
