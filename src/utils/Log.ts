import { Notice } from "obsidian";
import { TemplaterError } from "./Error";

export function log_update(
    msg: string,
    t?: (key: string, params?: Record<string, string | number>) => string,
): void {
    const _t = t || ((key: string) => key);
    const notice = new Notice("", 15000);
    const messageEl = createFragment((frag) => {
        frag.createEl("b", { text: _t("Templater update") });
        frag.createSpan({ text: ":" });
        frag.createEl("br");
        frag.createSpan({ text: msg });
    });
    notice.messageEl.appendChild(messageEl);
}

export function log_error(
    e: Error | TemplaterError,
    t?: (key: string, params?: Record<string, string | number>) => string,
): void {
    const _t = t || ((key: string) => key);
    const notice = new Notice("", 8000);
    const messageEl = createFragment((frag) => {
        frag.createEl("b", { text: _t("Templater error") });
        frag.createSpan({ text: ":" });
        frag.createEl("br");
        frag.createSpan({ text: e.message });
        if (e instanceof TemplaterError && e.console_msg) {
            frag.createEl("br");
            frag.createSpan({
                text: _t("Check console for more information"),
            });
            console.error(`Templater Error:`, e.message, "\n", e.console_msg);
        }
    });
    notice.messageEl.appendChild(messageEl);
}
