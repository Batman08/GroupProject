/// <reference types="./StoryModuleSubmission.cshtml" />

class StoryModuleSubmission {
    //#region Urls

    private readonly _urlGetAuthorsModules: string = Utilities.Controller() + "AuthorsModules";
    private readonly _urlCreateModule: string = Utilities.Controller() + "CreateModule";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divStoryModuleSubmissionContainer') as HTMLDivElement;
    private readonly divCreateModuleResultPanel = this._container.querySelector('#divCreateModuleResultPanel') as HTMLDivElement;
    private readonly divEditModuleResultPanel = this._container.querySelector('#divEditModuleResultPanel') as HTMLDivElement;
    private readonly divAuthorsModulesPanel = this._container.querySelector('#divAuthorsModulesPanel') as HTMLDivElement;
    private readonly formCreateModule = this._container.querySelector('#formCreateModule') as HTMLFormElement;
    private readonly formBtnSubmit = this.formCreateModule.querySelector('[type="submit"]') as HTMLButtonElement;
    private readonly divModuleChoices = this.formCreateModule.querySelector('#divModuleChoices') as HTMLDivElement;
    private readonly inputModulePosition = this.formCreateModule.querySelector('#inputModulePosition') as HTMLSelectElement;

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
        this.ConsumeEvent_ModuleUpdatedSuccess();


        this.formCreateModule.onsubmit = async (ev: SubmitEvent) => await this.ServerRequest_CreateModule(ev);
        this.inputModulePosition.onchange = (ev: Event) => this.OnChange_UpdateFormForModulePosition(ev);
    }

    private ConsumeEvent_ModuleUpdatedSuccess(): void {
        const eventType: ModuleUpdatedSuccessEventType = "gp_event_UpdateModuleSuccess";
        document.addEventListener(eventType, (ev: CustomEvent) => {
            const detail: ModuleUpdatedSuccessEvent = ev.detail;

            //show alert message
            const alertMsg = Utilities.Alert({ Message: '<i class="fa-solid fa-check fw-bold"></i> Updated successfully', Format: "Default", Type: "success", AdditionalClasses: 'lyt-box-shadow fs-5 fw-bold', OverrideWidthToMax: true, IsDismissable: true });
            this.divEditModuleResultPanel.appendChild(alertMsg);

            //find module in list and update it
            const modulePanel = this.divAuthorsModulesPanel.querySelector(`[moduleId="${detail.ModuleData.ModuleId}"]`);
            if (modulePanel) {
                const modulePosition = modulePanel.querySelector("div[modulePosition]") as HTMLParagraphElement;
                modulePosition.textContent = detail.ModuleData.ModulePosition;

                const moduleContent = modulePanel.querySelector("div[moduleContent]") as HTMLParagraphElement;
                moduleContent.textContent = detail.ModuleData.ModuleContent;
            }

            //hide modal
            detail.EditModal.hide();
        });
    }

    private OnChange_UpdateFormForModulePosition(ev: Event): void {
        const selectedOption: string = this.inputModulePosition.options[this.inputModulePosition.selectedIndex].text;
        const inputs = this.divModuleChoices.querySelectorAll('.form-control') as NodeListOf<HTMLInputElement>;
        if (selectedOption === "Middle") {
            this.divModuleChoices.style.display = "block";
            inputs.forEach((input: HTMLInputElement) => input.required = true);
        }
        else {
            this.divModuleChoices.style.display = "none";
            inputs.forEach((input: HTMLInputElement) => input.required = false);
        }
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
        editModulePanelEl.setAttribute("moduleId", data.ModuleId.toString());

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

        const formData: FormData = new FormData(this.formCreateModule);
        const modulePositionKeywordId: number = parseInt(formData.get("ModulePosition") as string);
        const modulePositionKeywordName: string = (this.inputModulePosition.querySelector(`option[value="${modulePositionKeywordId}"]`) as HTMLOptionElement).textContent;

        let dataToServer: CreateModuleDTO = {
            Content: formData.get("ModuleContent") as string,
            PassChoiceText: modulePositionKeywordName === 'Middle' ? formData.get("PassChoiceText") as string : null,
            PassChoiceResult: modulePositionKeywordName === 'Middle' ? formData.get("PassChoiceResult") as string : null,
            FailChoiceText: modulePositionKeywordName === 'Middle' ? formData.get("FailChoiceText") as string : null,
            FailChoiceResult: modulePositionKeywordName === 'Middle' ? formData.get("FailChoiceResult") as string : null,
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

        if (dataToServer.Keywords.length <= 1) {
            alert("Please select at least one Story Module keyword");
            return;
        }

        Utilities.DisableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating...';

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

        //remove no modules found message if it exists
        const noModulesFoundMsg = this.divAuthorsModulesPanel.querySelector('.alert');
        if (noModulesFoundMsg) noModulesFoundMsg.remove();

        //show alert message
        const alertMsg = Utilities.Alert({ Message: '<i class="fa-solid fa-check fw-bold"></i> Created successfully', Format: "Default", Type: "success", AdditionalClasses: 'lyt-box-shadow fs-5 fw-bold', OverrideWidthToMax: true, IsDismissable: true });
        this.divCreateModuleResultPanel.appendChild(alertMsg);

        //display new edit panel at the top
        const editModulePanel = this.RenderEditModulePanel(data.Data);
        this.divAuthorsModulesPanel.prepend(editModulePanel);

    }

    //#endregion
}