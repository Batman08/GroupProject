class PlayerDetailsModal {
    //#region Controls

    private readonly _formSavePlayerDetails = _Layout._divPlayerDetailsModal.querySelector('#formSavePlayerDetails') as HTMLFormElement;
    private readonly _inputPlayerName = this._formSavePlayerDetails.querySelector('#inputPlayerName') as HTMLInputElement;
    private readonly _inputPlayerPronoun = this._formSavePlayerDetails.querySelector('#inputPlayerPronoun') as HTMLInputElement;

    //#endregion


    //#region Init

    public static Init(): void {
        new PlayerDetailsModal().Init();
    }

    private Init(): void {
        this.LoadPlayerDetails();
        this.BindEvents();
    }

    //#endregion


    //#region Helpers

    private Helpers_ValidateFormInput = (input: HTMLInputElement): boolean => {
        const inputVal: string = input.value.trim();
        const hasInvalidInputValue: boolean = Utilities.HasNoValue(inputVal);

        const divErrorMsg = this._formSavePlayerDetails.querySelector(`#${input.name}ErrorMsg`) as HTMLDivElement;
        if (hasInvalidInputValue) {
            divErrorMsg.style.display = 'block';
        }
        else {
            divErrorMsg.style.display = 'none';
        }

        return hasInvalidInputValue;
    }

    //#endregion


    //#region PlayerDetailsModal Events

    private BindEvents(): void {
        /* OnKeyup Events */

        this._inputPlayerName.onkeyup = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerName);
        this._inputPlayerPronoun.onkeyup = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerPronoun);


        /* OnChange Events */

        this._inputPlayerName.onchange = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerName);
        this._inputPlayerPronoun.onchange = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerPronoun);


        /* Submit Events */

        this.BindSubmit_SavePlayerDetails();


        /* Modal Hidden Events */

        this.BindOnHidden_PlayerDetailsModal();
    }

    private BindOnHidden_PlayerDetailsModal(): void {
        //when modal is closed load reload form inputs
        _Layout._divPlayerDetailsModal.addEventListener('hidden.bs.modal', () => {
            if (!Utilities.IsPlayerDetailsInStorage()) {
                this._inputPlayerName.value = '';
                this._inputPlayerPronoun.value = '';
                _Layout._playerDetailsModal.toggle();
            }
            else {
                this.LoadPlayerDetails()
            }

            this.Helpers_ValidateFormInput(this._inputPlayerName);
            this.Helpers_ValidateFormInput(this._inputPlayerPronoun);
        });
    }

    //#endregion


    //#region LoadPlayerDetails

    public LoadPlayerDetails(): void {
        if (Utilities.IsPlayerDetailsInStorage()) {
            const playerDetails: PlayerDetailsDTO = Utilities.GetPlayerDetailsFromStorage();
            this._inputPlayerName.value = playerDetails.Name;
            this._inputPlayerPronoun.value = playerDetails.Pronoun;
        }
        else {
            this._inputPlayerName.value = '';
            this._inputPlayerPronoun.value = '';
        }
    }

    //#endregion


    //#region SavePlayerDetails

    private BindSubmit_SavePlayerDetails(): void {
        this._formSavePlayerDetails.onsubmit = (ev: SubmitEvent) => this.BindSubmitDone_SavePlayerDetils(ev);
    }

    private BindSubmitDone_SavePlayerDetils(ev: SubmitEvent): void {
        ev.preventDefault();

        //extract data from form
        const formData: FormData = new FormData(this._formSavePlayerDetails);
        const extractedData: PlayerDetailsDTO = {
            Name: formData.get(this._inputPlayerName.name) as string,
            Pronoun: formData.get(this._inputPlayerPronoun.name) as string,
        }

        //validate input values
        const hasInvalidName: boolean = this.Helpers_ValidateFormInput(this._inputPlayerName);
        const hasInvalidPronoun: boolean = this.Helpers_ValidateFormInput(this._inputPlayerPronoun);
        if (hasInvalidName || hasInvalidPronoun) return;

        //save data to local storage
        Utilities.LocalStorage_SetItem(extractedData, Utilities.LocalStorageConstant_PlayerDetails);

        //dispatch event
        this.DispatchEvent_PlayerDetails_SaveSuccess();

        //hide modal
        _Layout._playerDetailsModal.hide();
    }

    private DispatchEvent_PlayerDetails_SaveSuccess(): void {
        const eventType: PlayerDetailsSaveEventType = "gp_event_PlayerDetails_SaveSuccess";
        const epEvent = new CustomEvent(eventType, { bubbles: true });
        document.body.dispatchEvent(epEvent);
    }

    //#endregion
}