module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/products/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$json$2e5b$json$5d2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.json.[json].mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.js [app-route] (ecmascript)");
;
;
;
const DEV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ek-admin-123';
const productStore = globalThis.__ekProductsStore ??= {
    data: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$json$2e5b$json$5d2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
};
function isAuthorized(request) {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return false;
    const expectedToken = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"])('sha256', DEV_ADMIN_PASSWORD).update('ek-products-admin').digest('hex');
    const actual = Buffer.from(token);
    const expected = Buffer.from(expectedToken);
    if (actual.length !== expected.length) return false;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(actual, expected);
}
async function GET() {
    const mongoProducts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readCollectionData"])('products', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$json$2e5b$json$5d2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]);
    const list = Array.isArray(mongoProducts) && mongoProducts.length ? mongoProducts : productStore.data;
    productStore.data = list;
    return Response.json(list);
}
async function PUT(request) {
    if (!isAuthorized(request)) {
        return Response.json({
            message: 'Unauthorized.'
        }, {
            status: 401
        });
    }
    try {
        const payload = await request.json();
        if (!Array.isArray(payload)) {
            return Response.json({
                message: 'Products must be an array.'
            }, {
                status: 400
            });
        }
        productStore.data = payload;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeCollectionData"])('products', payload);
        return Response.json({
            products: payload
        });
    } catch  {
        return Response.json({
            message: 'Invalid product data.'
        }, {
            status: 400
        });
    }
}
}),
"[project]/lib/mongodb.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "readCollectionData",
    ()=>readCollectionData,
    "writeCollectionData",
    ()=>writeCollectionData
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'ek_balloon_space';
const globalForMongo = globalThis;
const clientPromise = uri ? globalForMongo.__mongoClientPromise ??= new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__["MongoClient"](uri) : null;
async function connectToDatabase() {
    if (!uri || !clientPromise) {
        return {
            client: null,
            db: null,
            connected: false,
            reason: 'MONGODB_URI is not configured.'
        };
    }
    try {
        await clientPromise.connect();
        const db = clientPromise.db(dbName);
        return {
            client: clientPromise,
            db,
            connected: true,
            reason: null
        };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return {
            client: null,
            db: null,
            connected: false,
            reason: error.message
        };
    }
}
async function readCollectionData(collectionName, fallbackValue) {
    if (!uri) {
        return fallbackValue;
    }
    try {
        const { db } = await connectToDatabase();
        if (!db) return fallbackValue;
        const collection = db.collection(collectionName);
        const doc = await collection.findOne({
            name: collectionName
        });
        const data = doc?.data ?? fallbackValue;
        return Array.isArray(data) ? data : fallbackValue;
    } catch (error) {
        console.error(`Failed to read ${collectionName} from MongoDB:`, error);
        return fallbackValue;
    }
}
async function writeCollectionData(collectionName, data) {
    if (!uri) {
        return false;
    }
    try {
        const { db } = await connectToDatabase();
        if (!db) return false;
        const collection = db.collection(collectionName);
        await collection.updateOne({
            name: collectionName
        }, {
            $set: {
                name: collectionName,
                data,
                updatedAt: new Date()
            }
        }, {
            upsert: true
        });
        return true;
    } catch (error) {
        console.error(`Failed to write ${collectionName} to MongoDB:`, error);
        return false;
    }
}
}),
"[project]/src/data/products.json.[json].mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
"use turbopack no side effects";
const __TURBOPACK__default__export__ = [
    {
        "id": 1,
        "image": "/images/instagram-post-1.jpg",
        "title": "Customized Independence Day Balloon Decoration"
    },
    {
        "id": 2,
        "image": "/images/instagram-post-2.jpg",
        "title": "Exclusive Independence Day Office Decor"
    },
    {
        "id": 3,
        "image": "/images/instagram-post-7.jpg",
        "title": "Independence Day Balloon Arch Decoration"
    },
    {
        "id": 4,
        "image": "/images/instagram-post-4.jpg",
        "title": "Premium Party Decoration Set"
    },
    {
        "id": 5,
        "image": "/images/instagram-post-5.jpg",
        "title": "Festive Banner and Bunting"
    },
    {
        "id": 6,
        "image": "/images/instagram-post-6.jpg",
        "title": "LED String Lights Decoration"
    },
    {
        "id": 7,
        "image": "/images/instagram-post-8.jpg",
        "title": "Artificial Flower Garland Decoration"
    },
    {
        "id": 8,
        "image": "/images/instagram-post-2.jpg",
        "title": "Table Centerpiece Decoration Set"
    },
    {
        "id": 9,
        "image": "/images/instagram-post-3.jpg",
        "title": "Decorative Wall Hanging Backdrop"
    },
    {
        "id": 10,
        "image": "/images/instagram-post-1.jpg",
        "title": "Decorative Lantern Set with Lights"
    },
    {
        "id": 11,
        "image": "/images/instagram-post-5.jpg",
        "title": "Tissue Paper Pom Poms"
    },
    {
        "id": 12,
        "image": "/images/instagram-post-7.jpg",
        "title": "Metallic Foil Balloons Collection"
    }
];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04-nlra._.js.map