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
        console.log(dataFromServer);

        //store in local storage
        Utilities.LocalStorage_SetItem(dataFromServer.KeywordsData, Utilities.LocalStorageConstant_GeneratedKeywords);
    }

    //#endregion
}

/*
How this works:
    1. Randomly determine number of categories we want to generate for.
    2. Randomly determine what each of the categories are.
    3. Randomly determine the keyword for each of the categories chosen.
    4. Store in local storage.
*/


/*
How this works:
    1. Randomly determine the keyword for each category we have.
    2. Store in local storage.
*/