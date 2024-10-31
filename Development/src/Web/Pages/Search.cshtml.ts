/// <reference types="./Search.cshtml" />

class Search {
    /* Urls */
    private readonly _urlGetModuleOptions: string = Utilities.Controller() + "GetModuleOptions";


    /* Controls */
    private readonly _container = document.getElementById("divSearchContainer") as HTMLDivElement;
    private readonly formModuleSearch = this._container.querySelector("#formModuleSearch") as HTMLFormElement;
    private readonly inputModuleSearch = this._container.querySelector("#inputModuleSearch") as HTMLInputElement;


    /* Init */
    public static Init(): void {
        new Search().Init();
    }

    private Init(): void {
        this.BindSubmit_GetModuleOptions();
    }


    /* GetModuleOptions */
    private async ServerRequest_GetModuleOptions(ev: SubmitEvent): Promise<void> {
        ev.preventDefault();

        const formData: FormData = new FormData(this.formModuleSearch);
        const dataToServer: ModuleSearchDTO = { ModuleSearch: formData.get(this.inputModuleSearch.name) as string };
        const response: Response = await fetch(this._urlGetModuleOptions, {
            method: 'POST',
            headers: {
                'XSRF-TOKEN': Utilities.GetVerficationToken(this.formModuleSearch),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToServer)
        });

        if (response.ok) {
            const dataFromServer = await response.json();
            this.ServerRequestDone_GetModuleOptions(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GetModuleOptions(dataFromServer: any): void {
        console.log(dataFromServer);
    }

    private BindSubmit_GetModuleOptions(): void {
        this.formModuleSearch.onsubmit = (ev: SubmitEvent) => this.ServerRequest_GetModuleOptions(ev);
    }
}