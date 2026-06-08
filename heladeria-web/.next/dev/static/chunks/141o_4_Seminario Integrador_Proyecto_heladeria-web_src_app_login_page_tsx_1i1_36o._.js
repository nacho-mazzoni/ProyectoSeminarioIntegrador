(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function LoginPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (authError) {
            setError(authError.message);
            return;
        }
        router.push("/");
        router.refresh();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-md mx-auto mt-16 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Iniciar Sesión"
            }, void 0, false, {
                fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "flex flex-col gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "email",
                        placeholder: "Email",
                        value: email,
                        onChange: (e)=>setEmail(e.target.value),
                        required: true,
                        className: "border rounded px-3 py-2"
                    }, void 0, false, {
                        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "password",
                        placeholder: "Contraseña",
                        value: password,
                        onChange: (e)=>setPassword(e.target.value),
                        required: true,
                        className: "border rounded px-3 py-2"
                    }, void 0, false, {
                        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600 text-sm",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                        lineNumber: 54,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "bg-amber-500 text-white py-2 rounded hover:bg-amber-600",
                        children: "Ingresar"
                    }, void 0, false, {
                        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-sm text-center",
                children: [
                    "¿No tenés cuenta?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/registro",
                        className: "text-amber-600 underline",
                        children: "Registrate"
                    }, void 0, false, {
                        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Escritorio/UTN/4/Seminario Integrador/Proyecto/heladeria-web/src/app/login/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "SxziYJeiDG1MMEe40IKGXz7ABR8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Escritorio$2f$UTN$2f$4$2f$Seminario__Integrador$2f$Proyecto$2f$heladeria$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=141o_4_Seminario%20Integrador_Proyecto_heladeria-web_src_app_login_page_tsx_1i1_36o._.js.map