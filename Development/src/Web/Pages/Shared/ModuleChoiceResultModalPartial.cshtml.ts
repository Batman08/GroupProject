class ModuleChoiceResultModal {
    //#region Controls

    private readonly _container = document.getElementById('moduleChoiceResultModalContainer') as HTMLDivElement;
    private readonly divResultPassModal = this._container.querySelector('#divResultPassModal') as HTMLDivElement;
    private readonly divResultFailModal = this._container.querySelector('#divResultFailModal') as HTMLDivElement;
    private readonly divEndModuleModal = this._container.querySelector('#divEndModuleModal') as HTMLDivElement;
    private readonly btnContinue = this.divResultPassModal.querySelector('#btnContinue') as HTMLButtonElement;
    private readonly btnRestart_FailModal = this.divResultFailModal.querySelector('#btnRestart') as HTMLButtonElement;
    private readonly btnRestart_EndModuleModal = this.divEndModuleModal.querySelector('#btnRestart') as HTMLButtonElement;
    private readonly resultPassModal: bootstrap.Modal = new bootstrap.Modal(this.divResultPassModal);
    private readonly resultFailModal: bootstrap.Modal = new bootstrap.Modal(this.divResultFailModal);
    private readonly endModuleModal: bootstrap.Modal = new bootstrap.Modal(this.divEndModuleModal);

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
        this.btnRestart_FailModal.onclick = (ev: MouseEvent) => this.ResultModalFail_BtnResult(ev);
        this.btnRestart_EndModuleModal.onclick = (ev: MouseEvent) => this.EndModuleModal_BtnResult(ev);

        this.ConsumeEvent_ModuleChoiceResult_Selected();
        this.ConsumeEvent_EndModule();
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

    private ConsumeEvent_EndModule(): void {
        const eventType: EndModuleEventType = "gp_event_EndModule";
        document.addEventListener(eventType, (ev: CustomEvent) => {
            const detail: EndModuleEvent = ev.detail;
            this.LoadEndModuleModal(detail.EndModuleText);
        });
    }

    //#endregion


    //#region ResultModals

    private LoadResultModal_Pass(choiceResultPassText: string): void {
        const divChoiceResult = this.divResultPassModal.querySelector('#divChoiceResult') as HTMLDivElement;
        divChoiceResult.innerHTML = `<div class="text-center mb-4"><i class="fa-solid fa-circle-check fa-7x text-success"></i></div> <p>${choiceResultPassText}</p>`;

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
        divChoiceResult.innerHTML = `<div class="text-center mb-4"><i class="fa-solid fa-circle-xmark fa-7x text-danger"></i></div> <p>${choiceResultFailText}</p>`;

        this.resultFailModal.show();
    }

    private ResultModalFail_BtnResult(ev: MouseEvent): void {
        //disable button
        Utilities.DisableBtn(this.btnRestart_FailModal);
        this.btnRestart_FailModal.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Restarting...';

        //clear stored data
        Utilities.ResetStoredGameDetails();

        //redirect to search page
        window.location.href = "/Search";
    }

    //#endregion


    //#region EndModuleModals

    private LoadEndModuleModal(endModuleText: string): void {
        const divEndModule = this.divEndModuleModal.querySelector('#divEndModule') as HTMLDivElement;
        divEndModule.innerHTML = `<div class="text-center mb-4"><i class="fa-regular fa-thumbs-up fa-7x text-success"></i></div> <p>${endModuleText}</p>`;

        this.endModuleModal.show();
    }

    private EndModuleModal_BtnResult(ev: MouseEvent): void {
        //disable button
        Utilities.DisableBtn(this.btnRestart_EndModuleModal);
        this.btnRestart_EndModuleModal.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Please wait...';

        //clear stored data
        Utilities.ResetStoredGameDetails();

        //redirect to search page
        window.location.href = "/Search";
    }

    //#endregion
}