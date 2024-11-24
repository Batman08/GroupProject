class Index {
    //#region Controls

    private readonly _container = document.getElementById('divIndexContainer') as HTMLDivElement;
    private readonly btnStartGame = this._container.querySelector('#btnStartGame') as HTMLButtonElement;

    //#endregion


    //#region Init

    public static async Init(): Promise<void> {
        await new Index().Init();
    }

    private async Init(): Promise<void> {
        this.ConsumeEvent_PlayerDetails_SaveSuccess();
        this.BindClick_StartGame();
        await KeywordsGenerator.Init();
    }

    //#endregion


    //#region StartGame

    private BindClick_StartGame(): void {
        this.btnStartGame.onclick = (ev: MouseEvent) => this.BindClickDone_StartGame(ev);
    }

    private BindClickDone_StartGame(ev: MouseEvent) {
        if (Utilities.IsPlayerDetailsInStorage()) window.location.href = '/Search';
        else _Layout._playerDetailsModal.show();
    }

    private ConsumeEvent_PlayerDetails_SaveSuccess(): void {
        const eventType: PlayerDetailsSaveEventType = "gp_event_PlayerDetails_SaveSuccess";
        document.addEventListener(eventType, (ev: CustomEvent) => {
            //take user to module selection page ('/Search') after saving player details
            window.location.href = '/Search';
        });
    }
    //#endregion
}