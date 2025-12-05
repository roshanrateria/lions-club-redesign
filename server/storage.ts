import {
  users,
  posts,
  donations,
  socialMediaPublications,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Donation,
  type InsertDonation,
  type SocialMediaPublication,
  type InsertSocialMediaPublication,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Post methods
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(insertPost: InsertPost): Promise<Post>;
  updatePost(
    id: number,
    updateData: Partial<InsertPost>,
  ): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Donation methods
  getDonations(): Promise<Donation[]>;
  createDonation(insertDonation: InsertDonation): Promise<Donation>;
  updateDonationStatus(
    id: number,
    status: string,
  ): Promise<Donation | undefined>;

  // Social Media Publication methods
  getSocialMediaPublications(): Promise<SocialMediaPublication[]>;
  createSocialMediaPublication(insertSocialMediaPublication: InsertSocialMediaPublication): Promise<SocialMediaPublication>;
  updateSocialMediaPublication(
    id: number,
    updateData: Partial<InsertSocialMediaPublication>,
  ): Promise<SocialMediaPublication | undefined>;
  deleteSocialMediaPublication(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.date));
    allPosts.forEach((post) => {});
    return allPosts;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    // Ensure additionalImages is properly formatted for PostgreSQL array
    const dataToInsert = {
      ...insertPost,
      additionalImages:
        insertPost.additionalImages && insertPost.additionalImages.length > 0
          ? insertPost.additionalImages
          : null,
    };

    const [post] = await db.insert(posts).values(dataToInsert).returning();

    return post;
  }

  async updatePost(
    id: number,
    updateData: Partial<InsertPost>,
  ): Promise<Post | undefined> {
    // Ensure additionalImages is properly formatted for PostgreSQL array
    const dataToUpdate = { ...updateData };
    if ("additionalImages" in dataToUpdate) {
      dataToUpdate.additionalImages =
        dataToUpdate.additionalImages &&
        Array.isArray(dataToUpdate.additionalImages) &&
        dataToUpdate.additionalImages.length > 0
          ? dataToUpdate.additionalImages
          : null;
    }

    const [post] = await db
      .update(posts)
      .set(dataToUpdate)
      .where(eq(posts.id, id))
      .returning();

    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    try {
      await db.delete(posts).where(eq(posts.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Donation methods
  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db
      .insert(donations)
      .values(insertDonation)
      .returning();
    return donation;
  }

  async updateDonationStatus(
    id: number,
    status: string,
  ): Promise<Donation | undefined> {
    const [donation] = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();
    return donation || undefined;
  }

  // Social Media Publication methods
  async getSocialMediaPublications(): Promise<SocialMediaPublication[]> {
    return await db.select().from(socialMediaPublications).orderBy(desc(socialMediaPublications.createdAt));
  }

  async createSocialMediaPublication(insertSocialMediaPublication: InsertSocialMediaPublication): Promise<SocialMediaPublication> {
    const [socialMediaPublication] = await db
      .insert(socialMediaPublications)
      .values(insertSocialMediaPublication)
      .returning();
    return socialMediaPublication;
  }

  async updateSocialMediaPublication(
    id: number,
    updateData: Partial<InsertSocialMediaPublication>,
  ): Promise<SocialMediaPublication | undefined> {
    const [socialMediaPublication] = await db
      .update(socialMediaPublications)
      .set(updateData)
      .where(eq(socialMediaPublications.id, id))
      .returning();
    return socialMediaPublication || undefined;
  }

  async deleteSocialMediaPublication(id: number): Promise<boolean> {
    try {
      await db.delete(socialMediaPublications).where(eq(socialMediaPublications.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
