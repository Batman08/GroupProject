class Utilities {
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
}