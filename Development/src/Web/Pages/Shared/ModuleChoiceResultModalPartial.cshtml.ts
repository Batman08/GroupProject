class ModuleChoiceResultModal {
    //#region Controls

    private readonly _container = document.getElementById('moduleChoiceResultModalContainer') as HTMLDivElement;
    private readonly divResultPassModal = this._container.querySelector('#divResultPassModal') as HTMLDivElement;
    private readonly divResultFailModal = this._container.querySelector('#divResultFailModal') as HTMLDivElement;
    private readonly btnContinue = this.divResultPassModal.querySelector('#btnContinue') as HTMLButtonElement;
    private readonly btnRestart = this.divResultFailModal.querySelector('#btnRestart') as HTMLButtonElement;
    private readonly resultPassModal: bootstrap.Modal = new bootstrap.Modal(this.divResultPassModal);
    private readonly resultFailModal: bootstrap.Modal = new bootstrap.Modal(this.divResultFailModal);

    //#endregion


    //#region Init

    public static Init(): void {
        new ModuleChoiceResultModal().Init();
    }

    private Init(): void {
        this.Events();
    }

    //#endregion


    //#region Events

    private Events(): void {
        this.btnContinue.onclick = (ev: MouseEvent) => this.ResultModalPass_BtnContinue(ev);
        this.btnRestart.onclick = (ev: MouseEvent) => this.ResultModalFail_BtnResult(ev);

        this.ConsumeEvent_ModuleChoiceResult_Selected();
    }

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

    private ResultModalPass_BtnContinue(ev: MouseEvent): void {
        //disable button
        Utilities.DisableBtn(this.btnContinue);
        this.btnContinue.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Continuing...';

        //dispatch event
        this.DispatchEvent_ModuleChoicePass_BtnContinue();
    }

    private DispatchEvent_ModuleChoicePass_BtnContinue(): void {
        const eventType: ModuleChoicePassBtnContinueEventType = "gp_event_ModuleChoicePass_BtnContinue";
        const eventData: ModuleChoicePassBtnContinueEvent = { PassModal: this.resultPassModal };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }


    private LoadResultModal_Fail(choiceResultFailText: string): void {
        const divChoiceResult = this.divResultFailModal.querySelector('#divChoiceResult') as HTMLDivElement;
        divChoiceResult.innerHTML = choiceResultFailText;

        this.resultFailModal.show();
    }

    private ResultModalFail_BtnResult(ev: MouseEvent): void {
        //disable button
        Utilities.DisableBtn(this.btnRestart);
        this.btnRestart.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Restarting...';

        //clear stored data
        Utilities.LocalStorage_RemoveItem(Utilities.LocalStorageConstant_GeneratedKeywords);
        Utilities.LocalStorage_RemoveItem(Utilities.LocalStorageConstant_PreviouslyUsedModules);

        //redirect to search page
        window.location.href = "/Search";
    }

    //#endregion
}