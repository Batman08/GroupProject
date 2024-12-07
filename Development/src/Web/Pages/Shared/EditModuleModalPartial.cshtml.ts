/// <reference types="./EditModuleModalPartial.cshtml" />

class EditModuleModal {
    //#region Urls

    private readonly _urlGetEditModalModuleData: string = Utilities.Controller() + "EditModalModuleData";
    private readonly _urlUpdateModuleData: string = Utilities.Controller() + "UpdateModuleData";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divEditModuleModalContainer') as HTMLDivElement;
    private readonly divEditModuleModal = this._container.querySelector('#divEditModuleModal') as HTMLDivElement;
    private readonly editModuleModal: bootstrap.Modal = new bootstrap.Modal(this.divEditModuleModal);
    private readonly divLoadingPanel = this._container.querySelector('#divLoadingPanel') as HTMLDivElement;
    private readonly divFormInputsPanel = this._container.querySelector('#divFormInputsPanel') as HTMLDivElement;

    private readonly formEditModule = this._container.querySelector('#formEditModule') as HTMLFormElement;
    private readonly formBtnSubmit = this.formEditModule.querySelector('[type="submit"]') as HTMLButtonElement;
    private readonly inputModuleContent = this.formEditModule.querySelector('#inputModuleContent') as HTMLInputElement;
    private readonly divModuleChoices = this.formEditModule.querySelector('#divModuleChoices') as HTMLDivElement;
    private readonly inputPassChoiceText = this.formEditModule.querySelector('#inputPassChoiceText') as HTMLInputElement;
    private readonly inputFailChoiceText = this.formEditModule.querySelector('#inputFailChoiceText') as HTMLInputElement;
    private readonly inputPassChoiceResult = this.formEditModule.querySelector('#inputPassChoiceResult') as HTMLInputElement;
    private readonly inputFailChoiceResult = this.formEditModule.querySelector('#inputFailChoiceResult') as HTMLInputElement;
    private readonly inputModulePosition = this.formEditModule.querySelector('#inputModulePosition') as HTMLSelectElement;
    private readonly inputsKeywords = this.formEditModule.querySelector('#divKeywordsInputs').querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    //#endregion


    //#region Init

    public static Init(): void {
        new EditModuleModal().Init();
    }

    private Init(): void {
        this.Events();
    }

    //#endregion


    //#region Events

    private Events(): void {
        this.ConsumeEvent_EditModule();

        this.inputModulePosition.onchange = (ev: Event) => this.OnChange_UpdateFormForModulePosition(ev);
    }

    private ConsumeEvent_EditModule(): void {
        const eventType: EditModuleEventType = "gp_event_EditModule";
        document.addEventListener(eventType, async (ev: CustomEvent) => {
            this.divLoadingPanel.style.display = "block";
            this.divFormInputsPanel.style.display = "none";
            this.editModuleModal.show();

            const detail: EditModuleEvent = ev.detail;
            this.formEditModule.onsubmit = async (ev: SubmitEvent) => await this.ServerRequest_UpdateModuleData(ev, detail.ModuleId);
            await this.ServerRequest_GetEditModalModuleData(detail.ModuleId);
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


    //region GetEditModalModuleData

    private async ServerRequest_GetEditModalModuleData(moduleId: number): Promise<void> {
        const response: Response = await fetch(`${this._urlGetEditModalModuleData}&moduleId=${moduleId}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as AuthorsFullModuleDTO;
            this.ServerRequestDone_GetEditModalModuleData(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GetEditModalModuleData(moduleData: AuthorsFullModuleDTO): void {
        this.divLoadingPanel.style.display = "none";
        this.divFormInputsPanel.style.display = "block";

        /* module content */
        this.inputModuleContent.value = moduleData.Content;

        /* check for middle module */
        if (moduleData.ModulePosition.Name === "Middle") {
            this.inputPassChoiceText.value = moduleData.PassChoiceText;
            this.inputFailChoiceText.value = moduleData.FailChoiceText;
            this.inputPassChoiceResult.value = moduleData.PassChoiceResult;
            this.inputFailChoiceResult.value = moduleData.FailChoiceResult;

            this.divModuleChoices.style.display = "block";
        }
        else {
            this.divModuleChoices.style.display = "none";
        }

        /* module position */
        this.inputModulePosition.value = moduleData.ModulePosition.KeywordId.toString();

        /* keywords */
        this.inputsKeywords.forEach((input: HTMLInputElement) => {
            const keywordId = parseInt(input.value) as number;
            const isKeywordSelected: boolean = moduleData.KeywordItems.some((keywordItem: KeywordItemDTO) => keywordItem.KeywordId === keywordId);
            input.checked = isKeywordSelected;
        });
    }

    //#endregion

    //#region UpdateModuleData

    private async ServerRequest_UpdateModuleData(ev: SubmitEvent, moduleId: number): Promise<void> {
        ev.preventDefault();

        const formData: FormData = new FormData(this.formEditModule);
        const modulePositionKeywordId: number = parseInt(formData.get("ModulePosition") as string);
        const modulePositionKeywordName: string = (this.inputModulePosition.querySelector(`option[value="${modulePositionKeywordId}"]`) as HTMLOptionElement).textContent;

        let dataToServer: UpdateModuleDTO = {
            ModuleId: moduleId,
            Content: formData.get("ModuleContent") as string,
            PassChoiceText: formData.get("PassChoiceText") as string === "" ? null : formData.get("PassChoiceText") as string,
            PassChoiceResult: formData.get("PassChoiceResult") as string === "" ? null : formData.get("PassChoiceResult") as string,
            FailChoiceText: formData.get("FailChoiceText") as string === "" ? null : formData.get("FailChoiceText") as string,
            FailChoiceResult: formData.get("FailChoiceResult") as string === "" ? null : formData.get("FailChoiceResult") as string,
            Author: Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_Author).Author,
            ModuleStatusTypeId: 2, //hardcode publish status
            Keywords: [],
            ModulePosition: modulePositionKeywordName
        };

        //get keywords from selected checkboxes
        let selectedKeywords: HTMLInputElement[] = Array.from(this.formEditModule.querySelector('#divKeywordsInputs').querySelectorAll('input[type="checkbox"]:checked'));
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
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';

        const response: Response = await fetch(this._urlUpdateModuleData, {
            method: 'POST',
            headers: {
                'XSRF-TOKEN': Utilities.GetVerficationToken(this.formEditModule),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToServer)
        });

        if (response.ok) {
            const dataFromServer = await response.json() as ResponseDTO<AuthorsModuleDTO>;
            this.ServerRequestDone_UpdateModuleData(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_UpdateModuleData(data: ResponseDTO<AuthorsModuleDTO>): void {
        Utilities.EnableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';

        if (data.Error) {
            alert(data.Message);
            return;
        }

        const eventType: ModuleUpdatedSuccessEventType = "gp_event_UpdateModuleSuccess";
        const eventData: ModuleUpdatedSuccessEvent = { ModuleData: data.Data };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }

    //#endregion
}