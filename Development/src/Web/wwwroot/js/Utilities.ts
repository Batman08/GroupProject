/// <reference types="./Utilities" />

class Utilities {

    //#region Common

    public static Controller(): string {
        return window.location.pathname + "?handler=";
    }

    public static GetVerficationToken(formEl: HTMLFormElement): string {
        const token = formEl.querySelector("input[name=__RequestVerificationToken]") as HTMLInputElement;
        return token ? token.value : "";
    }

    public static RemoveUrlQueryString(): void {
        const currentUrl: string = window.location.href; //Get the current URL
        const urlWithoutQueryString: string = currentUrl.split('?')[0]; // Remove the query string
        window.history.replaceState({}, document.title, urlWithoutQueryString); // Change the URL without refreshing the page
    }

    public static EnableBtn(btnEl: HTMLButtonElement): void {
        btnEl.style.pointerEvents = "auto";
        btnEl.disabled = false;
    }

    public static DisableBtn(btnEl: HTMLButtonElement): void {
        btnEl.style.pointerEvents = "none";
        btnEl.disabled = true;
    }

    public static GetQueryStringValue(key: string): string {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(key) || "";
    }

    public static HasNoValue(inputVal: string): boolean {
        return inputVal === null || inputVal === undefined || inputVal === '';
    }

    public static GetPlayerDetailsFromStorage(): PlayerDetailsDTO {
        return this.LocalStorage_LoadItem(this.LocalStorageConstant_PlayerDetails) as PlayerDetailsDTO;
    }

    public static IsPlayerDetailsInStorage(): boolean {
        const playerDetails = Utilities.GetPlayerDetailsFromStorage();
        return playerDetails !== null && playerDetails !== undefined;
    }

    public static ResetStoredGameDetails(): void {
        Utilities.LocalStorage_RemoveItem(Utilities.LocalStorageConstant_GeneratedKeywords);
        Utilities.LocalStorage_RemoveItem(Utilities.LocalStorageConstant_PreviouslyUsedModules);
    }

    public static CreateAuthor(): void {
        //if author is already created, do nothing
        if (Utilities.LocalStorage_LoadItem(Utilities.LocalStorageConstant_Author) !== undefined) return;


        //genereate guid for author
        const authorIdentifier = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0; // Random integer between 0 and 15
            const v = c === 'x' ? r : (r & 0x3 | 0x8); // Use 0x8 for 'y'
            return v.toString(16); // Convert to hexadecimal
        });

        const author: AuthorDTO = { Author: authorIdentifier };
        Utilities.LocalStorage_SetItem(author, Utilities.LocalStorageConstant_Author);
    }

    public static ReplaceUserDetailsPlaceHoldersInModule(moduleText: string): string {
        /* find "[player name]" & "[pronoun]" in the text and replace with data from local storage */
        const playerDetails = Utilities.GetPlayerDetailsFromStorage();
        if (playerDetails !== null && playerDetails !== undefined) {
            moduleText = moduleText.replace('[player name]', `<b>${playerDetails.Name}</b>`);
            moduleText = moduleText.replace('[pronoun]', `<b>${playerDetails.Pronoun}</b>`);
        }

        return moduleText;
    }

    //#endregion


    //#region Storage

    public static LocalStorage_LoadItem = (stateName: string) => {
        try {
            const serializedState = localStorage.getItem(stateName);

            if (serializedState === null) {
                return undefined;
            }

            return JSON.parse(serializedState);
        } catch (err) {
            return undefined;
        }
    };

    public static LocalStorage_SetItem = (value: any, stateName: string) => {
        try {
            const serializedState = JSON.stringify(value);
            localStorage.setItem(stateName, serializedState);
        } catch (err) {
            throw new Error("Can't save item in local storage.");
        }
    };

    public static LocalStorage_RemoveItem = (stateName: string) => {
        try {
            localStorage.removeItem(stateName);
        } catch (err) {
            throw new Error("Can't remove item from local storage.");
        }
    };


    public static readonly LocalStorageConstant_GeneratedKeywords: string = "gp_GeneratedKeywords";
    public static readonly LocalStorageConstant_PreviouslyUsedModules: string = "gp_PreviouslyUsedModules";
    public static readonly LocalStorageConstant_PlayerDetails: string = "gp_PlayerDetails";
    public static readonly LocalStorageConstant_Author: string = "gp_Author";

    //#endregion


    //#region Alerts

    public static Alert(data: CustomAlert): HTMLDivElement {
        const additionalClasses: string = (data.AdditionalClasses !== undefined ? (data.AdditionalClasses ? data.AdditionalClasses : '') : '');
        const overrideWidthToMax: string = data.OverrideWidthToMax !== undefined ? (data.OverrideWidthToMax ? 'w-100' : '') : '';
        const isDismissable: string = data.IsDismissable !== undefined ? (data.IsDismissable ? 'alert-dismissible fade show' : '') : '';

        let divClass: string = "";
        divClass = data.Format == "WithAccentColour"
            ? `alert bg-${data.Type} bg-opacity-25 border border-5 border-${data.Type} border-top-0 border-bottom-0 border-end-0 rounded-0`
            : `alert alert-${data.Type}`;
        divClass += ' ' + additionalClasses + ' ' + isDismissable + ' ' + overrideWidthToMax;

        const divAlert = document.createElement("div") as HTMLDivElement;
        divAlert.role = 'alert';
        divAlert.className = divClass;
        divAlert.innerHTML = data.Message + (data.IsDismissable !== undefined ? (data.IsDismissable ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : '') : '');

        return divAlert;
    }

    //#endregion
}