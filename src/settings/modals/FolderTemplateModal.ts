import { App, Modal, Setting } from "obsidian";
import TemplaterPlugin from "main";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";
import {
    FileSuggest,
    FileSuggestMode,
} from "settings/suggesters/FileSuggester";

export class FolderTemplateModal extends Modal {
    private folder: string;
    private template: string;

    constructor(
        app: App,
        private plugin: TemplaterPlugin,
        initialValues: { folder: string; template: string },
        private onSubmit: (
            folder: string,
            template: string,
        ) => Promise<void> | void,
        private validateFolder: (folder: string) => string | undefined,
    ) {
        super(app);
        this.folder = initialValues.folder;
        this.template = initialValues.template;
    }

    onOpen() {
        this.setTitle(this.plugin.t("Folder template"));
        this.modalEl.addClass("templater-folder-template-modal");
        const { contentEl } = this;

        const folderSetting = new Setting(contentEl)
            .setName(this.plugin.t("Folder"))
            .setDesc(this.plugin.t("Folder to match on. Includes subfolders of this folder."))
            .addText((cb) => {
                new FolderSuggest(this.app, cb.inputEl);
                cb.setPlaceholder(this.plugin.t("Folder"))
                    .setValue(this.folder)
                    .onChange((value) => {
                        this.folder = value;
                    });
            });

        const templateSetting = new Setting(contentEl)
            .setName(this.plugin.t("Template"))
            .setDesc(this.plugin.t("Template to apply on match."))
            .addText((cb) => {
                new FileSuggest(
                    cb.inputEl,
                    this.plugin,
                    FileSuggestMode.TemplateFiles,
                );
                cb.setPlaceholder(this.plugin.t("Template"))
                    .setValue(this.template)
                    .onChange((value) => {
                        this.template = value;
                    });
            });

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText(this.plugin.t("Done"))
                    .setCta()
                    .onClick(async () => {
                        if (!this.folder) {
                            folderSetting.setErrorMessage(
                                this.plugin.t("Folder cannot be empty"),
                            );
                            return;
                        }
                        if (!this.template) {
                            templateSetting.setErrorMessage(
                                this.plugin.t("Template cannot be empty"),
                            );
                            return;
                        }
                        const error = this.validateFolder(this.folder);
                        if (error) {
                            folderSetting.setErrorMessage(error);
                            return;
                        }
                        await this.onSubmit(this.folder, this.template);
                        this.close();
                    }),
            )
            .addButton((btn) =>
                btn.setButtonText(this.plugin.t("Cancel")).onClick(() => this.close()),
            );
    }

    onClose() {
        this.contentEl.empty();
    }
}
