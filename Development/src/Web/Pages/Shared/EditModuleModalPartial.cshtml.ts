/// <reference types="./EditModuleModalPartial.cshtml" />

class EditModuleModal {
    //#region Urls

    private readonly _urlGetEditModalModuleData: string = Utilities.Controller() + "EditModalModuleData";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divEditModuleModalContainer') as HTMLDivElement;
    private readonly divEditModuleModal = this._container.querySelector('#divEditModuleModal') as HTMLDivElement;
    private readonly editModuleModal: bootstrap.Modal = new bootstrap.Modal(this.divEditModuleModal);
    private readonly divLoadingPanel = this._container.querySelector('#divLoadingPanel') as HTMLDivElement;
    private readonly divFormInputsPanel = this._container.querySelector('#divFormInputsPanel') as HTMLDivElement;

    private readonly formEditModule = this._container.querySelector('#formEditModule') as HTMLFormElement;
    private readonly inputModuleContent = this.formEditModule.querySelector('#inputModuleContent') as HTMLInputElement;
    private readonly divModuleChoices = this.formEditModule.querySelector('#divModuleChoices') as HTMLDivElement;
    private readonly inputPassChoiceText = this.formEditModule.querySelector('#inputPassChoiceText') as HTMLInputElement;
    private readonly inputFailChoiceText = this.formEditModule.querySelector('#inputFailChoiceText') as HTMLInputElement;
    private readonly inputPassChoiceResult = this.formEditModule.querySelector('#inputPassChoiceResult') as HTMLInputElement;
    private readonly inputFailChoiceResult = this.formEditModule.querySelector('#inputFailChoiceResult') as HTMLInputElement;
    private readonly inputModulePosition = this.formEditModule.querySelector('#inputModulePosition') as HTMLInputElement;
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
    }

    private ConsumeEvent_EditModule(): void {
        const eventType: EditModuleEventType = "gp_event_EditModule";
        document.addEventListener(eventType, async (ev: CustomEvent) => {
            this.divLoadingPanel.style.display = "block";
            this.divFormInputsPanel.style.display = "none";
            this.editModuleModal.show();

            const detail: EditModuleEvent = ev.detail;
            await this.ServerRequest_GetEditModalModuleData(detail.ModuleId);
        });
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

    private async ServerRequest_UpdateModuleData(): Promise<void> {
        //const dataToServer: ModuleSearchKeywordsDTO = { Keywords: ["Beginning", "Observation", "Wife", "Crime Boss"] }; // Example data for testing
        //const response: Response = await fetch(this._urlGetModuleOptions, {
        //    method: 'POST',
        //    headers: {
        //        'XSRF-TOKEN': Utilities.GetVerficationToken(this.formModuleSearch),
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify(dataToServer)
        //});
    }

    //#endregion
}