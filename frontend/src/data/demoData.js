export const demoRestaurants = [
  {
    _id: "pizza-house",
    name: "Pizza House",
    category: "Italian",
    image: "/images/pizza-house.jpg",
    rating: 4.7,
    deliveryTime: "25–30 min",
    distance: "1.2 km",
    offer: "20% OFF up to ₹120",
    cuisines: "Pizza, Pasta, Italian",
    priceForTwo: "₹500 for two",
    tags: ["Bestseller", "Pure veg"],
    accent: "#fff0e8",
  },
  {
    _id: "burger-point",
    name: "Burger Point",
    category: "Fast Food",
    image: "/images/burger-point.jpg",
    rating: 4.6,
    deliveryTime: "20–25 min",
    distance: "0.8 km",
    offer: "Flat ₹100 OFF",
    cuisines: "Burgers, American, Beverages",
    priceForTwo: "₹350 for two",
    tags: ["Top rated", "Fast delivery"],
    accent: "#fff6dd",
  },
  {
    _id: "food-corner",
    name: "Food Corner",
    category: "North Indian",
    image: "/images/food-corner.jpg",
    rating: 4.5,
    deliveryTime: "30–35 min",
    distance: "2.4 km",
    offer: "10% OFF up to ₹80",
    cuisines: "North Indian, Thalis, Biryani",
    priceForTwo: "₹450 for two",
    tags: ["Family favourite"],
    accent: "#fff0e3",
  },
  {
    _id: "spice-route",
    name: "The Spice Route",
    category: "Indian",
    image: "/images/indian.jpg",
    rating: 4.8,
    deliveryTime: "35–40 min",
    distance: "3.1 km",
    offer: "20% OFF up to ₹150",
    cuisines: "Indian, Tandoor, Desserts",
    priceForTwo: "₹650 for two",
    tags: ["Trending"],
    accent: "#fce9e2",
  },
]

export const demoFoods = {
  "pizza-house": [
    { _id: "pizza-margherita", name: "Classic Margherita", category: "Pizza", description: "Basil, mozzarella and our signature tomato sauce.", price: 249, image: "/images/cheese-pizza.jpg", rating: 4.8, bestseller: true },
    { _id: "pizza-paneer", name: "Paneer Tikka Pizza", category: "Pizza", description: "Smoky paneer, capsicum, onion and spicy tikka sauce.", price: 329, image: "/images/veg-pizza.jpg", rating: 4.7, bestseller: true },
    { _id: "pasta-pesto", name: "Creamy Pesto Pasta", category: "Pasta", description: "Herby basil pesto, parmesan and toasted garlic.", price: 289, image: "/images/paneer-masala.jpg", rating: 4.5 },
  ],
  "burger-point": [
    { _id: "classic-burger", name: "Classic Smash Burger", category: "Burgers", description: "Double smashed patties, cheddar, pickles and house sauce.", price: 219, image: "/images/classic-burger.jpg", rating: 4.8, bestseller: true },
    { _id: "chicken-burger", name: "Crispy Chicken Burger", category: "Burgers", description: "Golden fried chicken, lettuce and creamy pepper mayo.", price: 249, image: "/images/chicken-burger.jpg", rating: 4.7 },
    { _id: "loaded-fries", name: "Loaded Peri Peri Fries", category: "Sides", description: "Crispy fries tossed in peri peri seasoning and cheese.", price: 149, image: "/images/fries.jpg", rating: 4.6 },
  ],
  "food-corner": [
    { _id: "chicken-biryani", name: "Hyderabadi Chicken Biryani", category: "Biryani", description: "Long-grain rice, tender chicken and aromatic spices.", price: 299, image: "/images/biryani.jpg", rating: 4.8, bestseller: true },
    { _id: "paneer-thali", name: "Royal Paneer Thali", category: "Thalis", description: "Paneer curry, dal, seasonal sabzi, breads, rice and dessert.", price: 279, image: "/images/veg-thali.jpg", rating: 4.6 },
    { _id: "masala-dosa", name: "South Indian Masala Dosa", category: "South Indian", description: "Crisp dosa with potato masala, sambar and chutneys.", price: 159, image: "/images/masala-dosa.jpg", rating: 4.5 },
  ],
  "spice-route": [
    { _id: "paneer-tikka", name: "Tandoori Paneer Tikka", category: "Starters", description: "Charred cottage cheese, peppers and mint chutney.", price: 289, image: "/images/paneer-tikka.jpg", rating: 4.7, bestseller: true },
    { _id: "butter-paneer", name: "Paneer Butter Masala", category: "Main course", description: "Silky tomato gravy, butter and soft paneer.", price: 269, image: "/images/paneer-masala.jpg", rating: 4.8 },
    { _id: "veg-biryani", name: "Vegetable Dum Biryani", category: "Biryani", description: "Basmati rice, garden vegetables and saffron.", price: 239, image: "/images/biryani.jpg", rating: 4.5 },
  ],
}

export const demoOrders = [
  { id: "#FH-2048", restaurant: "Burger Point", customer: "Aarav Mehta", items: "2 items", amount: 468, status: "Preparing", time: "2 min ago" },
  { id: "#FH-2047", restaurant: "Burger Point", customer: "Mia Joseph", items: "1 item", amount: 249, status: "Out for delivery", time: "18 min ago" },
  { id: "#FH-2046", restaurant: "Burger Point", customer: "Kabir Shah", items: "3 items", amount: 672, status: "Delivered", time: "42 min ago" },
]

export const categoryOptions = [
  { label: "Pizza", emoji: "🍕", tone: "#fff0e8" },
  { label: "Burgers", emoji: "🍔", tone: "#fff6dd" },
  { label: "Biryani", emoji: "🍛", tone: "#fcebe1" },
  { label: "North Indian", emoji: "🥘", tone: "#eaf5ed" },
  { label: "Desserts", emoji: "🍰", tone: "#f5eafa" },
  { label: "Healthy", emoji: "🥗", tone: "#e5f5f0" },
]