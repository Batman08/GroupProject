class StoryModule {
    //#region Init

    public static Init(): void {
        new StoryModule().Init();
    }

    private Init(): void {
        Utilities.RemoveUrlQueryString(); //this is for when a page refresh is done the options page shows
    }

    //#endregion
}