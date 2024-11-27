/// <reference types="./StoryModule.cshtml" />

class StoryModule {
    //#region Urls

    private readonly _urlGetMiddleModule: string = Utilities.Controller() + "MiddleModule";
    private readonly _urlGetEndModule: string = Utilities.Controller() + "EndModule";

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
        Utilities.RemoveUrlQueryString();

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

    private maxNumMiddleModules: number = Math.floor((Math.random() * 10) + 1); //random number between 1 and 10
    private numMiddleModules: number = 0;

    private async ServerRequest_GetMiddleModule(): Promise<void> {
        /* Keywords Search Param */

        const searchParamData: SearchParam[] = KeywordsGenerator.Helpers_GetGeneratedKeywordsFromStorage().map((keyword: GeneratedKeywordDTO) => {
            return { CategoryId: keyword.CategoryId, Keyword: keyword.Keyword };
        });
        const queryStrSearchParams = new URLSearchParams();
        searchParamData.forEach((param: SearchParam, index: number) => {
            queryStrSearchParams.append(`searchParams[${index}].CategoryId`, param.CategoryId.toString());
            queryStrSearchParams.append(`searchParams[${index}].Keyword`, param.Keyword);
        });


        /* Used Modules Param */

        let usedModulesData: UsedModulesDTO = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_PreviouslyUsedModules) as string[];
        usedModulesData = usedModulesData !== undefined ? usedModulesData : [];
        const queryStrUsedModulesParams = new URLSearchParams();
        usedModulesData.forEach((param: string) => {
            queryStrUsedModulesParams.append(`usedModulesParams`, param);
        });


        const response: Response = await fetch(`${this._urlGetMiddleModule}&${queryStrSearchParams}&${queryStrUsedModulesParams}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as MiddleModuleResponseDTO;
            await this.ServerRequestDone_GetMiddleModule(dataFromServer.MiddleModule);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private async ServerRequestDone_GetMiddleModule(middleModuleData: ModuleDTO): Promise<void> {
        //show end module since no more modules to display 
        if (middleModuleData === null) {
            await this.ServerRequest_GetEndModule();
            return;
        }

        //increment the number of middle modules
        this.numMiddleModules += 1;

        //store the module id to ignore it in the next request
        const previouslyUsedModules: string[] = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_PreviouslyUsedModules) || [];
        previouslyUsedModules.push(middleModuleData.ModuleId.toString());
        Utilities.LocalStorage_SetItem(previouslyUsedModules, Utilities.LocalStorageConstant_PreviouslyUsedModules);

        //display new module
        this.RenderModule(middleModuleData);
    }

    private RenderModule(middleModuleData: ModuleDTO): void {
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
            //if the number of middle modules is less than the max number of middle modules then get another middle module
            if (this.numMiddleModules !== this.maxNumMiddleModules) await this.ServerRequest_GetMiddleModule();
            else await this.ServerRequest_GetEndModule();

            const detail: ModuleChoicePassBtnContinueEvent = ev.detail;
            detail.PassModal.hide();
        });
    }

    //#endregion


    //#region GetEndModule

    public async ServerRequest_GetEndModule(): Promise<void> {
        //get generated keywords from local storage and create an array of SearchParam objects
        const dataToServer: SearchParam[] = KeywordsGenerator.Helpers_GetGeneratedKeywordsFromStorage().map((keyword: GeneratedKeywordDTO) => {
            return { CategoryId: keyword.CategoryId, Keyword: keyword.Keyword };
        });

        //create query string from dataToServer array
        const queryStrParams = new URLSearchParams();
        dataToServer.forEach((param: SearchParam, index: number) => {
            queryStrParams.append(`searchParams[${index}].CategoryId`, param.CategoryId.toString());
            queryStrParams.append(`searchParams[${index}].Keyword`, param.Keyword);
        });

        const response: Response = await fetch(`${this._urlGetEndModule}&${queryStrParams}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as EndModuleResponseDTO;
            this.ServerRequestDone_GetEndModule(dataFromServer.EndModule);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GetEndModule(endModuleData: ModuleDTO) {
        //send event to display end module modal
        this.DispatchEvent_EndModule(endModuleData.Contents);
    }

    private DispatchEvent_EndModule(endModuleText: string): void {
        const eventType: EndModuleEventType = "gp_event_EndModule";
        const eventData: EndModuleEvent = { EndModuleText: endModuleText };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }

    //#endregion
}