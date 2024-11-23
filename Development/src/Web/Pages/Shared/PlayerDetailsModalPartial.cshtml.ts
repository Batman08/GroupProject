class PlayerDetailsModal {
    //#region Controls

    private readonly _divPlayerDetailsModal = document.getElementById('divPlayerDetailsModal') as HTMLDivElement;
    private readonly _playerDetailsModal = new bootstrap.Modal(this._divPlayerDetailsModal) as bootstrap.Modal;
    private readonly _formSavePlayerDetails = this._divPlayerDetailsModal.querySelector('#formSavePlayerDetails') as HTMLFormElement;
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
        this.BindOnKeyupEvents_PlayerDetailsModalInputs();
        this.BindOnChangeEvents_PlayerDetailsModalInputs();
        this.BindOnHidden_PlayerDetailsModal();
        this.BindSubmit_SavePlayerDetails();
    }

    private BindOnChangeEvents_PlayerDetailsModalInputs(): void {
        this._inputPlayerName.onchange = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerName);
        this._inputPlayerPronoun.onchange = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerPronoun);
    }

    private BindOnKeyupEvents_PlayerDetailsModalInputs(): void {
        this._inputPlayerName.onkeyup = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerName);
        this._inputPlayerPronoun.onkeyup = (ev: Event) => this.Helpers_ValidateFormInput(this._inputPlayerPronoun);
    }

    private BindOnHidden_PlayerDetailsModal(): void {
        //when modal is closed load reload form inputs
        this._divPlayerDetailsModal.addEventListener('hidden.bs.modal', () => {
            this.LoadPlayerDetails()
            this.Helpers_ValidateFormInput(this._inputPlayerName);
            this.Helpers_ValidateFormInput(this._inputPlayerPronoun);
        });
    }

    //#endregion


    //#region LoadPlayerDetails

    public LoadPlayerDetails(): void {
        const playerDetails = Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_PlayerDetails) as PlayerDetailsDTO;
        if (playerDetails !== null && playerDetails !== undefined) {
            this._inputPlayerName.value = playerDetails.Name;
            this._inputPlayerPronoun.value = playerDetails.Pronoun;
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

        //hide modal
        this._playerDetailsModal.hide();
    }

    //#endregion
}