"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSocialMediaPublicationSchema = exports.insertDonationSchema = exports.insertPostSchema = exports.insertUserSchema = exports.socialMediaPublicationsRelations = exports.donationsRelations = exports.postsRelations = exports.socialMediaPublications = exports.donations = exports.posts = exports.users = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var drizzle_orm_2 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedByDefaultAsIdentity(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.posts = (0, pg_core_1.pgTable)("posts", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedByDefaultAsIdentity(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    additionalImages: (0, pg_core_1.text)("additional_images").array().default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["'{}'"], ["'{}'"])))),
    date: (0, pg_core_1.timestamp)("date").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.donations = (0, pg_core_1.pgTable)("donations", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedByDefaultAsIdentity(),
    name: (0, pg_core_1.text)("name").notNull(),
    mobile: (0, pg_core_1.text)("mobile").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    amount: (0, pg_core_1.integer)("amount").notNull(),
    proofUrl: (0, pg_core_1.text)("proof_url"),
    status: (0, pg_core_1.text)("status").default("pending").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.socialMediaPublications = (0, pg_core_1.pgTable)("social_media_publications", {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedByDefaultAsIdentity(),
    title: (0, pg_core_1.text)("title").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    linkUrl: (0, pg_core_1.text)("link_url").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.postsRelations = (0, drizzle_orm_2.relations)(exports.posts, function (_a) {
    var many = _a.many;
    return ({
    // Add relations if needed
    });
});
exports.donationsRelations = (0, drizzle_orm_2.relations)(exports.donations, function (_a) {
    var many = _a.many;
    return ({
    // Add relations if needed
    });
});
exports.socialMediaPublicationsRelations = (0, drizzle_orm_2.relations)(exports.socialMediaPublications, function (_a) {
    var many = _a.many;
    return ({
    // Add relations if needed
    });
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
exports.insertPostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.posts).omit({
    id: true,
    createdAt: true,
});
exports.insertDonationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.donations).omit({
    id: true,
    createdAt: true,
    status: true,
});
exports.insertSocialMediaPublicationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.socialMediaPublications).omit({
    id: true,
    createdAt: true,
});
var templateObject_1;
