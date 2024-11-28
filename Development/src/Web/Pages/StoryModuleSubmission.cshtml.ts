/// <reference types="./StoryModuleSubmission.cshtml" />

class StoryModuleSubmission {
    //#region Urls

    private readonly _urlGetAuthorsModules: string = Utilities.Controller() + "AuthorsModules";

    //#endregion


    //#region Init

    public static Init() {
        new StoryModuleSubmission().Init();
    }

    private Init(): void {
        this.ServerRequest_GetAuthorsModules();
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
    private ServerRequestDone_GetAuthorsModules(authorsModules: any): void {
        console.log(authorsModules);
    }


    //#endregion
}