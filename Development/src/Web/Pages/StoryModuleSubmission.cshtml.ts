/// <reference types="./StoryModuleSubmission.cshtml" />

class StoryModuleSubmission {
    //#region Urls

    private readonly _urlGetAuthorsModules: string = Utilities.Controller() + "AuthorsModules";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divStoryModuleSubmissionContainer') as HTMLDivElement;
    private readonly divAuthorsModulesPanel = this._container.querySelector('#divAuthorsModulesPanel') as HTMLDivElement;

    //#endregion


    //#region Init

    public static Init() {
        new StoryModuleSubmission().Init();
    }

    private Init(): void {
        this.ServerRequest_GetAuthorsModules();
    }

    //#endregion


    //#region GetAuthorsModules

    private async ServerRequest_GetAuthorsModules(): Promise<void> {
        //get author from local storage
        const authorData: AuthorDTO = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_Author);

        const response: Response = await fetch(`${this._urlGetAuthorsModules}&author=${authorData.Author}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as AuthorsModulesDTO;
            this.ServerRequestDone_GetAuthorsModules(dataFromServer.AuthorsModules);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }

    }

    private ServerRequestDone_GetAuthorsModules(authorsModules: AuthorsModuleDTO[]): void {
        //clear loading panel
        this.divAuthorsModulesPanel.innerHTML = "";

        //show message when no module have been returned
        if (authorsModules.length === 0) {
            const alertMsg = Utilities.Alert({ Message: '<i class="fa-solid fa-ban fw-bold"></i> No story modules found', Format: "Default", Type: "info", AdditionalClasses: 'lyt-box-shadow fs-5 fw-bold', OverrideWidthToMax: true });
            this.divAuthorsModulesPanel.appendChild(alertMsg);
            return;
        }

        authorsModules.forEach((module: AuthorsModuleDTO) => {
            const modulePanel = this.RenderEditModulePanel(module);
            this.divAuthorsModulesPanel.appendChild(modulePanel);
        });
    }

    private RenderEditModulePanel(data: AuthorsModuleDTO): HTMLDivElement {
        const editModulePanelEl = _Layout.ElementTemplates().querySelector('#gp-divEditModulePanel').cloneNode(true) as HTMLDivElement;
        editModulePanelEl.removeAttribute("id");

        const divModulePosition = editModulePanelEl.querySelector("#divModulePosition") as HTMLParagraphElement;
        divModulePosition.removeAttribute("id");
        divModulePosition.textContent = data.ModulePosition;

        const divModuleContent = editModulePanelEl.querySelector("#divModuleContent") as HTMLParagraphElement;
        divModuleContent.removeAttribute("id");
        divModuleContent.textContent = data.ModuleContent;

        //const btnModule = editModulePanelEl.querySelector("#btnModule") as HTMLButtonElement;
        //btnModule.removeAttribute("id");
        //btnModule.onclick = (ev: MouseEvent) => {
        //    this.DisableAllModuleOptionButtons(ev.target as HTMLElement);
        //    window.location.href = `StoryModule?selected=${data.ModuleId}`;
        //};

        return editModulePanelEl;
    }


    //#endregion
}