// src/seed/categoriesData.ts
import { CategoryType, CategoryField } from "../entities/category";

export interface CategorySeedData {
  name: CategoryType;
  fields: CategoryField[];
  description?: string;
}

export const categoriesData: CategorySeedData[] = [
  {
    name: "Fashion & Clothing",
    fields: [
      { name: "sizes", type: "array", required: true, options: ["XS", "S", "M", "L", "XL", "XXL"] },
      { name: "color", type: "string", required: true },
      { name: "material", type: "string", required: true, options: ["Cotton", "Polyester", "Wool", "Denim", "Leather", "Silk"] },
      { name: "gender", type: "string", required: true, options: ["Men", "Women", "Unisex", "Kids"] },
      { name: "brand", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Clothing, shoes, and fashion accessories",
  },
  {
    name: "Electronics & Gadgets",
    fields: [
      { name: "type", type: "string", required: true, options: ["Phone", "Laptop", "Tablet", "Desktop", "Smartwatch", "Camera", "TV", "Radio", "Headphones", "Gaming Console", "Other"] },
      { name: "brand", type: "string", required: true },
      { name: "modelNumber", type: "string", required: true },
      { name: "warrantyPeriod", type: "string", required: true },
      { name: "condition", type: "string", required: true, options: ["New", "Used", "Refurbished"] },
      { name: "batteryCapacity", type: "string", required: false },
      { name: "storageMemory", type: "string", required: true },
      { name: "colorOptions", type: "array", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Electronic devices and gadgets",
  },
  {
    name: "Home & Furniture",
    fields: [
      { name: "type", type: "string", required: true, options: ["Sofa", "Bed", "Dining Table", "Chair", "Wardrobe", "Desk", "Shelf", "Outdoor Furniture", "Decor"] },
      { name: "material", type: "string", required: true, options: ["Wood", "Metal", "Plastic", "Glass", "Leather", "Fabric"] },
      { name: "dimensions", type: "string", required: true },
      { name: "weight", type: "string", required: true },
      { name: "assemblyRequired", type: "boolean", required: true },
      { name: "brand", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Furniture and home essentials",
  },
  {
    name: "Food & Beverages",
    fields: [
      { name: "brandProducer", type: "string", required: true },
      { name: "weightVolume", type: "string", required: true },
      { name: "ingredients", type: "string", required: true },
      { name: "expiryDate", type: "date", required: true },
      { name: "storageInstructions", type: "string", required: true, options: ["Refrigerate", "Keep Dry", "Freeze"] },
      { name: "dietaryInfo", type: "string", required: true, options: ["Vegan", "Vegetarian", "Gluten-Free", "Halal", "Kosher"] },
      { name: "images", type: "array", required: true },
    ],
    description: "Food items and beverages",
  },
  {
    name: "Beauty & Personal Care",
    fields: [
      { name: "brand", type: "string", required: true },
      { name: "productType", type: "string", required: true, options: ["Moisturizer", "Shampoo", "Perfume", "Lipstick", "Soap", "Lotion", "Hair Oil", "Makeup Kit"] },
      { name: "ingredients", type: "string", required: false },
      { name: "expiryDate", type: "date", required: true },
      { name: "skinHairType", type: "string", required: true, options: ["Oily", "Dry", "Normal", "Sensitive", "All"] },
      { name: "genderTarget", type: "string", required: true, options: ["Men", "Women", "Unisex"] },
      { name: "images", type: "array", required: true },
    ],
    description: "Beauty and personal care products",
  },
  {
    name: "Books & Stationery",
    fields: [
      { name: "type", type: "string", required: true, options: ["Fiction", "Non-fiction", "Educational", "Children", "Comics", "Stationery"] },
      { name: "author", type: "string", required: true },
      { name: "publisher", type: "string", required: true },
      { name: "editionYear", type: "string", required: true },
      { name: "language", type: "string", required: true, options: ["English", "French", "Kinyarwanda", "Spanish", "German"] },
      { name: "genre", type: "string", required: true },
      { name: "isbn", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Books, stationery, and educational materials",
  },
  {
    name: "Health & Fitness",
    fields: [
      { name: "type", type: "string", required: true, options: ["Supplement", "Equipment", "Clothing", "Accessories"] },
      { name: "brand", type: "string", required: true },
      { name: "weightSize", type: "string", required: true },
      { name: "ingredients", type: "string", required: true },
      { name: "expiryDate", type: "date", required: true },
      { name: "usageInstructions", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Health, fitness, and supplements",
  },
  {
    name: "Automotive & Accessories",
    fields: [
      { name: "brand", type: "string", required: true },
      { name: "vehicleType", type: "string", required: true, options: ["Car", "Motorcycle", "Truck", "Bicycle"] },
      { name: "modelCompatibility", type: "string", required: true },
      { name: "condition", type: "string", required: true, options: ["New", "Used"] },
      { name: "warranty", type: "string", required: true },
      { name: "material", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Automotive products and accessories",
  },
  {
    name: "Kids & Baby Products",
    fields: [
      { name: "ageGroup", type: "string", required: true, options: ["0-6 months", "6-12 months", "1-3 years", "3-5 years", "5+ years"] },
      { name: "gender", type: "string", required: true, options: ["Boy", "Girl", "Unisex"] },
      { name: "material", type: "string", required: true },
      { name: "safetyCertifications", type: "string", required: true },
      { name: "brand", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Products for kids and babies",
  },
  {
    name: "Real Estate & Property",
    fields: [
      { name: "location", type: "string", required: true },
      { name: "propertyType", type: "string", required: true, options: ["House", "Apartment", "Land", "Commercial", "Office"] },
      { name: "size", type: "string", required: true },
      { name: "bedroomsBathrooms", type: "string", required: true },
      { name: "furnished", type: "boolean", required: true },
      { name: "availability", type: "string", required: true, options: ["For Sale", "For Rent"] },
      { name: "contactInfo", type: "string", required: true },
      { name: "images", type: "array", required: true },
    ],
    description: "Real estate and property listings",
  },
  {
    name: "Services",
    fields: [
      { name: "serviceCategory", type: "string", required: true, options: ["Cleaning", "Repairs", "Delivery", "Beauty Services", "Tutoring", "Transport", "Health Services"] },
      { name: "serviceArea", type: "string", required: true },
      { name: "availability", type: "string", required: true, options: ["24/7", "Weekdays", "Weekends"] },
      { name: "contactInfo", type: "string", required: true },
      { name: "images", type: "array", required: false },
    ],
    description: "Various services",
  },
];
