﻿/// <reference types="./StoryModuleSubmission.cshtml" />

class StoryModuleSubmission {
    //#region Urls

    private readonly _urlGetAuthorsModules: string = Utilities.Controller() + "AuthorsModules";
    private readonly _urlCreateModule: string = Utilities.Controller() + "CreateModule";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divStoryModuleSubmissionContainer') as HTMLDivElement;
    private readonly divAuthorsModulesPanel = this._container.querySelector('#divAuthorsModulesPanel') as HTMLDivElement;
    private readonly formCreateModule = this._container.querySelector('#formCreateModule') as HTMLFormElement;
    private readonly formBtnSubmit = this.formCreateModule.querySelector('[type="submit"]') as HTMLButtonElement;
    private readonly inputModulePosition = this.formCreateModule.querySelector('#inputModulePosition') as HTMLFormElement;

    //#endregion


    //#region Init

    public static Init() {
        new StoryModuleSubmission().Init();
    }

    private Init(): void {
        this.BindEvents();
        this.ServerRequest_GetAuthorsModules();
    }

    //#endregion


    //#region Events

    private BindEvents(): void {
        this.formCreateModule.onsubmit = async (ev: SubmitEvent) => await this.ServerRequest_CreateModule(ev);
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

        const btnEditModule = editModulePanelEl.querySelector("#btnEditModule") as HTMLButtonElement;
        btnEditModule.removeAttribute("id");
        btnEditModule.onclick = (ev: MouseEvent) => {
            this.DispatchEvent_EditModule(ev, data.ModuleId);
        };

        return editModulePanelEl;
    }

    private DispatchEvent_EditModule(ev: MouseEvent, moduleId: number): void {
        const eventType: EditModuleEventType = "gp_event_EditModule";
        const eventData: EditModuleEvent = { ModuleId: moduleId };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }

    //#endregion


    //#region CreateModule

    private async ServerRequest_CreateModule(ev: SubmitEvent): Promise<void> {
        ev.preventDefault();

        Utilities.DisableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating...';

        const formData: FormData = new FormData(this.formCreateModule);
        const modulePositionKeywordId: number = parseInt(formData.get("ModulePosition") as string);
        const modulePositionKeywordName: string = (this.inputModulePosition.querySelector(`option[value="${modulePositionKeywordId}"]`) as HTMLOptionElement).textContent;

        let dataToServer: CreateModuleDTO = {
            Content: formData.get("ModuleContent") as string,
            PassChoiceText: formData.get("PassChoiceText") as string,
            PassChoiceResult: formData.get("PassChoiceResult") as string,
            FailChoiceText: formData.get("FailChoiceText") as string,
            FailChoiceResult: formData.get("FailChoiceResult") as string,
            Author: Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_Author).Author,
            ModuleStatusTypeId: 2, //hardcode publish status
            Keywords: [],
            ModulePosition: modulePositionKeywordName
        };

        //get keywords from selected checkboxes
        let selectedKeywords: HTMLInputElement[] = Array.from(this.formCreateModule.querySelector('#divKeywordsInputs').querySelectorAll('input[type="checkbox"]:checked'));
        selectedKeywords = selectedKeywords.map((el: HTMLInputElement) => el);

        //get keyword ids and add module position keyword id to the start of the array
        let keywordIds: number[] = selectedKeywords.map((el: HTMLInputElement) => parseInt(el.value));
        keywordIds.unshift(modulePositionKeywordId);

        //add keyword ids to dataToServer
        dataToServer.Keywords = keywordIds;

        const response: Response = await fetch(this._urlCreateModule, {
            method: 'POST',
            headers: {
                'XSRF-TOKEN': Utilities.GetVerficationToken(this.formCreateModule),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToServer)
        });

        if (response.ok) {
            const dataFromServer = await response.json() as ResponseDTO<AuthorsModuleDTO>;
            this.ServerRequestDone_CreateModule(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_CreateModule(data: ResponseDTO<AuthorsModuleDTO>): void {
        Utilities.EnableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-plus"></i> Create';

        if (data.Error) {
            alert(data.Message);
            return;
        }

        //display new edit panel at the top
        const editModulePanel = this.RenderEditModulePanel(data.Data);
        this.divAuthorsModulesPanel.prepend(editModulePanel);
    }

    //#endregion
}