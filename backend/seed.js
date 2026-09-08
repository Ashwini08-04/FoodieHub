const bcrypt = require("bcrypt")
const { sequelize, User, Restaurant, Food } = require("./models")
require("dotenv").config()

// Restaurant data
const restaurantsData = [
  ["Bukhara", "North Indian", "/images/bukhara.jpg", 4.9, "35–45 min", "2.4 km", "20% OFF up to ₹200", "ITC Maurya, New Delhi"],
  ["Karavalli", "South Indian", "/images/karavalli.jpg", 4.8, "30–40 min", "3.1 km", "15% OFF up to ₹150", "The Gateway Hotel, Bengaluru"],
  ["Indian Accent", "Modern Indian", "/images/indian-accent.jpg", 4.8, "35–45 min", "4.2 km", "10% OFF up to ₹250", "The Lodhi, New Delhi"],
  ["Paradise", "Biryani", "/images/paradise.jpg", 4.7, "25–35 min", "2.7 km", "20% OFF up to ₹150", "Paradise Circle, Hyderabad"],
  ["Americano", "Italian", "/images/americano.jpg", 4.6, "25–35 min", "1.9 km", "15% OFF", "Fort, Mumbai"],
  ["Baoshuan", "Chinese", "/images/baoshuan.jpg", 4.7, "30–40 min", "3.6 km", "20% OFF up to ₹200", "The Oberoi, New Delhi"],
  ["Izumi", "Japanese", "/images/izumi.jpg", 4.7, "30–40 min", "4.5 km", "10% OFF", "Assagao, Goa"],
  ["Seefah", "Thai", "/images/seefah.jpg", 4.6, "25–35 min", "2.8 km", "15% OFF up to ₹120", "Bandra West, Mumbai"],
  ["Daryaganj", "Mughlai", "/images/daryaganj.jpg", 4.6, "25–35 min", "2.2 km", "20% OFF up to ₹150", "Connaught Place, New Delhi"],
  ["Barbeque Nation", "Barbeque", "/images/barbeque-nation.jpg", 4.5, "35–45 min", "3.8 km", "Flat ₹200 OFF", "Indiranagar, Bengaluru"],
  ["Biryani By Kilo", "Biryani", "/images/biryani-by-kilo.jpg", 4.7, "30–40 min", "2.9 km", "25% OFF", "Hitech City, Hyderabad"],
  ["Theobroma", "Desserts", "/images/theobroma.jpg", 4.7, "20–30 min", "1.7 km", "Buy 2 Get 1", "Koramangala, Bengaluru"],
  ["Domino's Pizza", "Pizza", "/images/dominos.jpg", 4.5, "20–30 min", "1.1 km", "40% OFF up to ₹150", "MG Road, Pune"],
  ["Burger King", "Burgers", "/images/burger-king.jpg", 4.4, "20–25 min", "0.9 km", "Flat ₹100 OFF", "Phoenix Marketcity, Mumbai"],
  ["WOW! Momo", "Street Food", "/images/wow-momo.jpg", 4.5, "20–30 min", "1.5 km", "20% OFF up to ₹100", "Salt Lake, Kolkata"],
  ["SRV", "Indian", "/images/srv.jpg", 4.6, "25–35 min", "2.0 km", "20% OFF up to ₹150", "FC Road, Pune"]
]

const makeFoods = (items) =>
  items.map(([name, category, price, image, description], index) => ({
    name,
    category,
    price,
    image,
    description,
    rating: Number((4.3 + (index % 7) * 0.1).toFixed(1)),
    isAvailable: true
  }))

// Food menu data
const foodData = {
  "Bukhara": makeFoods([
    ["Dal Bukhara", "veg", 450, "/images/foods/bukhara/dal-bukhara.jpg", "Slow-cooked black lentils with butter and cream."],
    ["Sikandari Raan", "non-veg", 850, "/images/foods/bukhara/sikandari-raan.jpg", "Tender roasted lamb with aromatic spices."],
    ["Murgh Malai Kebab", "non-veg", 520, "/images/foods/bukhara/murgh-malai-kebab.jpg", "Creamy chicken kebabs grilled in tandoor."],
    ["Paneer Tikka", "veg", 390, "/images/foods/bukhara/paneer-tikka.jpg", "Char-grilled paneer with Indian spices."],
    ["Tandoori Jhinga", "non-veg", 620, "/images/foods/bukhara/tandoori-jhinga.jpg", "Juicy prawns roasted in traditional tandoor."],
    ["Tandoori Roti", "veg", 55, "/images/foods/bukhara/tandoori-roti.jpg", "Traditional clay-oven roasted flatbread."],
    ["Butter Naan", "veg", 85, "/images/foods/bukhara/butter-naan.jpg", "Soft naan brushed with melted butter."],
    ["Seekh Kebab", "non-veg", 480, "/images/foods/bukhara/seekh-kebab.jpg", "Juicy minced meat kebabs grilled over charcoal."],
    ["Phirni", "veg", 190, "/images/foods/bukhara/phirni.jpg", "Creamy rice pudding with cardamom."],
    ["Masala Chaas", "veg", 120, "/images/foods/bukhara/masala-chaas.jpg", "Refreshing spiced buttermilk."]
  ]),

  "Karavalli": makeFoods([
    ["Neer Dosa", "veg", 180, "/images/foods/karavalli/karavalli-neer-dosa.jpg", "Soft coastal rice crepes."],
    ["Mangalorean Fish Curry", "non-veg", 420, "/images/foods/karavalli/karavalli-fish-curry.jpg", "Fish cooked in coconut spice gravy."],
    ["Chicken Ghee Roast", "non-veg", 460, "/images/foods/karavalli/karavalli-prawns-fry.jpg", "Chicken cooked with roasted spices and ghee."],
    ["Kori Rotti", "non-veg", 390, "/images/foods/karavalli/karavalli-fish-tawa-fry.jpg", "Crispy rice rotti with chicken curry."],
    ["Vegetable Stew", "veg", 260, "/images/foods/karavalli/karavalli-clams-ghee-roast.jpg", "Seasonal vegetables in coconut milk."],
    ["Appam", "veg", 160, "/images/foods/karavalli/karavalli-neer-dosa.jpg", "Fermented rice pancakes with crisp edges."],
    ["Prawn Sukka", "non-veg", 480, "/images/foods/karavalli/karavalli-prawns-fry.jpg", "Coastal prawns with coconut and spices."],
    ["Mysore Pak", "veg", 150, "/images/foods/karavalli/karavalli-banana-halwa.jpg", "Classic ghee-based South Indian sweet."],
    ["Curd Rice", "veg", 140, "/images/foods/karavalli/karavalli-kokum-juice.jpg", "Creamy tempered yogurt rice."],
    ["Filter Coffee", "veg", 110, "/images/foods/karavalli/karavalli-kokum-juice.jpg", "Strong traditional South Indian coffee."]
  ]),

  "Indian Accent": makeFoods([
    ["Blue Cheese Naan", "veg", 320, "/images/foods/indian-accent/papdi-chaat.jpg", "Creative naan with blue cheese."],
    ["Chicken Tikka Meatballs", "non-veg", 480, "/images/foods/indian-accent/murgh-malai-kebab.jpg", "Modern chicken tikka interpretation."],
    ["Butter Chicken Kulcha", "non-veg", 520, "/images/foods/indian-accent/galouti-kebab.jpg", "Stuffed kulcha inspired by butter chicken."],
    ["Paneer Khurchan", "veg", 420, "/images/foods/indian-accent/black-dal.jpg", "Crispy paneer with peppers and spices."],
    ["Pulled Pork Vindaloo", "non-veg", 560, "/images/foods/indian-accent/sea-bass-nimboo.jpg", "Slow-cooked pork in Goan-style sauce."],
    ["Dal Chawal", "veg", 350, "/images/foods/indian-accent/black-dal.jpg", "Comforting lentils and rice."],
    ["Keema Samosa", "non-veg", 360, "/images/foods/indian-accent/papdi-chaat.jpg", "Crisp samosas filled with minced meat."],
    ["Biryani", "non-veg", 480, "/images/foods/indian-accent/subz-pulao.jpg", "Fragrant basmati rice with spiced meat."],
    ["Gulab Jamun", "veg", 220, "/images/foods/indian-accent/kulfi-falooda.jpg", "Soft milk dumplings in sugar syrup."],
    ["Mango Kulfi", "veg", 240, "/images/foods/indian-accent/rose-sherbet.jpg", "Rich frozen dessert with mango."]
  ]),

  "Paradise": makeFoods([
    ["Chicken Biryani", "non-veg", 320, "/images/foods/paradise/chicken-biryani.jpg", "Classic Hyderabadi chicken biryani."],
    ["Mutton Biryani", "non-veg", 420, "/images/foods/paradise/mutton-biryani.jpg", "Slow-cooked mutton with aromatic rice."],
    ["Veg Biryani", "veg", 260, "/images/foods/paradise/veg-biryani.jpg", "Fragrant rice with seasonal vegetables."],
    ["Chicken 65", "non-veg", 280, "/images/foods/paradise/chicken-65.jpg", "Crispy spicy chicken bites."],
    ["Mutton Haleem", "non-veg", 300, "/images/foods/paradise/mutton-haleem.jpg", "Slow-cooked meat, lentils and wheat."],
    ["Paneer Biryani", "veg", 290, "/images/foods/paradise/paneer-biryani.jpg", "Aromatic rice layered with paneer."],
    ["Mirchi Ka Salan", "veg", 180, "/images/foods/paradise/mirchi-ka-salan.jpg", "Green chillies in peanut-sesame gravy."],
    ["Double Ka Meetha", "veg", 160, "/images/foods/paradise/double-ka-meetha.jpg", "Hyderabadi bread pudding."],
    ["Qubani Ka Meetha", "veg", 180, "/images/foods/paradise/qubani-ka-meetha.jpg", "Slow-cooked apricot dessert."],
    ["Irani Chai", "veg", 100, "/images/foods/paradise/irani-chai.jpg", "Creamy Hyderabad-style tea."]
  ]),

  "Americano": makeFoods([
    ["Margherita Pizza", "veg", 380, "/images/foods/americano/margherita-pizza.jpg", "Tomato, mozzarella and fresh basil."],
    ["Truffle Mushroom Pizza", "veg", 520, "/images/foods/americano/penne-alfredo.jpg", "Mushrooms and truffle on crisp crust."],
    ["Penne Arrabbiata", "veg", 360, "/images/foods/americano/spaghetti-arrabbiata.jpg", "Penne in spicy tomato garlic sauce."],
    ["Chicken Alfredo", "non-veg", 450, "/images/foods/americano/classic-burger.jpg", "Creamy pasta with grilled chicken."],
    ["Lasagna", "non-veg", 480, "/images/foods/americano/loaded-nachos.jpg", "Layered pasta with rich meat sauce."],
    ["Pesto Pasta", "veg", 390, "/images/foods/americano/caesar-salad.jpg", "Fresh basil pesto pasta."],
    ["Garlic Bread", "veg", 180, "/images/foods/americano/bruschetta.jpg", "Toasted bread with garlic butter."],
    ["Chicken Parmesan", "non-veg", 520, "/images/foods/americano/chicken-wings.jpg", "Crispy chicken with tomato and cheese."],
    ["Tiramisu", "veg", 280, "/images/foods/americano/chocolate-brownie.jpg", "Classic coffee and mascarpone dessert."],
    ["Iced Americano", "veg", 170, "/images/foods/americano/oreo-milkshake.jpg", "Chilled espresso with ice."]
  ]),

  "Baoshuan": makeFoods([
    ["Dim Sum Platter", "veg", 420, "/images/foods/baoshuan/xiao-long-bao.jpg", "Assorted Chinese dumplings."],
    ["Chicken Momos", "non-veg", 320, "/images/foods/baoshuan/chilli-chicken.jpg", "Steamed chicken-filled dumplings."],
    ["Veg Spring Rolls", "veg", 240, "/images/foods/baoshuan/veg-spring-rolls.jpg", "Crispy vegetable spring rolls."],
    ["Kung Pao Chicken", "non-veg", 440, "/images/foods/baoshuan/chilli-chicken.jpg", "Chicken with peanuts, peppers and chilli."],
    ["Mapo Tofu", "veg", 360, "/images/foods/baoshuan/chilli-paneer.jpg", "Silken tofu in spicy bean sauce."],
    ["Hakka Noodles", "veg", 280, "/images/foods/baoshuan/hakka-noodles.jpg", "Wok-tossed noodles with vegetables."],
    ["Szechuan Chicken", "non-veg", 450, "/images/foods/baoshuan/chilli-chicken.jpg", "Spicy chicken with Szechuan flavours."],
    ["Vegetable Fried Rice", "veg", 260, "/images/foods/baoshuan/vegetable-fried-rice.jpg", "Wok-fried rice with vegetables."],
    ["Chilli Garlic Prawns", "non-veg", 520, "/images/foods/baoshuan/hot-and-sour-soup.jpg", "Prawns with chilli and roasted garlic."],
    ["Mango Pudding", "veg", 220, "/images/foods/baoshuan/chocolate-lava-cake.jpg", "Silky chilled mango pudding."]
  ]),

  "Izumi": makeFoods([
    ["Salmon Sushi", "non-veg", 520, "/images/foods/izumi/salmon-sushi.jpg", "Fresh salmon with seasoned sushi rice."],
    ["Chicken Teriyaki", "non-veg", 460, "/images/foods/izumi/chicken-teriyaki.jpg", "Grilled chicken with teriyaki glaze."],
    ["Veg Sushi Roll", "veg", 360, "/images/foods/izumi/veg-sushi-roll.jpg", "Fresh vegetables wrapped in sushi rice."],
    ["Chicken Ramen", "non-veg", 480, "/images/foods/izumi/chicken-ramen.jpg", "Japanese noodle soup with chicken."],
    ["Miso Ramen", "veg", 440, "/images/foods/izumi/miso-ramen.jpg", "Miso broth with vegetables and noodles."],
    ["Gyoza", "non-veg", 340, "/images/foods/izumi/gyoza.jpg", "Pan-fried Japanese dumplings."],
    ["Edamame", "veg", 220, "/images/foods/izumi/edamame.jpg", "Steamed soybeans with sea salt."],
    ["Chicken Yakitori", "non-veg", 380, "/images/foods/izumi/chicken-yakitori.jpg", "Japanese grilled chicken skewers."],
    ["Matcha Cheesecake", "veg", 280, "/images/foods/izumi/matcha-cheesecake.jpg", "Creamy cheesecake with matcha."],
    ["Japanese Green Tea", "veg", 150, "/images/foods/izumi/japanese-green-tea.jpg", "Traditional Japanese green tea."]
  ]),

  "Seefah": makeFoods([
    ["Pad Thai", "veg", 320, "/images/foods/seefah/pad-thai.jpg", "Thai rice noodles with vegetables."],
    ["Thai Green Curry", "veg", 380, "/images/foods/seefah/thai-green-curry.jpg", "Green curry with coconut milk."],
    ["Thai Red Curry", "non-veg", 420, "/images/foods/seefah/thai-red-curry.jpg", "Red curry with tender chicken."],
    ["Chicken Satay", "non-veg", 360, "/images/foods/seefah/chicken-satay.jpg", "Grilled chicken with peanut sauce."],
    ["Tom Yum Soup", "non-veg", 300, "/images/foods/seefah/tom-yum-soup.jpg", "Hot and sour Thai soup with prawns."],
    ["Tom Kha Soup", "veg", 280, "/images/foods/seefah/tom-kha-soup.jpg", "Coconut soup with galangal and lemongrass."],
    ["Thai Basil Chicken", "non-veg", 410, "/images/foods/seefah/thai-basil-chicken.jpg", "Chicken stir-fried with Thai basil."],
    ["Mango Sticky Rice", "veg", 240, "/images/foods/seefah/mango-sticky-rice.jpg", "Sticky rice with mango and coconut cream."],
    ["Vegetable Spring Rolls", "veg", 220, "/images/foods/seefah/vegetable-spring-rolls.jpg", "Crispy rolls with seasoned vegetables."],
    ["Thai Iced Tea", "veg", 160, "/images/foods/seefah/thai-iced-tea.jpg", "Sweet creamy Thai iced tea."]
  ]),

  "Daryaganj": makeFoods([
    ["Butter Chicken", "non-veg", 420, "/images/foods/daryaganj/butter-chicken.jpg", "Chicken in rich buttery tomato gravy."],
    ["Dal Makhani", "veg", 280, "/images/foods/daryaganj/dal-makhani.jpg", "Slow-cooked black lentils with cream."],
    ["Mutton Rogan Josh", "non-veg", 480, "/images/foods/daryaganj/mutton-rogan-josh.jpg", "Mutton in aromatic Kashmiri gravy."],
    ["Chicken Tikka", "non-veg", 360, "/images/foods/daryaganj/chicken-tikka.jpg", "Tandoor-grilled spiced chicken."],
    ["Paneer Tikka", "veg", 320, "/images/foods/daryaganj/paneer-tikka.jpg", "Smoky grilled paneer with peppers."],
    ["Butter Naan", "veg", 80, "/images/foods/daryaganj/butter-naan.jpg", "Soft naan with aromatic butter."],
    ["Amritsari Fish", "non-veg", 390, "/images/foods/daryaganj/amritsari-fish.jpg", "Crispy spiced fish."],
    ["Chicken Biryani", "non-veg", 390, "/images/foods/daryaganj/chicken-biryani.jpg", "Fragrant rice with spiced chicken."],
    ["Gulab Jamun", "veg", 150, "/images/foods/daryaganj/gulab-jamun.jpg", "Warm milk dumplings in syrup."],
    ["Sweet Lassi", "veg", 140, "/images/foods/daryaganj/sweet-lassi.jpg", "Thick chilled sweet yogurt drink."]
  ]),

  "Barbeque Nation": makeFoods([
    ["Chicken Seekh Kebab", "non-veg", 420, "/images/foods/barbeque-nation/chicken-seekh-kebab.jpg", "Grilled minced chicken skewers."],
    ["Tandoori Chicken", "non-veg", 450, "/images/foods/barbeque-nation/tandoori-chicken.jpg", "Classic tandoori grilled chicken."],
    ["Paneer Tikka", "veg", 340, "/images/foods/barbeque-nation/paneer-tikka.jpg", "Char-grilled paneer with peppers."],
    ["Mushroom Tikka", "veg", 300, "/images/foods/barbeque-nation/mushroom-tikka.jpg", "Marinated mushrooms with spices."],
    ["Chicken Wings", "non-veg", 380, "/images/foods/barbeque-nation/chicken-wings.jpg", "Smoky grilled chicken wings."],
    ["Peri Peri Prawns", "non-veg", 520, "/images/foods/barbeque-nation/peri-peri-prawns.jpg", "Grilled prawns with peri peri seasoning."],
    ["Grilled Corn", "veg", 180, "/images/foods/barbeque-nation/grilled-corn.jpg", "Char-grilled corn with butter."],
    ["Veg Seekh Kebab", "veg", 280, "/images/foods/barbeque-nation/veg-seekh-kebab.jpg", "Grilled vegetable kebabs."],
    ["Brownie", "veg", 180, "/images/foods/barbeque-nation/brownie.jpg", "Warm fudgy chocolate brownie."],
    ["Fresh Lime Soda", "veg", 130, "/images/foods/barbeque-nation/fresh-lime-soda.jpg", "Refreshing sparkling lime drink."]
  ]),

  "Biryani By Kilo": makeFoods([
    ["Hyderabadi Chicken Biryani", "non-veg", 360, "/images/foods/biryani-by-kilo/hyderabadi-chicken-biryani.jpg", "Dum-cooked basmati rice with chicken."],
    ["Hyderabadi Mutton Biryani", "non-veg", 460, "/images/foods/biryani-by-kilo/hyderabadi-mutton-biryani.jpg", "Slow-cooked mutton with aromatic rice."],
    ["Lucknowi Chicken Biryani", "non-veg", 380, "/images/foods/biryani-by-kilo/lucknowi-chicken-biryani.jpg", "Delicate Awadhi-style biryani."],
    ["Veg Biryani", "veg", 290, "/images/foods/biryani-by-kilo/veg-biryani.jpg", "Dum-cooked rice with vegetables."],
    ["Paneer Biryani", "veg", 320, "/images/foods/biryani-by-kilo/paneer-biryani.jpg", "Fragrant rice layered with paneer."],
    ["Chicken Seekh Kebab", "non-veg", 350, "/images/foods/biryani-by-kilo/chicken-seekh-kebab.jpg", "Spiced minced chicken grilled."],
    ["Paneer Tikka", "veg", 300, "/images/foods/biryani-by-kilo/paneer-tikka.jpg", "Tandoori paneer with peppers."],
    ["Chicken Korma", "non-veg", 390, "/images/foods/biryani-by-kilo/chicken-korma.jpg", "Creamy chicken curry with nuts."],
    ["Phirni", "veg", 160, "/images/foods/biryani-by-kilo/phirni.jpg", "Traditional chilled rice pudding."],
    ["Kesar Lassi", "veg", 170, "/images/foods/biryani-by-kilo/kesar-lassi.jpg", "Creamy saffron yogurt drink."]
  ]),

  "Theobroma": makeFoods([
    ["Chocolate Brownie", "veg", 180, "/images/foods/theobroma/chocolate-brownie.jpg", "Rich fudgy chocolate brownie."],
    ["Red Velvet Cake", "veg", 320, "/images/foods/theobroma/red-velvet-cake.jpg", "Red velvet sponge with cream cheese."],
    ["Dutch Truffle Cake", "veg", 380, "/images/foods/theobroma/dutch-truffle-cake.jpg", "Chocolate cake with truffle ganache."],
    ["Classic Cheesecake", "veg", 340, "/images/foods/theobroma/classic-cheesecake.jpg", "Creamy baked cheesecake."],
    ["Choco Chip Brownie", "veg", 210, "/images/foods/theobroma/choco-chip-brownie.jpg", "Fudgy brownie with chocolate chips."],
    ["Banana Cake", "veg", 240, "/images/foods/theobroma/banana-cake.jpg", "Moist banana cake."],
    ["Blueberry Cheesecake", "veg", 360, "/images/foods/theobroma/blueberry-cheesecake.jpg", "Cheesecake with blueberry compote."],
    ["Chocolate Mousse", "veg", 260, "/images/foods/theobroma/chocolate-mousse.jpg", "Light creamy chocolate dessert."],
    ["Walnut Brownie", "veg", 220, "/images/foods/theobroma/walnut-brownie.jpg", "Fudgy brownie with toasted walnuts."],
    ["Hot Chocolate", "veg", 190, "/images/foods/theobroma/hot-chocolate.jpg", "Rich warm chocolate drink."]
  ]),

  "Domino's Pizza": makeFoods([
    ["Margherita", "veg", 299, "/images/foods/dominos/margherita.jpg", "Classic tomato and mozzarella pizza."],
    ["Farmhouse", "veg", 399, "/images/foods/dominos/farmhouse.jpg", "Pizza with onion, capsicum and mushroom."],
    ["Peppy Paneer", "veg", 429, "/images/foods/dominos/peppy-paneer.jpg", "Spicy paneer with capsicum and onion."],
    ["Veg Extravaganza", "veg", 479, "/images/foods/dominos/veg-extravaganza.jpg", "Loaded vegetable pizza with cheese."],
    ["Chicken Dominator", "non-veg", 499, "/images/foods/dominos/chicken-dominator.jpg", "Loaded chicken pizza."],
    ["Pepper Barbecue Chicken", "non-veg", 449, "/images/foods/dominos/pepper-barbecue-chicken.jpg", "Smoky barbecue chicken pizza."],
    ["Garlic Breadsticks", "veg", 149, "/images/foods/dominos/garlic-breadsticks.jpg", "Soft garlic butter breadsticks."],
    ["Taco Mexicana", "veg", 189, "/images/foods/dominos/taco-mexicana.jpg", "Crunchy Mexican-inspired snack."],
    ["Choco Lava Cake", "veg", 119, "/images/foods/dominos/choco-lava-cake.jpg", "Warm cake with molten chocolate."],
    ["Pepsi", "veg", 75, "/images/foods/dominos/pepsi.jpg", "Chilled fizzy soft drink."]
  ]),

  "Burger King": makeFoods([
    ["Whopper", "non-veg", 249, "/images/foods/burger-king/whopper.jpg", "Signature flame-grilled burger."],
    ["Chicken Whopper", "non-veg", 279, "/images/foods/burger-king/chicken-whopper.jpg", "Flame-grilled chicken burger."],
    ["Veg Whopper", "veg", 229, "/images/foods/burger-king/veg-whopper.jpg", "Vegetarian burger with fresh toppings."],
    ["Crispy Veg Burger", "veg", 149, "/images/foods/burger-king/crispy-veg-burger.jpg", "Crunchy vegetable patty burger."],
    ["Chicken Burger", "non-veg", 199, "/images/foods/burger-king/chicken-burger.jpg", "Crispy chicken burger."],
    ["Paneer Royale", "veg", 219, "/images/foods/burger-king/paneer-royale.jpg", "Crispy paneer burger."],
    ["French Fries", "veg", 129, "/images/foods/burger-king/french-fries.jpg", "Golden crispy fries."],
    ["Chicken Nuggets", "non-veg", 189, "/images/foods/burger-king/chicken-nuggets.jpg", "Crispy chicken bites."],
    ["Chocolate Sundae", "veg", 119, "/images/foods/burger-king/chocolate-sundae.jpg", "Vanilla dessert with chocolate sauce."],
    ["Coke", "veg", 79, "/images/foods/burger-king/coke.jpg", "Chilled classic cola."]
  ]),

  "WOW! Momo": makeFoods([
    ["Veg Steamed Momos", "veg", 179, "/images/foods/wow-momo/veg-steamed-momos.jpg", "Steamed vegetable dumplings."],
    ["Chicken Steamed Momos", "non-veg", 199, "/images/foods/wow-momo/chicken-steamed-momos.jpg", "Steamed chicken dumplings."],
    ["Paneer Momos", "veg", 199, "/images/foods/wow-momo/paneer-momos.jpg", "Momos stuffed with spiced paneer."],
    ["Chicken Fried Momos", "non-veg", 229, "/images/foods/wow-momo/chicken-fried-momos.jpg", "Crispy fried chicken momos."],
    ["Schezwan Momos", "veg", 209, "/images/foods/wow-momo/schezwan-momos.jpg", "Momos tossed in Schezwan sauce."],
    ["Momo Burger", "veg", 249, "/images/foods/wow-momo/momo-burger.jpg", "Street-style burger filled with momos."],
    ["Corn Cheese Momos", "veg", 219, "/images/foods/wow-momo/corn-cheese-momos.jpg", "Corn and cheese stuffed dumplings."],
    ["Chicken Peri Peri Momos", "non-veg", 239, "/images/foods/wow-momo/chicken-peri-peri-momos.jpg", "Chicken momos with peri peri seasoning."],
    ["Choco Momo", "veg", 189, "/images/foods/wow-momo/choco-momo.jpg", "Sweet dumplings with chocolate filling."],
    ["Masala Lemonade", "veg", 119, "/images/foods/wow-momo/masala-lemonade.jpg", "Tangy refreshing masala lemonade."]
  ]),

  "SRV": makeFoods([
    ["Chicken Biryani", "non-veg", 320, "/images/foods/srv/chicken-biryani.jpg", "Aromatic basmati rice layered with spiced chicken."],
    ["Mutton Biryani", "non-veg", 420, "/images/foods/srv/mutton-biryani.jpg", "Slow-cooked mutton with fragrant basmati rice."],
    ["Paneer Tikka", "veg", 280, "/images/foods/srv/paneer-tikka.jpg", "Smoky grilled paneer marinated in Indian spices."],
    ["Butter Chicken", "non-veg", 390, "/images/foods/srv/butter-chicken.jpg", "Tender chicken in a rich buttery tomato gravy."],
    ["Dal Tadka", "veg", 220, "/images/foods/srv/dal-tadka.jpg", "Yellow lentils tempered with garlic and aromatic spices."],
    ["Chicken Tikka", "non-veg", 340, "/images/foods/srv/chicken-tikka.jpg", "Juicy chicken pieces grilled with tandoori spices."],
    ["Veg Thali", "veg", 280, "/images/foods/srv/veg-thali.jpg", "Complete Indian meal with curries, rice, roti and sides."],
    ["Butter Naan", "veg", 80, "/images/foods/srv/butter-naan.jpg", "Soft tandoor-baked naan brushed with butter."],
    ["Gulab Jamun", "veg", 140, "/images/foods/srv/gulab-jamun.jpg", "Soft milk dumplings served in sweet syrup."],
    ["Masala Chaas", "veg", 100, "/images/foods/srv/masala-chaas.jpg", "Refreshing chilled buttermilk with Indian spices."]
  ])
}

// Seed database
async function seedDatabase() {
  try {
    console.log("Connecting to SQLite and syncing models...")

    await sequelize.sync({ force: true })

    console.log("Creating users...")

    const hashedPassword = await bcrypt.hash("password123", 10)

    const admin = await User.create({
      name: "Admin User",
      email: "admin@foodiehub.com",
      password: hashedPassword,
      role: "admin"
    })

    await User.create({
      name: "Test User",
      email: "user@foodiehub.com",
      password: hashedPassword,
      role: "user"
    })

    console.log("Creating restaurants and food menus...")

    let totalFoods = 0

    for (const data of restaurantsData) {
      const [
        name,
        category,
        image,
        rating,
        deliveryTime,
        distance,
        offer,
        address
      ] = data

      const restaurant = await Restaurant.create({
        name,
        category,
        image,
        rating,
        deliveryTime,
        distance,
        offer,
        address,
        isOpen: true,
        ownerId: admin.id
      })

      const foods = (foodData[name] || []).map((food) => ({
        ...food,
        restaurantId: restaurant.id
      }))

      await Food.bulkCreate(foods)

      totalFoods += foods.length
    }

    console.log("====================================")
    console.log("FoodieHub database seeded successfully!")
    console.log("Restaurants:", restaurantsData.length)
    console.log("Total food items:", totalFoods)
    console.log("====================================")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding SQLite database:", error)
    process.exit(1)
  }
}

seedDatabase()