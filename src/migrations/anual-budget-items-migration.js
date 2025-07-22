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
var client_1 = require("@prisma/client");
var dotenv = require("dotenv");
var path_1 = require("path");
// Load environment variables from the project root
dotenv.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv.config({ path: path_1.default.resolve(__dirname, '../../.env.local') });
// Verify DATABASE_URL is available
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Please make sure you have a .env file in your project root with DATABASE_URL');
    process.exit(1);
}
var prisma = new client_1.PrismaClient();
// Helper function to convert MongoDB date format to JavaScript Date
function convertMongoDate(mongoDate) {
    if (!mongoDate) {
        return new Date();
    }
    if (typeof mongoDate === 'object' && '$date' in mongoDate) {
        return new Date(mongoDate.$date);
    }
    if (mongoDate instanceof Date) {
        return mongoDate;
    }
    return new Date();
}
function migrateBudgetItems() {
    return __awaiter(this, void 0, void 0, function () {
        var rawBudgets, anualBudgets, totalBudgetItemsCreated, budgetsProcessed, _i, anualBudgets_1, budget, budgetItemsCreated, itemIndex, budgetItem, existingBudgetItem, newBudgetItem, totalBudgetItems, budgetsWithItems, totalEmbeddedItems, _a, anualBudgets_2, budget, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🚀 Starting Budget Items migration...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 15, , 16]);
                    // Step 1: Get all AnualBudgets with embedded budget items directly from MongoDB
                    console.log('📊 Fetching annual budgets with embedded items...');
                    return [4 /*yield*/, prisma.$runCommandRaw({
                            find: 'AnualBudget',
                            filter: {},
                        })];
                case 2:
                    rawBudgets = (_b.sent());
                    anualBudgets = rawBudgets.cursor.firstBatch;
                    console.log("Found ".concat(anualBudgets.length, " annual budgets to process"));
                    totalBudgetItemsCreated = 0;
                    budgetsProcessed = 0;
                    _i = 0, anualBudgets_1 = anualBudgets;
                    _b.label = 3;
                case 3:
                    if (!(_i < anualBudgets_1.length)) return [3 /*break*/, 12];
                    budget = anualBudgets_1[_i];
                    console.log("\n\uD83D\uDCCB Processing budget ".concat(budget._id.$oid, " (").concat(budgetsProcessed + 1, "/").concat(anualBudgets.length, ")"));
                    budgetItemsCreated = 0;
                    if (!(budget.budgetItems && budget.budgetItems.length > 0)) return [3 /*break*/, 9];
                    console.log("  \uD83D\uDCDD Processing ".concat(budget.budgetItems.length, " embedded budget items..."));
                    itemIndex = 0;
                    _b.label = 4;
                case 4:
                    if (!(itemIndex < budget.budgetItems.length)) return [3 /*break*/, 8];
                    budgetItem = budget.budgetItems[itemIndex];
                    console.log("    \uD83D\uDCB0 Processing budget item \"".concat(budgetItem.detail, "\" (type: ").concat(budgetItem.type, ")"));
                    return [4 /*yield*/, prisma.anualBudgetItem.findFirst({
                            where: {
                                anualBudgetId: budget._id.$oid,
                                type: budgetItem.type,
                                detail: budgetItem.detail,
                            },
                        })];
                case 5:
                    existingBudgetItem = _b.sent();
                    if (existingBudgetItem) {
                        console.log("      \u2139\uFE0F  Budget item already exists, skipping...");
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, prisma.anualBudgetItem.create({
                            data: {
                                type: budgetItem.type,
                                detail: budgetItem.detail,
                                amount: budgetItem.amount,
                                remaining: budgetItem.remaining,
                                amountIndex: budgetItem.amountIndex,
                                remainingIndex: budgetItem.remainingIndex,
                                anualBudgetId: budget._id.$oid,
                                createdAt: convertMongoDate(budget.createdAt),
                                updatedAt: convertMongoDate(budget.updatedAt),
                            },
                        })];
                case 6:
                    newBudgetItem = _b.sent();
                    console.log("      \u2705 Created AnualBudgetItem with ID: ".concat(newBudgetItem.id));
                    budgetItemsCreated++;
                    totalBudgetItemsCreated++;
                    _b.label = 7;
                case 7:
                    itemIndex++;
                    return [3 /*break*/, 4];
                case 8: return [3 /*break*/, 10];
                case 9:
                    console.log("  \uD83D\uDCDD No budget items found in this budget");
                    _b.label = 10;
                case 10:
                    console.log("  \u2705 Created ".concat(budgetItemsCreated, " budget items for budget ").concat(budget._id.$oid));
                    budgetsProcessed++;
                    _b.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 3];
                case 12:
                    console.log("\n\uD83C\uDF89 Budget Items migration completed successfully!");
                    console.log("\uD83D\uDCCA Summary:");
                    console.log("  - Budgets processed: ".concat(budgetsProcessed));
                    console.log("  - Total budget items created: ".concat(totalBudgetItemsCreated));
                    // Step 4: Verification
                    console.log("\n\uD83D\uDD0D Verifying migration...");
                    return [4 /*yield*/, prisma.anualBudgetItem.count()];
                case 13:
                    totalBudgetItems = _b.sent();
                    return [4 /*yield*/, prisma.anualBudget.count({
                            where: {
                                budgetItems: {
                                    some: {},
                                },
                            },
                        })];
                case 14:
                    budgetsWithItems = _b.sent();
                    console.log("  - Total AnualBudgetItem documents: ".concat(totalBudgetItems));
                    console.log("  - Budgets with separate budget items: ".concat(budgetsWithItems));
                    totalEmbeddedItems = 0;
                    for (_a = 0, anualBudgets_2 = anualBudgets; _a < anualBudgets_2.length; _a++) {
                        budget = anualBudgets_2[_a];
                        if (budget.budgetItems) {
                            totalEmbeddedItems += budget.budgetItems.length;
                        }
                    }
                    console.log("  - Total embedded items found: ".concat(totalEmbeddedItems));
                    if (totalBudgetItems >= totalBudgetItemsCreated) {
                        console.log("  \u2705 Migration successful: All budget items are now separate documents");
                    }
                    else {
                        console.log("  \u26A0\uFE0F  Warning: Some budget items may not have been migrated properly");
                    }
                    return [3 /*break*/, 16];
                case 15:
                    error_1 = _b.sent();
                    console.error('❌ Migration failed:', error_1);
                    throw error_1;
                case 16: return [2 /*return*/];
            }
        });
    });
}
function cleanupEmbeddedBudgetItems() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n🧹 Starting cleanup of embedded budget items...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Remove budgetItems arrays from AnualBudget documents
                    console.log('🗑️  Removing embedded budgetItems arrays from AnualBudget documents...');
                    return [4 /*yield*/, prisma.$runCommandRaw({
                            update: 'AnualBudget',
                            updates: [
                                {
                                    q: {},
                                    u: { $unset: { budgetItems: '' } },
                                    multi: true,
                                },
                            ],
                        })];
                case 2:
                    result = (_a.sent());
                    console.log("\u2705 Cleanup completed successfully! Modified ".concat(result.nModified || result.modifiedCount || 'unknown', " documents"));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Cleanup failed:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function rollbackBudgetItemsMigration() {
    return __awaiter(this, void 0, void 0, function () {
        var budgetItemCount, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Rolling back budget items migration...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, prisma.anualBudgetItem.count()];
                case 2:
                    budgetItemCount = _a.sent();
                    console.log("Found ".concat(budgetItemCount, " budget items to remove"));
                    if (!(budgetItemCount > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.anualBudgetItem.deleteMany({})];
                case 3:
                    _a.sent();
                    console.log('✅ All separate budget items removed successfully');
                    return [3 /*break*/, 5];
                case 4:
                    console.log('ℹ️  No separate budget items found to remove');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error('❌ Rollback failed:', error_3);
                    throw error_3;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function verifyBudgetItemsStructure() {
    return __awaiter(this, void 0, void 0, function () {
        var separateBudgetItems, totalBudgets, sampleBudget, hasEmbeddedItems, sampleItems, error_4;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🔍 Verifying budget items structure...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, prisma.anualBudgetItem.count()
                        // Count budgets
                    ];
                case 2:
                    separateBudgetItems = _d.sent();
                    return [4 /*yield*/, prisma.anualBudget.count()
                        // Get a sample budget to check for embedded items
                    ];
                case 3:
                    totalBudgets = _d.sent();
                    return [4 /*yield*/, prisma.$runCommandRaw({
                            find: 'AnualBudget',
                            filter: {},
                            limit: 1,
                        })];
                case 4:
                    sampleBudget = (_d.sent());
                    hasEmbeddedItems = ((_c = (_b = (_a = sampleBudget.cursor) === null || _a === void 0 ? void 0 : _a.firstBatch) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.budgetItems) !== undefined;
                    console.log("\uD83D\uDCCA Current structure:");
                    console.log("  - Total budgets: ".concat(totalBudgets));
                    console.log("  - Separate budget items: ".concat(separateBudgetItems));
                    console.log("  - Sample budget has embedded items: ".concat(hasEmbeddedItems));
                    if (!(separateBudgetItems > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.anualBudgetItem.findMany({
                            take: 3,
                            include: {
                                anualBudget: {
                                    select: {
                                        id: true,
                                        year: true,
                                        state: true,
                                    },
                                },
                            },
                        })];
                case 5:
                    sampleItems = _d.sent();
                    console.log("\n\uD83D\uDCDD Sample budget items:");
                    sampleItems.forEach(function (item, index) {
                        console.log("  ".concat(index + 1, ". \"").concat(item.detail, "\" (").concat(item.type, ") - Budget: ").concat(item.anualBudgetId));
                    });
                    _d.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_4 = _d.sent();
                    console.error('❌ Verification failed:', error_4);
                    throw error_4;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, command, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = process.argv.slice(2);
                    command = args[0];
                    _a = command;
                    switch (_a) {
                        case 'migrate': return [3 /*break*/, 1];
                        case 'cleanup': return [3 /*break*/, 3];
                        case 'migrate-and-cleanup': return [3 /*break*/, 5];
                        case 'rollback': return [3 /*break*/, 8];
                        case 'verify': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 1: return [4 /*yield*/, migrateBudgetItems()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, cleanupEmbeddedBudgetItems()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, migrateBudgetItems()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, cleanupEmbeddedBudgetItems()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 8: return [4 /*yield*/, rollbackBudgetItemsMigration()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 10: return [4 /*yield*/, verifyBudgetItemsStructure()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    console.log('Usage: node budget-items-migration.js [command]');
                    console.log('Commands:');
                    console.log('  migrate              - Migrate embedded budget items to separate documents');
                    console.log('  cleanup              - Remove embedded budgetItems arrays from AnualBudget');
                    console.log('  migrate-and-cleanup  - Run both migration and cleanup');
                    console.log('  rollback             - Remove all separate budget items (rollback)');
                    console.log('  verify               - Check current budget items structure');
                    console.log('');
                    console.log('Examples:');
                    console.log('  node budget-items-migration.js migrate     # Just migrate items');
                    console.log('  node budget-items-migration.js verify      # Check current state');
                    console.log('  node budget-items-migration.js cleanup     # Remove embedded arrays');
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('💥 Script failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
