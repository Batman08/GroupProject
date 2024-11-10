/// <reference types="./Search.cshtml" />

class Search {
    /* Urls */
    private readonly _urlGetModuleOptions: string = Utilities.Controller() + "ModuleOptions";


    /* Controls */
    private readonly _container = document.getElementById("divSearchContainer") as HTMLDivElement;
    private readonly _divElementTemplates = this._container.querySelector("#divElementTemplates") as HTMLDivElement;
    private readonly divSearchResults = this._container.querySelector("#divSearchResults") as HTMLDivElement;

    /* Init */
    public static Init(): void {
        new Search().Init();
    }

    private Init(): void {
        this.ServerRequest_GetModuleOptions();
    }


    /* GetModuleOptions */
    private async ServerRequest_GetModuleOptions(): Promise<void> {
        const dataToServer: string[]=  ["Beginning", "Observation", "Wife", "Crime Boss"]; // example data for testing
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
        //clear all module options
        this.divSearchResults.innerHTML = "";

        for (let i = 0; i < dataFromServer.ModuleOptions.length; i++) {
            const optionNumber: number = i + 1;
            const moduleOption = this.RenderModuleOption(dataFromServer.ModuleOptions[i], optionNumber);
            this.divSearchResults.appendChild(moduleOption);
        }
    }

    private RenderModuleOption(moduleOption: ModuleOptionDTO, optionNumber: number): HTMLDivElement {
        const moduleOptionEl = this._divElementTemplates.querySelector('#divModuleOption').cloneNode(true) as HTMLDivElement;
        moduleOptionEl.removeAttribute("id");

        const pModuleContent = moduleOptionEl.querySelector("#pModuleContent") as HTMLParagraphElement;
        pModuleContent.removeAttribute("id");
        pModuleContent.textContent = moduleOption.Contents;

        const btnModule = moduleOptionEl.querySelector("#btnModule") as HTMLButtonElement;
        btnModule.removeAttribute("id");
        btnModule.textContent = `Module Option ${optionNumber}`;

        return moduleOptionEl;
    }
}