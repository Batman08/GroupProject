/// <reference types="./Search.cshtml" />

class Search {
    //#region Urls

    private readonly _urlGetModuleOptions: string = Utilities.Controller() + "ModuleOptions";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById("divSearchContainer") as HTMLDivElement;
    private readonly divSearchResults = this._container.querySelector("#divSearchResults") as HTMLDivElement;

    //#endregion


    //#region Init

    public static Init(): void {
        new Search().Init();
    }

    private Init(): void {
        this.ServerRequest_GetModuleOptions();
    }

    //#endregion


    //#region GetModuleOptions

    private async ServerRequest_GetModuleOptions(): Promise<void> {
        const dataToServer: string[] = ["Beginning", "Observation", "Wife", "Crime Boss"]; // example data for testing
        const response: Response = await fetch(`${this._urlGetModuleOptions}&${dataToServer}`, { method: 'GET' });

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

        const pModuleOverview = moduleOptionEl.querySelector("#pModuleOverview") as HTMLParagraphElement;
        pModuleOverview.removeAttribute("id");
        pModuleOverview.textContent = data.Overview;

        const btnModule = moduleOptionEl.querySelector("#btnModule") as HTMLButtonElement;
        btnModule.removeAttribute("id");
        btnModule.textContent = `Module ${optionNumber}`;
        btnModule.onclick = (ev: MouseEvent) => window.location.href = `StoryModule?selected=${data.ModuleId}`;

        return moduleOptionEl;
    }

    //#endregion
}