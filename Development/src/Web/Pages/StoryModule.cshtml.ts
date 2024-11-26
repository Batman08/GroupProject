class StoryModule {
    //#region Init

    public static Init(): void {
        new StoryModule().Init();
    }

    private Init(): void {
        //get the first module ran and store it
        const moduleId: string = Utilities.GetQueryStringValue("selected");
        Utilities.StoreCurrentModuleInLocalStorage(moduleId);

        //this is for when a page refresh is done the options page shows
        Utilities.RemoveUrlQueryString();
    }

    //#endregion
}