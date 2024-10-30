/// <reference types="./Search.cshtml" />

class Search {
    /* Urls */
    private readonly _urlGetModuleOptions: string = Utilities.Controller() + "GetModuleOptions";


    /* Controls */
    private readonly _divSearchContainer = document.getElementById("divSearchContainer") as HTMLDivElement;
    private readonly _formModuleSearch = this._divSearchContainer.querySelector("#formModuleSearch") as HTMLFormElement;


    /* Init */
    public static Init(): void {
        new Search().Init();
    }

    private Init(): void {
        this.BindSubmit_GetModuleOptions();
    }


    /* GetModuleOptions */
    private ServerRequest_GetModuleOptions3(ev: SubmitEvent): void {
        ev.preventDefault();

        const formData: FormData = new FormData(this._formModuleSearch);

        const dataToServer: ModuleSearchDTO = {
            ModuleSearch: formData.get("ModuleSearch").toString()
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this._urlGetModuleOptions);
        xhr.setRequestHeader("XSRF-TOKEN", Utilities.GetVerficationToken(this._formModuleSearch));
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => xhr.status === 200 ? this.ServerRequestResponse_GetModuleOptions(JSON.parse(xhr.response)) : console.log(xhr);
        xhr.send(JSON.stringify(dataToServer));
    }

    private async ServerRequest_GetModuleOptions(ev: SubmitEvent): Promise<void> {
        ev.preventDefault();

        const formData: FormData = new FormData(this._formModuleSearch);
        const dataToServer: ModuleSearchDTO = { ModuleSearch: formData.get("ModuleSearch").toString() };
        const response: Response = await fetch(this._urlGetModuleOptions, {
            method: 'POST',
            headers: {
                'XSRF-TOKEN': Utilities.GetVerficationToken(this._formModuleSearch),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToServer)
        });

        if (response.ok) {
            const dataFromServer = await response.json();
            this.ServerRequestResponse_GetModuleOptions(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestResponse_GetModuleOptions(dataFromServer: any): void {
        console.log(dataFromServer);
    }

    private BindSubmit_GetModuleOptions(): void {
        this._formModuleSearch.onsubmit = (ev: SubmitEvent) => this.ServerRequest_GetModuleOptions(ev);
    }
}