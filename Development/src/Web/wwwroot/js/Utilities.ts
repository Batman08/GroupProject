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