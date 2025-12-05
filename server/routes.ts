import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import session from "express-session";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertDonationSchema, insertSocialMediaPublicationSchema, users } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
    user?: { username: string; id: number };
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.",
        ),
      );
    }
  },
});

// Authentication middleware
// This ensures only authenticated admin users can access protected endpoints
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'lions-club-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // PROTECTED: Only authenticated admins can create posts
  app.post(
    "/api/posts",
    requireAuth, // Add authentication middleware
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        const additionalImageUrls = files.additionalImages
          ? files.additionalImages.map((file) => `/uploads/${file.filename}`)
          : [];

        const validatedData = insertPostSchema.parse({
          ...req.body,
          date: new Date(req.body.date),
          coverImageUrl: files.coverImage?.[0]
            ? `/uploads/${files.coverImage[0].filename}`
            : null,
          additionalImages:
            additionalImageUrls.length > 0 ? additionalImageUrls : null,
        });

        const post = await storage.createPost(validatedData);
        res.status(201).json(post);
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Failed to create post" });
        }
      }
    },
  );

  // PROTECTED: Only authenticated admins can update posts
  app.put(
    "/api/posts/:id",
    requireAuth, // Add authentication middleware
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // Get existing post to preserve current images if no new ones uploaded
        const existingPost = await storage.getPost(id);
        if (!existingPost) {
          return res.status(404).json({ message: "Post not found" });
        }

        const updateData = {
          ...req.body,
          date: req.body.date ? new Date(req.body.date) : undefined,
        };

        // Only update cover image if new one is uploaded, otherwise preserve existing
        if (files.coverImage?.[0]) {
          updateData.coverImageUrl = `/uploads/${files.coverImage[0].filename}`;
        } else {
          updateData.coverImageUrl = existingPost.coverImageUrl;
        }

        // Only update additional images if new ones are uploaded, otherwise preserve existing
        if (files.additionalImages && files.additionalImages.length > 0) {
          const newAdditionalImages = files.additionalImages.map(
            (file) => `/uploads/${file.filename}`,
          );
          updateData.additionalImages = newAdditionalImages;
        } else {
          updateData.additionalImages = existingPost.additionalImages;
        }

        // Remove undefined values
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        });

        const post = await storage.updatePost(id, updateData);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Failed to update post" });
        }
      }
    },
  );

  // PROTECTED: Only authenticated admins can delete posts  
  app.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePost(id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Donations routes
  app.post("/api/donations", upload.single("proof"), async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse({
        ...req.body,
        amount: parseInt(req.body.amount),
        proofUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });

      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to submit donation form" });
      }
    }
  });

  // PROTECTED: Only authenticated admins can view all donations
  app.get("/api/donations", requireAuth, async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // PROTECTED: Only authenticated admins can update donation status
  app.put("/api/donations/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const donation = await storage.updateDonationStatus(id, status);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update donation status" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Social Media Publications routes
  app.get("/api/social-media-publications", async (req, res) => {
    try {
      const publications = await storage.getSocialMediaPublications();
      res.json(publications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social media publications" });
    }
  });

  // PROTECTED: Only authenticated admins can create social media publications
  app.post(
    "/api/social-media-publications",
    requireAuth,
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Image is required" });
        }

        const validatedData = insertSocialMediaPublicationSchema.parse({
          ...req.body,
          imageUrl: `/uploads/${req.file.filename}`,
        });

        const publication = await storage.createSocialMediaPublication(validatedData);
        res.status(201).json(publication);
      } catch (error) {
        console.error("Error creating social media publication:", error);
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Failed to create social media publication" });
        }
      }
    },
  );

  // PROTECTED: Only authenticated admins can update social media publications
  app.put(
    "/api/social-media-publications/:id",
    requireAuth,
    upload.single("image"),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);

        // Get existing publication to preserve current image if no new one uploaded
        const existingPublication = await storage.getSocialMediaPublications();
        const current = existingPublication.find(p => p.id === id);
        if (!current) {
          return res.status(404).json({ message: "Publication not found" });
        }

        const updateData = {
          ...req.body,
          imageUrl: req.file ? `/uploads/${req.file.filename}` : current.imageUrl,
        };

        const publication = await storage.updateSocialMediaPublication(id, updateData);
        if (!publication) {
          return res.status(404).json({ message: "Publication not found" });
        }
        res.json(publication);
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Failed to update social media publication" });
        }
      }
    },
  );

  // PROTECTED: Only authenticated admins can delete social media publications
  app.delete("/api/social-media-publications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSocialMediaPublication(id);
      if (!success) {
        return res.status(404).json({ message: "Publication not found" });
      }
      res.json({ message: "Social media publication deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social media publication" });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

      if (user.length > 0 && user[0].password === password) {
        // Set session
        req.session.isAuthenticated = true;
        req.session.user = { username: user[0].username, id: user[0].id };

        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin password change endpoint
  app.post("/api/admin/change-password", requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user[0].password !== currentPassword) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      await db.update(users)
        .set({ password: newPassword })
        .where(eq(users.id, userId));

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Failed to logout" });
      } else {
        res.json({ success: true, message: "Logged out successfully" });
      }
    });
  });

  // Check authentication status
  app.get("/api/admin/status", (req, res) => {
    res.json({
      isAuthenticated: !!req.session?.isAuthenticated,
      user: req.session?.user || null
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
