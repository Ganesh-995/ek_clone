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
"[project]/app/api/themes/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$themes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/themes.js [app-route] (ecmascript)");
;
;
const DEV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ek-admin-123';
const themeStore = globalThis.__ekThemesStore ??= {
    data: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$themes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["themeCards"]
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
    return Response.json(themeStore.data);
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
                message: 'Themes must be an array.'
            }, {
                status: 400
            });
        }
        themeStore.data = payload;
        return Response.json({
            themes: payload
        });
    } catch  {
        return Response.json({
            message: 'Invalid theme data.'
        }, {
            status: 400
        });
    }
}
}),
"[project]/src/data/themes.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "themeCards",
    ()=>themeCards
]);
const themeCards = [
    {
        id: 'celebrate-in-color',
        title: 'Celebrate in Color',
        detail: 'Bright balloons, banners and playful table details for joyful parties.',
        productIds: [
            1,
            3,
            4
        ]
    },
    {
        id: 'elegant-evening',
        title: 'Elegant Evening',
        detail: 'Warm lights, floral touches and refined accents for memorable evenings.',
        productIds: [
            6,
            7,
            10
        ]
    }
];
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04h18s6._.js.map