import { db } from "./db";
import { users, posts, donations, socialMediaPublications } from "@shared/schema";

async function truncateAll() {
  try {
    console.log("🧹 Truncating all data from users, posts, donations, and social media publications...");
    await db.delete(socialMediaPublications);
    await db.delete(donations);
    await db.delete(posts);
    await db.delete(users);
    console.log("✅ All data cleared, tables are empty.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error truncating tables:", err);
    process.exit(1);
  }
}

truncateAll();
