class ModuleChoiceResultModal {
    //#region Controls

    private readonly _container = document.getElementById('moduleChoiceResultModalContainer') as HTMLDivElement;
    private readonly divResultPassModal = this._container.querySelector('#divResultPassModal') as HTMLDivElement;
    private readonly resultPassModal: bootstrap.Modal = new bootstrap.Modal(this.divResultPassModal);
    private readonly divResultFailModal = this._container.querySelector('#divResultFailModal') as HTMLDivElement;
    private readonly resultFailModal: bootstrap.Modal = new bootstrap.Modal(this.divResultFailModal);

    //#endregion


    //#region Init

    public static Init(): void {
        new ModuleChoiceResultModal().Init();
    }

    private Init(): void {
        this.ConsumeEvent_ModuleChoiceResult_Selected();
    }

    //#endregion


    //#region Events

    private ConsumeEvent_ModuleChoiceResult_Selected(): void {
        const eventType: ModuleChoiceSelectedEventType = "gp_event_ModuleChoice_Selected";
        document.addEventListener(eventType, (ev: CustomEvent) => {
            const detail: ModuleChoiceSelectedEvent = ev.detail;

            if (detail.ChoiceType === "Pass") {
                this.LoadResultModal_Pass(detail.ChoiceResult);
            }
            else {
                this.LoadResultModal_Fail(detail.ChoiceResult);
            }
        });
    }

    //#endregion

    //#region ResultModals

    private LoadResultModal_Pass(choiceResultPassText: string): void {
        const divChoiceResult = this.divResultPassModal.querySelector('#divChoiceResult') as HTMLDivElement;
        divChoiceResult.innerHTML = choiceResultPassText;

        this.resultPassModal.show();
    }

    private LoadResultModal_Fail(choiceResultFailText: string): void {
        const divChoiceResult = this.divResultFailModal.querySelector('#divChoiceResult') as HTMLDivElement;
        divChoiceResult.innerHTML = choiceResultFailText;

        this.resultFailModal.show();
    }

    //#endregion
}