import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cn } from "./utils-aBt_XD6u.mjs";
import { n as dishImage, r as dishInitials } from "./dish-media-B9AD3N7z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dish-photo-zvl2UGa4.js
var import_jsx_runtime = require_jsx_runtime();
function DishPhoto({ imageKey, name, className }) {
	const src = dishImage(imageKey);
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: name,
		className: cn("h-full w-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid h-full w-full place-items-center bg-accent text-primary", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-2xl tracking-tight",
			children: dishInitials(name)
		})
	});
}
//#endregion
export { DishPhoto as t };
