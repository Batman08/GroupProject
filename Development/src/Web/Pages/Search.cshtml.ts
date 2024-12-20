﻿/// <reference types="./Search.cshtml" />

class Search {
    //#region Urls

    private readonly _urlGetModuleOptions: string = Utilities.Controller() + "ModuleOptions";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById("divSearchContainer") as HTMLDivElement;
    private readonly divSearchResults = this._container.querySelector("#divSearchResults") as HTMLDivElement;

    //#endregion


    //#region Init

    public static async Init(): Promise<void> {
        await new Search().Init();
    }

    private async Init(): Promise<void> {
        //remove used modules from local storage for new story flow
        Utilities.LocalStorage_RemoveItem(Utilities.LocalStorageConstant_PreviouslyUsedModules);

        this.ConsumeEvent_PlayerDetails_SaveSuccess();

        await KeywordsGenerator.Init();

        if (!Utilities.IsPlayerDetailsInStorage()) {
            _Layout._playerDetailsModal.show();
        }
        else {
            await this.ServerRequest_GetModuleOptions();
        }
    }

    //#endregion


    //#region Events

    private ConsumeEvent_PlayerDetails_SaveSuccess(): void {
        const eventType: PlayerDetailsSaveEventType = "gp_event_PlayerDetails_SaveSuccess";
        document.addEventListener(eventType, async (ev: CustomEvent) => {
            await this.ServerRequest_GetModuleOptions();
        });
    }

    //#endregion


    //#region GetModuleOptions

    private async ServerRequest_GetModuleOptions(): Promise<void> {
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

        const response: Response = await fetch(`${this._urlGetModuleOptions}&${queryStrParams}`, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as ModuleOptionsDTO;
            this.ServerRequestDone_GetModuleOptions(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GetModuleOptions(dataFromServer: ModuleOptionsDTO): void {
        //clear module loading panels
        this.divSearchResults.innerHTML = "";

        //show message when no module options have been returned
        if (dataFromServer.ModuleOptions.length === 0) {
            const alertMsg = Utilities.Alert({ Message: '<i class="fa-solid fa-ban fw-bold"></i> No stories found', Format: "WithAccentColour", Type: "light", AdditionalClasses: 'shadow-lg fs-5 fw-bold', OverrideWidthToMax: true });
            this.divSearchResults.appendChild(alertMsg);
            return;
        }

        for (let i = 0; i < dataFromServer.ModuleOptions.length; i++) {
            const optionNumber: number = i + 1;
            const moduleOption = this.RenderModuleOption(dataFromServer.ModuleOptions[i], optionNumber);
            this.divSearchResults.appendChild(moduleOption);
        }
    }

    private RenderModuleOption(data: ModuleOptionDTO, optionNumber: number): HTMLDivElement {
        const moduleOptionEl = _Layout.ElementTemplates().querySelector('#gp-divModuleOption').cloneNode(true) as HTMLDivElement;
        moduleOptionEl.removeAttribute("id");

        const pModuleContents = moduleOptionEl.querySelector("#pModuleContents") as HTMLParagraphElement;
        pModuleContents.removeAttribute("id");
        pModuleContents.innerHTML = Utilities.ReplaceUserDetailsPlaceHoldersInModule(data.Contents);

        const btnModule = moduleOptionEl.querySelector("#btnModule") as HTMLButtonElement;
        btnModule.removeAttribute("id");
        btnModule.textContent = `Module ${optionNumber}`;
        btnModule.onclick = (ev: MouseEvent) => {
            this.DisableAllModuleOptionButtons(ev.target as HTMLElement);
            window.location.href = `StoryModule?selected=${data.ModuleId}`;
        };

        return moduleOptionEl;
    }

    private DisableAllModuleOptionButtons(targetEl: HTMLElement): void {
        //add loading spinner to the selected button
        const selectedBtnEl = targetEl.closest("button[btnModuleOption]") as HTMLButtonElement;
        selectedBtnEl.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${selectedBtnEl.textContent}`;

        const moduleOptionBtns = this._container.querySelectorAll("button[btnModuleOption]") as NodeListOf<HTMLButtonElement>;
        moduleOptionBtns.forEach((btn: HTMLButtonElement) => {
            Utilities.DisableBtn(btn);

            //keep the selected button highlighted only
            if (btn !== selectedBtnEl) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-light');
            }
        });
    }

    //#endregion
}