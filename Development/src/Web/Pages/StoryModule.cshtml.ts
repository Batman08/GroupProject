/// <reference types="./StoryModule.cshtml" />

class StoryModule {
    //#region Urls

    private readonly _urlGetMiddleModule: string = Utilities.Controller() + "MiddleModule";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divStoryModuleContainer');

    //#endregion


    //#region Init

    public static Init(): void {
        new StoryModule().Init();
    }

    private Init(): void {
        //get the first module ran and store it
        //const moduleId: string = Utilities.GetQueryStringValue("selected");
        //Utilities.StoreCurrentModuleInLocalStorage(moduleId);

        //this is for when a page refresh is done the options page shows
        //Utilities.RemoveUrlQueryString();

        this.BindClick_InitialModuleContinue();
        this.ConsumeEvent_ModuleChoicePass_BtnContinue();
    }

    //#endregion


    //#region InitalModuleContinue

    private BindClick_InitialModuleContinue() {
        const btnContinue = this._container.querySelector('#btnContinue') as HTMLButtonElement;
        btnContinue.onclick = async (ev: MouseEvent) => {
            Utilities.DisableBtn(btnContinue);
            btnContinue.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Please Wait...`;

            await this.ServerRequest_GetMiddleModule();
        };
    }

    //#endregion


    //#region GetMiddleModule

    private async ServerRequest_GetMiddleModule(): Promise<void> {
        let dataToServer: UsedModulesDTO = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_PreviouslyUsedModules) as string[];
        dataToServer = dataToServer !== undefined ? dataToServer : [];

        //create query string from dataToServer array
        const queryStrParams = new URLSearchParams();
        dataToServer.forEach((param: string) => {
            queryStrParams.append(`usedModulesParam`, param);
        });

        const response: Response = await fetch(`${this._urlGetMiddleModule}&${queryStrParams}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as MiddleModuleResponseDTO;
            this.ServerRequestDone_GetMiddleModule(dataFromServer.MiddleModule);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GetMiddleModule(middleModuleData: MiddleModuleDTO) {
        //store the module id to ignore it in the next request
        Utilities.StoreCurrentModuleInLocalStorage(middleModuleData.ModuleId.toString());

        //display new module
        this.RenderModule(middleModuleData);
    }

    private RenderModule(middleModuleData: MiddleModuleDTO): void {
        const divModule = this._container.querySelector('#divModule') as HTMLDivElement;

        const pModuleContent = divModule.querySelector('#pModuleContent') as HTMLParagraphElement;
        pModuleContent.textContent = middleModuleData.Contents;

        const divModuleChoices = divModule.querySelector('#divModuleChoices') as HTMLDivElement;
        divModuleChoices.innerHTML = "";

        //randomly sort the module choice types order
        const moduleChoiceTypes: string[] = ["Pass", "Fail"];
        const sortedModuleChoiceTypes = moduleChoiceTypes.sort(() => Math.random() - 0.5);

        for (let i = 0; i < sortedModuleChoiceTypes.length; i++) {
            const choiceType: string = sortedModuleChoiceTypes[i];

            const moduleOptionEl = _Layout.ElementTemplates().querySelector('#gp-divModuleChoice').cloneNode(true) as HTMLDivElement;
            moduleOptionEl.removeAttribute("id");

            const choiceBtnText: string = choiceType === "Pass" ? middleModuleData.PassChoiceText : middleModuleData.FailChoiceText;
            const choiceResult: string = choiceType === "Pass" ? middleModuleData.PassChoiceResult : middleModuleData.FailChoiceResult;

            const btnModuleChoice = moduleOptionEl.querySelector("#btnModuleChoice") as HTMLButtonElement;
            btnModuleChoice.removeAttribute("id");
            btnModuleChoice.textContent = choiceBtnText;
            btnModuleChoice.onclick = (ev: MouseEvent) => {
                this.DispatchEvent_ModuleChoiceResult_Selected(choiceType, choiceResult);
            };

            divModuleChoices.appendChild(moduleOptionEl);
        }
    }

    private DispatchEvent_ModuleChoiceResult_Selected(choiceType: string, choiceResult): void {
        const eventType: ModuleChoiceSelectedEventType = "gp_event_ModuleChoice_Selected";
        const eventData: ModuleChoiceSelectedEvent = { ChoiceType: choiceType, ChoiceResult: choiceResult };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }

    private ConsumeEvent_ModuleChoicePass_BtnContinue(): void {
        const eventType: ModuleChoicePassBtnContinueEventType = "gp_event_ModuleChoicePass_BtnContinue";
        document.addEventListener(eventType, async (ev: CustomEvent) => {
            const detail: ModuleChoicePassBtnContinueEvent = ev.detail;

            await this.ServerRequest_GetMiddleModule();

            detail.PassModal.hide();
        });
    }

    //#endregion
}