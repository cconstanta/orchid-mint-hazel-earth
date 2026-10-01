import "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cn } from "./utils-aBt_XD6u.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-sm font-medium text-foreground", className),
		...props
	});
}
//#endregion
export { Label as t };
