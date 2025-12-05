import 'dotenv/config';
import { db } from "./db";
import { users, posts, donations, socialMediaPublications } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(socialMediaPublications);
    await db.delete(donations);
    await db.delete(posts);
    await db.delete(users);

    // Seed admin user
    await db.insert(users).values([
      {
        username: "admin",
        password: "admin123", // In production, this should be hashed
      },
    ]);

    // Seed sample posts
    await db.insert(posts).values([
      {
        title: "Community Health Camp",
        description: "Free health checkup camp organized for underprivileged communities. Our medical team provided consultations, basic treatments, and health awareness sessions.",
        coverImageUrl: "/uploads/health-camp.jpg",
        additionalImages: [],
        date: new Date("2024-01-15"),
      },
      {
        title: "Education Support Initiative",
        description: "Distributed books, stationery, and school supplies to 200+ children from low-income families. This initiative aims to support their educational journey.",
        coverImageUrl: "/uploads/education.jpg",
        additionalImages: [],
        date: new Date("2024-01-10"),
      },
      {
        title: "Environmental Clean-up Drive",
        description: "Organized a massive clean-up drive in local parks and streets. Over 100 volunteers participated in making our community cleaner and greener.",
        coverImageUrl: "/uploads/cleanup.jpg",
        additionalImages: [],
        date: new Date("2024-01-05"),
      },
    ]);

    // Seed sample donations
    await db.insert(donations).values([
      {
        name: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul@example.com",
        amount: 5000,
        proofUrl: "/uploads/proof1.jpg",
        status: "approved",
      },
      {
        name: "Priya Patel",
        mobile: "8765432109",
        email: "priya@example.com",
        amount: 2500,
        proofUrl: "/uploads/proof2.jpg",
        status: "pending",
      },
    ]);

    // Seed sample social media publications
    await db.insert(socialMediaPublications).values([
      {
        title: "Community Health Drive Featured in Local News",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        linkUrl: "https://example-news.com/lions-club-health-drive",
      },
      {
        title: "Education Initiative Wins Recognition Award",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", 
        linkUrl: "https://example-times.com/lions-club-education-award",
      },
      {
        title: "Blood Donation Camp Saves 200+ Lives",
        imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        linkUrl: "https://example-herald.com/lions-club-blood-donation",
      },
      {
        title: "Environmental Clean-up Drive Goes Viral",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        linkUrl: "https://example-post.com/lions-club-environment",
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("📝 Sample data created:");
    console.log("   - Admin user: admin/admin123");
    console.log("   - 3 sample posts");
    console.log("   - 2 sample donations");
    console.log("   - 4 sample social media publications");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
