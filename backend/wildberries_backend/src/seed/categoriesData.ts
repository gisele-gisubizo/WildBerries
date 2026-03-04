// src/seed/categoriesData.ts
import { CategoryType, CategoryField } from "../entities/category";

export interface CategorySeedData {
  name: CategoryType;
  fields: CategoryField[];
  description?: string;
}

export const categoriesData: CategorySeedData[] = [
  {
    name: "Women's Clothing",
    fields: [
      { name: "sizes", type: "array", required: true, options: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"] },
      { name: "color", type: "string", required: true },
      { name: "style", type: "string", required: true, options: ["Casual", "Formal", "Boho", "Streetwear", "Party", "Beach", "Loungewear", "Vintage"] },
      { name: "type", type: "string", required: true, options: ["Dress", "Top", "Blouse", "T-Shirt", "Skirt", "Pants", "Jeans", "Shorts", "Jumpsuit", "Blazer", "Coat", "Jacket", "Hoodie", "Sweater", "Cardigan"] },
      { name: "material", type: "string", required: true, options: ["Cotton", "Polyester", "Chiffon", "Linen", "Satin", "Velvet", "Denim", "Silk", "Spandex", "Knit"] },
      { name: "pattern", type: "string", required: false, options: ["Solid", "Floral", "Striped", "Plaid", "Animal Print", "Abstract", "Tie-Dye"] },
      { name: "neckline", type: "string", required: false, options: ["V-Neck", "Round Neck", "Square Neck", "Off Shoulder", "Turtleneck", "Halter"] },
      { name: "sleeveLength", type: "string", required: false, options: ["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve"] },
      { name: "season", type: "string", required: false, options: ["Spring", "Summer", "Fall", "Winter", "All Season"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Trendy women's fashion including dresses, tops, bottoms, and outerwear",
  },
  {
    name: "Men's Clothing",
    fields: [
      { name: "sizes", type: "array", required: true, options: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"] },
      { name: "color", type: "string", required: true },
      { name: "type", type: "string", required: true, options: ["T-Shirt", "Shirt", "Polo", "Pants", "Jeans", "Shorts", "Jacket", "Coat", "Hoodie", "Sweater", "Blazer", "Suit", "Tracksuit"] },
      { name: "style", type: "string", required: true, options: ["Casual", "Formal", "Streetwear", "Sporty", "Business", "Vintage"] },
      { name: "material", type: "string", required: true, options: ["Cotton", "Polyester", "Denim", "Linen", "Wool", "Fleece"] },
      { name: "pattern", type: "string", required: false, options: ["Solid", "Striped", "Plaid", "Graphic Print", "Camo"] },
      { name: "sleeveLength", type: "string", required: false, options: ["Sleeveless", "Short Sleeve", "Long Sleeve"] },
      { name: "season", type: "string", required: false, options: ["Spring", "Summer", "Fall", "Winter", "All Season"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Men's fashion including shirts, pants, jackets, and activewear",
  },
  {
    name: "Kids & Baby Clothing",
    fields: [
      { name: "ageGroup", type: "string", required: true, options: ["0-3 months", "3-6 months", "6-12 months", "1-2 years", "3-4 years", "5-6 years", "7-8 years", "9-10 years", "11-12 years", "13-14 years"] },
      { name: "gender", type: "string", required: true, options: ["Boy", "Girl", "Unisex"] },
      { name: "type", type: "string", required: true, options: ["Onesie", "T-Shirt", "Dress", "Pants", "Shorts", "Jacket", "Pajamas", "Swimwear", "School Uniform", "Set"] },
      { name: "sizes", type: "array", required: true, options: ["70", "80", "90", "100", "110", "120", "130", "140", "150", "160"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: true, options: ["Cotton", "Fleece", "Polyester", "Wool", "Organic Cotton"] },
      { name: "season", type: "string", required: false, options: ["Spring", "Summer", "Fall", "Winter", "All Season"] },
    ],
    description: "Cute and comfortable clothing for kids and babies",
  },
  {
    name: "Shoes & Footwear",
    fields: [
      { name: "sizes", type: "array", required: true, options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"] },
      { name: "gender", type: "string", required: true, options: ["Women", "Men", "Kids", "Unisex"] },
      { name: "type", type: "string", required: true, options: ["Sneakers", "Heels", "Flats", "Sandals", "Boots", "Loafers", "Slippers", "Mules", "Wedges", "Platform Shoes", "Athletic Shoes"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: true, options: ["Leather", "Faux Leather", "Canvas", "Mesh", "Suede", "Rubber"] },
      { name: "heel height", type: "string", required: false, options: ["Flat", "Low (1-3cm)", "Mid (4-6cm)", "High (7-9cm)", "Very High (10cm+)"] },
      { name: "occasion", type: "string", required: false, options: ["Casual", "Formal", "Party", "Sport", "Beach", "Office"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Footwear for all occasions — heels, sneakers, boots, sandals and more",
  },
  {
    name: "Bags & Accessories",
    fields: [
      { name: "type", type: "string", required: true, options: ["Handbag", "Tote Bag", "Backpack", "Crossbody Bag", "Clutch", "Shoulder Bag", "Mini Bag", "Wallet", "Belt Bag", "Travel Bag"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: true, options: ["Leather", "Faux Leather", "Canvas", "Nylon", "PVC", "Straw", "Fabric"] },
      { name: "size", type: "string", required: false, options: ["Mini", "Small", "Medium", "Large", "Extra Large"] },
      { name: "closure", type: "string", required: false, options: ["Zipper", "Magnetic Snap", "Buckle", "Drawstring", "Open Top"] },
      { name: "gender", type: "string", required: false, options: ["Women", "Men", "Unisex"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Handbags, totes, backpacks, wallets and fashion accessories",
  },
  {
    name: "Jewelry & Watches",
    fields: [
      { name: "type", type: "string", required: true, options: ["Necklace", "Bracelet", "Ring", "Earrings", "Anklet", "Watch", "Brooch", "Hair Jewelry", "Body Chain"] },
      { name: "material", type: "string", required: true, options: ["Gold Plated", "Silver Plated", "Stainless Steel", "Rose Gold", "Crystal", "Pearl", "Alloy", "Acrylic"] },
      { name: "color", type: "string", required: true },
      { name: "gender", type: "string", required: false, options: ["Women", "Men", "Unisex"] },
      { name: "style", type: "string", required: false, options: ["Minimalist", "Boho", "Vintage", "Statement", "Elegant", "Casual"] },
      { name: "occasion", type: "string", required: false, options: ["Everyday", "Party", "Wedding", "Office", "Beach"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Necklaces, earrings, rings, bracelets, watches and fashion jewelry",
  },
  {
    name: "Beauty & Makeup",
    fields: [
      { name: "type", type: "string", required: true, options: ["Foundation", "Lipstick", "Lip Gloss", "Eyeshadow", "Mascara", "Eyeliner", "Blush", "Highlighter", "Concealer", "Setting Spray", "Nail Polish", "Makeup Kit"] },
      { name: "brand", type: "string", required: true },
      { name: "shade", type: "string", required: false },
      { name: "skinType", type: "string", required: false, options: ["Oily", "Dry", "Normal", "Combination", "Sensitive", "All"] },
      { name: "finish", type: "string", required: false, options: ["Matte", "Glossy", "Satin", "Dewy", "Natural"] },
      { name: "coverage", type: "string", required: false, options: ["Light", "Medium", "Full"] },
      { name: "crueltyFree", type: "boolean", required: false },
    ],
    description: "Makeup, cosmetics and beauty products",
  },
  {
    name: "Skincare & Hair Care",
    fields: [
      { name: "type", type: "string", required: true, options: ["Moisturizer", "Serum", "Face Mask", "Sunscreen", "Toner", "Cleanser", "Eye Cream", "Body Lotion", "Shampoo", "Conditioner", "Hair Mask", "Hair Oil", "Hair Serum", "Scalp Treatment"] },
      { name: "brand", type: "string", required: true },
      { name: "skinType", type: "string", required: false, options: ["Oily", "Dry", "Normal", "Combination", "Sensitive", "All"] },
      { name: "hairType", type: "string", required: false, options: ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick", "Color-Treated", "All"] },
      { name: "concern", type: "string", required: false, options: ["Anti-Aging", "Acne", "Brightening", "Hydration", "Pore Care", "Hair Growth", "Dandruff", "Frizz Control"] },
      { name: "ingredients", type: "string", required: false },
      { name: "volume", type: "string", required: true },
    ],
    description: "Skincare, haircare and personal care essentials",
  },
  {
    name: "Sportswear & Activewear",
    fields: [
      { name: "type", type: "string", required: true, options: ["Sports Bra", "Leggings", "Yoga Pants", "Running Shorts", "Tank Top", "Hoodie", "Track Jacket", "Compression Top", "Swimwear", "Gym Gloves"] },
      { name: "gender", type: "string", required: true, options: ["Women", "Men", "Unisex"] },
      { name: "sizes", type: "array", required: true, options: ["XS", "S", "M", "L", "XL", "XXL"] },
      { name: "color", type: "string", required: true },
      { name: "activity", type: "string", required: false, options: ["Yoga", "Running", "Gym", "Swimming", "Cycling", "Basketball", "Tennis", "General Fitness"] },
      { name: "material", type: "string", required: true, options: ["Spandex", "Polyester", "Nylon", "Cotton Blend", "Moisture-Wicking Fabric"] },
      { name: "brand", type: "string", required: false },
    ],
    description: "Activewear, gym wear, yoga and sports clothing",
  },
  {
    name: "Lingerie & Sleepwear",
    fields: [
      { name: "type", type: "string", required: true, options: ["Bra", "Panties", "Bra Set", "Shapewear", "Corset", "Pajama Set", "Nightgown", "Robe", "Socks", "Tights"] },
      { name: "sizes", type: "array", required: true, options: ["XS", "S", "M", "L", "XL", "XXL", "32A", "32B", "34A", "34B", "34C", "34D", "36B", "36C", "36D"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: true, options: ["Cotton", "Lace", "Satin", "Silk", "Mesh", "Microfiber", "Modal"] },
      { name: "style", type: "string", required: false, options: ["Everyday", "Sexy", "Sporty", "Vintage", "Minimalist"] },
    ],
    description: "Lingerie, bras, underwear, sleepwear and loungewear",
  },
  {
    name: "Home & Living",
    fields: [
      { name: "type", type: "string", required: true, options: ["Bedding", "Pillows", "Curtains", "Rugs", "Towels", "Kitchen Accessories", "Storage", "Wall Art", "Candles", "Photo Frame", "Plant Pots", "Table Decor", "Bathroom Accessories"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: false, options: ["Cotton", "Polyester", "Linen", "Ceramic", "Wood", "Metal", "Plastic", "Glass"] },
      { name: "dimensions", type: "string", required: false },
      { name: "style", type: "string", required: false, options: ["Modern", "Boho", "Minimalist", "Vintage", "Nordic", "Classic"] },
      { name: "occasion", type: "string", required: false, options: ["Everyday", "Holiday", "Wedding", "Party"] },
    ],
    description: "Home decor, bedding, kitchen and living essentials",
  },
  {
    name: "Phone & Electronics Accessories",
    fields: [
      { name: "type", type: "string", required: true, options: ["Phone Case", "Screen Protector", "Charger", "Earphones", "Earbuds", "Power Bank", "Cable", "Phone Stand", "Laptop Bag", "Mouse", "Keyboard", "Smart Watch Band", "Camera Accessories"] },
      { name: "compatibility", type: "string", required: true },
      { name: "color", type: "string", required: false },
      { name: "brand", type: "string", required: false },
      { name: "material", type: "string", required: false, options: ["Silicone", "Leather", "TPU", "Hard Plastic", "Metal", "Fabric"] },
    ],
    description: "Cases, chargers, cables and accessories for phones and devices",
  },
];
