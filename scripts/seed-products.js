import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    seller_name: "TechStore",
    stock: 15,
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 3299,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description:
      "Lightweight running shoes with breathable mesh and cushioned sole.",
    seller_name: "SportsHub",
    stock: 8,
  },
  {
    id: 3,
    name: "Coffee Maker",
    price: 4599,
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    description:
      "Automatic coffee maker with programmable timer and 12-cup capacity.",
    seller_name: "HomeEssentials",
    stock: 0,
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 899,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    description:
      "Non-slip yoga mat with extra cushioning, perfect for home workouts.",
    seller_name: "FitLife",
    stock: 25,
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 5999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    description:
      "Fitness tracking smart watch with heart rate monitor and GPS.",
    seller_name: "TechStore",
    stock: 12,
  },
  {
    id: 6,
    name: "Backpack",
    price: 1799,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    description:
      "Durable laptop backpack with multiple compartments and water resistance.",
    seller_name: "TravelGear",
    stock: 20,
  },
];

async function seedProducts() {
  try {
    console.log("Seeding products...");

    const adminResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@myapp.com"],
    );
    const adminId = adminResult.rows[0].id;
    console.log("Admin id found:", adminId);

    for (const product of products) {
      await pool.query(
        `
        INSERT INTO products (id, name, price, category, image, description, seller_name, stock, seller_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          seller_name = EXCLUDED.seller_name,
          stock = EXCLUDED.stock,
          seller_id = EXCLUDED.seller_id
      `,
        [
          product.id,
          product.name,
          product.price,
          product.category,
          product.image,
          product.description,
          product.seller_name,
          product.stock,
          adminId,
        ],
      );
      console.log(`✅ ${product.name} seeded`);
    }

    console.log("🎉 All products seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seedProducts();
