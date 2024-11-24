class _Layout {
    public static readonly _divPlayerDetailsModal = document.getElementById('divPlayerDetailsModal') as HTMLDivElement;
    public static readonly _playerDetailsModal = new bootstrap.Modal(this._divPlayerDetailsModal) as bootstrap.Modal;

    public static ElementTemplates(): HTMLDivElement {
        return this._divElementTemplates;
    }


    private static readonly _divElementTemplates = document.querySelector("#divElementTemplates") as HTMLDivElement;
}