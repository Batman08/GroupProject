/// <reference types="./KeywordsGenerator" />

class KeywordsGenerator {
    //#region Urls

    private readonly _urlGetGenerateKeywords: string = Utilities.Controller() + "GenerateKeywords";

    //#endregion


    //#region Init

    public static async Init(): Promise<void> {
        await new KeywordsGenerator().Init();
    }

    private async Init(): Promise<void> {
        console.log("===================================");
        console.log("* Initialising Keywords Generator *");
        console.log("===================================");

        if (KeywordsGenerator.Helpers_HasGeneratedKeywords()) {
            console.log("Keywords already generated.");
            return;
        }
        else {
            console.log("No generated keywords found in local storage. Generating keywords...");
        }

        await this.ServerRequest_GenerateKeywords();
    }

    //#endregion


    //#region Helpers

    public static Helpers_HasGeneratedKeywords(): boolean {
        const generatedKeywords = KeywordsGenerator.Helpers_GetGeneratedKeywordsFromStorage();
        return (generatedKeywords == null || generatedKeywords.length == 0) ? false : true;
    }

    public static Helpers_GetGeneratedKeywordsFromStorage(): GeneratedKeywordDTO[] {
        const generatedKeywords = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_GeneratedKeywords) as GeneratedKeywordDTO[];
        return generatedKeywords;
    }

    //#endregion


    //#region GenerateKeywords

    public async ServerRequest_GenerateKeywords(): Promise<void> {
        const response: Response = await fetch(this._urlGetGenerateKeywords, { method: 'GET' });

        if (response.ok) {
            const dataFromServer = await response.json() as GeneratedKeywordsDTO;
            this.ServerRequestDone_GenerateKeywords(dataFromServer);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private ServerRequestDone_GenerateKeywords(dataFromServer: GeneratedKeywordsDTO): void {
        //store in local storage
        Utilities.LocalStorage_SetItem(dataFromServer.KeywordsData, Utilities.LocalStorageConstant_GeneratedKeywords);
    }

    //#endregion
}