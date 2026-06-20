import { App, ButtonComponent, Modal, Setting } from "obsidian";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class IgnoreFolderModal extends Modal {
    private folder = "";

    constructor(
        app: App,
        private onSubmit: (folder: string) => Promise<void> | void,
    ) {
        super(app);
    }

    onOpen() {
        this.setTitle(this.t("Add exclusion"));
        const { contentEl } = this;

        this.modalEl.addClass("templater-ignore-folder-modal");

        const folderSetting = new Setting(contentEl)
            .setName(this.t("Folder"))
             
            .setDesc(this.t("Enter a path, e.g. meta/templates"))
            .addText((cb) => {
                new FolderSuggest(this.app, cb.inputEl);
                cb.onChange((value) => {
                    this.folder = value;
                });
            });

        const buttonContainer = contentEl.createDiv("modal-button-container");
        new ButtonComponent(buttonContainer)
            .setButtonText(this.t("Done"))
            .setCta()
            .onClick(async () => {
                if (!this.folder) {
                    folderSetting.setErrorMessage(this.t("Folder cannot be empty"));
                    return;
                }
                await this.onSubmit(this.folder);
                this.close();
            });
        new ButtonComponent(buttonContainer)
            .setButtonText(this.t("Cancel"))
            .onClick(() => this.close());
    }

    onClose() {
        this.contentEl.empty();
    }
}
