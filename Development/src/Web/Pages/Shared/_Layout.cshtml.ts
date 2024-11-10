class _Layout {
    private static readonly _divElementTemplates = document.querySelector("#divElementTemplates") as HTMLDivElement;
    public static ElementTemplates(): HTMLDivElement {
        return this._divElementTemplates;
    }
}