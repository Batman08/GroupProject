/// <reference types="./DeleteModuleModalPartial.cshtml" />

class DeleteModuleModal {
    //#region Urls

    private readonly _urlUpdateModuleData: string = Utilities.Controller() + "DeleteModuleData";

    //#endregion


    //#region Controls

    private readonly _container = document.getElementById('divDeleteModuleModalContainer') as HTMLDivElement;

    private readonly divDeleteModuleModal = this._container.querySelector('#divDeleteModuleModal') as HTMLDivElement;
    private readonly deleteModuleModal: bootstrap.Modal = new bootstrap.Modal(this.divDeleteModuleModal);
    private readonly formDeleteModule = this._container.querySelector('#formDeleteModule') as HTMLFormElement;
    private readonly formBtnSubmit = this.formDeleteModule.querySelector('[type="submit"]') as HTMLButtonElement;

    //#endregion


    //#region Init

    public static Init(): void {
        new DeleteModuleModal().Init();
    }

    private Init(): void {
        this.Events();
    }

    //#endregion


    //#region Events

    public static DispatchEvent_OpenDeleteModuleModal(ev: MouseEvent, moduleId: number, divEdiModulePanelEl: HTMLDivElement): void {
        const eventType: OpenDeleteModuleModalEventType = "gp_event_OpenDeleteModuleModal";
        const eventData: OpenDeleteModuleModalEvent = { ModuleId: moduleId, EdiModulePanelEl: divEdiModulePanelEl };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }


    private Events(): void {
        this.ConsumeEvent_OpenDeleteModuleModal();
    }

    private ConsumeEvent_OpenDeleteModuleModal(): void {
        const eventType: OpenDeleteModuleModalEventType = "gp_event_OpenDeleteModuleModal";
        document.addEventListener(eventType, async (ev: CustomEvent) => {
            const detail: OpenDeleteModuleModalEvent = ev.detail;
            
            this.formDeleteModule.onsubmit = async (ev: SubmitEvent) => await this.ServerRequest_DeleteModuleData(ev, detail.ModuleId, detail.EdiModulePanelEl);
            this.deleteModuleModal.show();
        });
    }

    public DispatchEvent_ModuleDeletedSuccess(moduleId: number, divEdiModulePanelEl: HTMLDivElement): void {
        const eventType: ModuleDeletedSuccessEventType = "gp_event_ModuleDeletedSuccess";
        const eventData: ModuleDeletedSuccessEvent = { ModuleId: moduleId, EdiModulePanelEl: divEdiModulePanelEl };
        const gpEvent = new CustomEvent(eventType, { bubbles: true, detail: eventData });
        document.body.dispatchEvent(gpEvent);
    }

    //#endregion


    //#region DeleteModuleData

    private async ServerRequest_DeleteModuleData(ev: SubmitEvent, moduleId: number, divEditModulePanelEl: HTMLDivElement): Promise<void> {
        ev.preventDefault();

        if (moduleId == null || moduleId == 0) {
            this.deleteModuleModal.hide();
            alert("Something went wrong. Module not found.");
            return;
        }

        const dataToServer: DeleteModuleDTO = {
            ModuleId: moduleId,
            Author: (Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_Author) as AuthorDTO).Author
        };

        Utilities.DisableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Deleting...';

        const response: Response = await fetch(this._urlUpdateModuleData, {
            method: 'POST',
            headers: {
                'XSRF-TOKEN': Utilities.GetVerficationToken(this.formDeleteModule),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToServer)
        });

        if (response.ok) {
            const dataFromServer = await response.json() as ResponseDTO<DeleteModuleDTO>;
            this.ServerRequestDone_DeleteModuleData(dataFromServer, divEditModulePanelEl);
        } else {
            const error = await response.text();
            console.error(`Error ${response.status} ${response.statusText}:`, error);
        }
    }

    private async ServerRequestDone_DeleteModuleData(dataFromServer: ResponseDTO<DeleteModuleDTO>, divEditModulePanelEl: HTMLDivElement): Promise<void> {
        Utilities.EnableBtn(this.formBtnSubmit);
        this.formBtnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Confirm';

        if (dataFromServer.Error) {
            alert(dataFromServer.Message);
            return;
        }

        this.DispatchEvent_ModuleDeletedSuccess(dataFromServer.Data.ModuleId, divEditModulePanelEl)
        this.deleteModuleModal.hide();
    }

    //#endregion
}