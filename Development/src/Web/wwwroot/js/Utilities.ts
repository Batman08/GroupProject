class Utilities {
    public static Controller(): string {
        return window.location.pathname + "?handler=";
    }

    public static GetVerficationToken(formEl: HTMLFormElement): string {
        const token = formEl.querySelector("input[name=__RequestVerificationToken]") as HTMLInputElement;
        return token ? token.value : "";
    }
}