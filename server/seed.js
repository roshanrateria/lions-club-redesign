"use strict";
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
require("dotenv/config");
var db_1 = require("./db");
var schema_1 = require("@shared/schema");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    console.log("🌱 Seeding database...");
                    // Clear existing data
                    return [4 /*yield*/, db_1.db.delete(schema_1.socialMediaPublications)];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(schema_1.donations)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(schema_1.posts)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.db.delete(schema_1.users)];
                case 4:
                    _a.sent();
                    // Seed admin user
                    return [4 /*yield*/, db_1.db.insert(schema_1.users).values([
                            {
                                username: "admin",
                                password: "admin123", // In production, this should be hashed
                            },
                        ])];
                case 5:
                    // Seed admin user
                    _a.sent();
                    // Seed sample posts
                    return [4 /*yield*/, db_1.db.insert(schema_1.posts).values([
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
                        ])];
                case 6:
                    // Seed sample posts
                    _a.sent();
                    // Seed sample donations
                    return [4 /*yield*/, db_1.db.insert(schema_1.donations).values([
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
                        ])];
                case 7:
                    // Seed sample donations
                    _a.sent();
                    // Seed sample social media publications
                    return [4 /*yield*/, db_1.db.insert(schema_1.socialMediaPublications).values([
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
                        ])];
                case 8:
                    // Seed sample social media publications
                    _a.sent();
                    console.log("✅ Database seeded successfully!");
                    console.log("📝 Sample data created:");
                    console.log("   - Admin user: admin/admin123");
                    console.log("   - 3 sample posts");
                    console.log("   - 2 sample donations");
                    console.log("   - 4 sample social media publications");
                    process.exit(0);
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error("❌ Error seeding database:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
seed();
