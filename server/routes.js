"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
var express_1 = require("express");
var express_session_1 = require("express-session");
var http_1 = require("http");
var storage_1 = require("./storage");
var schema_1 = require("@shared/schema");
var multer_1 = require("multer");
var path_1 = require("path");
var fs_1 = require("fs");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
// Configure multer for file uploads
var uploadDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
var upload = (0, multer_1.default)({
    dest: uploadDir,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        var allowedTypes = /jpeg|jpg|png|gif|pdf/;
        var extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        var mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed."));
        }
    },
});
// Authentication middleware
// This ensures only authenticated admin users can access protected endpoints
var requireAuth = function (req, res, next) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated) {
        next();
    }
    else {
        res.status(401).json({ message: "Authentication required" });
    }
};
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Configure session middleware
            app.use((0, express_session_1.default)({
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
            app.get("/api/posts", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var posts, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getPosts()];
                        case 1:
                            posts = _a.sent();
                            res.json(posts);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch posts" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can create posts
            app.post("/api/posts", requireAuth, // Add authentication middleware
            upload.fields([
                { name: "coverImage", maxCount: 1 },
                { name: "additionalImages", maxCount: 10 },
            ]), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var files, additionalImageUrls, validatedData, post, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            files = req.files;
                            additionalImageUrls = files.additionalImages
                                ? files.additionalImages.map(function (file) { return "/uploads/".concat(file.filename); })
                                : [];
                            validatedData = schema_1.insertPostSchema.parse(__assign(__assign({}, req.body), { date: new Date(req.body.date), coverImageUrl: ((_a = files.coverImage) === null || _a === void 0 ? void 0 : _a[0])
                                    ? "/uploads/".concat(files.coverImage[0].filename)
                                    : null, additionalImages: additionalImageUrls.length > 0 ? additionalImageUrls : null }));
                            return [4 /*yield*/, storage_1.storage.createPost(validatedData)];
                        case 1:
                            post = _b.sent();
                            res.status(201).json(post);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _b.sent();
                            if (error_2 instanceof Error) {
                                res.status(400).json({ message: error_2.message });
                            }
                            else {
                                res.status(500).json({ message: "Failed to create post" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can update posts
            app.put("/api/posts/:id", requireAuth, // Add authentication middleware
            upload.fields([
                { name: "coverImage", maxCount: 1 },
                { name: "additionalImages", maxCount: 10 },
            ]), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, files, existingPost, updateData_1, newAdditionalImages, post, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            id = parseInt(req.params.id);
                            files = req.files;
                            return [4 /*yield*/, storage_1.storage.getPost(id)];
                        case 1:
                            existingPost = _b.sent();
                            if (!existingPost) {
                                return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                            }
                            updateData_1 = __assign(__assign({}, req.body), { date: req.body.date ? new Date(req.body.date) : undefined });
                            // Only update cover image if new one is uploaded, otherwise preserve existing
                            if ((_a = files.coverImage) === null || _a === void 0 ? void 0 : _a[0]) {
                                updateData_1.coverImageUrl = "/uploads/".concat(files.coverImage[0].filename);
                            }
                            else {
                                updateData_1.coverImageUrl = existingPost.coverImageUrl;
                            }
                            // Only update additional images if new ones are uploaded, otherwise preserve existing
                            if (files.additionalImages && files.additionalImages.length > 0) {
                                newAdditionalImages = files.additionalImages.map(function (file) { return "/uploads/".concat(file.filename); });
                                updateData_1.additionalImages = newAdditionalImages;
                            }
                            else {
                                updateData_1.additionalImages = existingPost.additionalImages;
                            }
                            // Remove undefined values
                            Object.keys(updateData_1).forEach(function (key) {
                                if (updateData_1[key] === undefined) {
                                    delete updateData_1[key];
                                }
                            });
                            return [4 /*yield*/, storage_1.storage.updatePost(id, updateData_1)];
                        case 2:
                            post = _b.sent();
                            if (!post) {
                                return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                            }
                            res.json(post);
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _b.sent();
                            if (error_3 instanceof Error) {
                                res.status(400).json({ message: error_3.message });
                            }
                            else {
                                res.status(500).json({ message: "Failed to update post" });
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can delete posts  
            app.delete("/api/posts/:id", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, success, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.deletePost(id)];
                        case 1:
                            success = _a.sent();
                            if (!success) {
                                return [2 /*return*/, res.status(404).json({ message: "Post not found" })];
                            }
                            res.json({ message: "Post deleted successfully" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            res.status(500).json({ message: "Failed to delete post" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Donations routes
            app.post("/api/donations", upload.single("proof"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, donation, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = schema_1.insertDonationSchema.parse(__assign(__assign({}, req.body), { amount: parseInt(req.body.amount), proofUrl: req.file ? "/uploads/".concat(req.file.filename) : null }));
                            return [4 /*yield*/, storage_1.storage.createDonation(validatedData)];
                        case 1:
                            donation = _a.sent();
                            res.status(201).json(donation);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            if (error_5 instanceof Error) {
                                res.status(400).json({ message: error_5.message });
                            }
                            else {
                                res.status(500).json({ message: "Failed to submit donation form" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can view all donations
            app.get("/api/donations", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var donations, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getDonations()];
                        case 1:
                            donations = _a.sent();
                            res.json(donations);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch donations" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can update donation status
            app.put("/api/donations/:id/status", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, status_1, donation, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            status_1 = req.body.status;
                            if (!["pending", "approved", "rejected"].includes(status_1)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid status" })];
                            }
                            return [4 /*yield*/, storage_1.storage.updateDonationStatus(id, status_1)];
                        case 1:
                            donation = _a.sent();
                            if (!donation) {
                                return [2 /*return*/, res.status(404).json({ message: "Donation not found" })];
                            }
                            res.json(donation);
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            res.status(500).json({ message: "Failed to update donation status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Serve uploaded files
            app.use("/uploads", express_1.default.static(uploadDir));
            // Social Media Publications routes
            app.get("/api/social-media-publications", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var publications, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage_1.storage.getSocialMediaPublications()];
                        case 1:
                            publications = _a.sent();
                            res.json(publications);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch social media publications" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can create social media publications
            app.post("/api/social-media-publications", requireAuth, upload.single("image"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, publication, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!req.file) {
                                return [2 /*return*/, res.status(400).json({ message: "Image is required" })];
                            }
                            validatedData = schema_1.insertSocialMediaPublicationSchema.parse(__assign(__assign({}, req.body), { imageUrl: "/uploads/".concat(req.file.filename) }));
                            return [4 /*yield*/, storage_1.storage.createSocialMediaPublication(validatedData)];
                        case 1:
                            publication = _a.sent();
                            res.status(201).json(publication);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            console.error("Error creating social media publication:", error_9);
                            if (error_9 instanceof Error) {
                                res.status(400).json({ message: error_9.message });
                            }
                            else {
                                res.status(500).json({ message: "Failed to create social media publication" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can update social media publications
            app.put("/api/social-media-publications/:id", requireAuth, upload.single("image"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id_1, existingPublication, current, updateData, publication, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            id_1 = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.getSocialMediaPublications()];
                        case 1:
                            existingPublication = _a.sent();
                            current = existingPublication.find(function (p) { return p.id === id_1; });
                            if (!current) {
                                return [2 /*return*/, res.status(404).json({ message: "Publication not found" })];
                            }
                            updateData = __assign(__assign({}, req.body), { imageUrl: req.file ? "/uploads/".concat(req.file.filename) : current.imageUrl });
                            return [4 /*yield*/, storage_1.storage.updateSocialMediaPublication(id_1, updateData)];
                        case 2:
                            publication = _a.sent();
                            if (!publication) {
                                return [2 /*return*/, res.status(404).json({ message: "Publication not found" })];
                            }
                            res.json(publication);
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _a.sent();
                            if (error_10 instanceof Error) {
                                res.status(400).json({ message: error_10.message });
                            }
                            else {
                                res.status(500).json({ message: "Failed to update social media publication" });
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // PROTECTED: Only authenticated admins can delete social media publications
            app.delete("/api/social-media-publications/:id", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, success, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage_1.storage.deleteSocialMediaPublication(id)];
                        case 1:
                            success = _a.sent();
                            if (!success) {
                                return [2 /*return*/, res.status(404).json({ message: "Publication not found" })];
                            }
                            res.json({ message: "Social media publication deleted successfully" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            res.status(500).json({ message: "Failed to delete social media publication" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Admin authentication endpoint
            app.post("/api/admin/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, username, password, user, error_12;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = req.body, username = _a.username, password = _a.password;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username)).limit(1)];
                        case 2:
                            user = _b.sent();
                            if (user.length > 0 && user[0].password === password) {
                                // Set session
                                req.session.isAuthenticated = true;
                                req.session.user = { username: user[0].username, id: user[0].id };
                                res.json({ success: true, message: "Login successful" });
                            }
                            else {
                                res.status(401).json({ success: false, message: "Invalid credentials" });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_12 = _b.sent();
                            console.error("Login error:", error_12);
                            res.status(500).json({ success: false, message: "Internal server error" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Admin password change endpoint
            app.post("/api/admin/change-password", requireAuth, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, currentPassword, newPassword, userId, user, error_13;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                            userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
                            if (!userId) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1)];
                        case 2:
                            user = _c.sent();
                            if (user.length === 0) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            if (user[0].password !== currentPassword) {
                                return [2 /*return*/, res.status(400).json({ message: "Incorrect current password" })];
                            }
                            return [4 /*yield*/, db_1.db.update(schema_1.users)
                                    .set({ password: newPassword })
                                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))];
                        case 3:
                            _c.sent();
                            res.json({ success: true, message: "Password updated successfully" });
                            return [3 /*break*/, 5];
                        case 4:
                            error_13 = _c.sent();
                            console.error("Password change error:", error_13);
                            res.status(500).json({ message: "Failed to update password" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Admin logout endpoint
            app.post("/api/admin/logout", function (req, res) {
                req.session.destroy(function (err) {
                    if (err) {
                        res.status(500).json({ message: "Failed to logout" });
                    }
                    else {
                        res.json({ success: true, message: "Logged out successfully" });
                    }
                });
            });
            // Check authentication status
            app.get("/api/admin/status", function (req, res) {
                var _a, _b;
                res.json({
                    isAuthenticated: !!((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated),
                    user: ((_b = req.session) === null || _b === void 0 ? void 0 : _b.user) || null
                });
            });
            httpServer = (0, http_1.createServer)(app);
            return [2 /*return*/, httpServer];
        });
    });
}
