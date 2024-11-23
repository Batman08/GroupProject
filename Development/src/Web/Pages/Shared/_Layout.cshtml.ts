class _Layout {
    private static readonly _divElementTemplates = document.querySelector("#divElementTemplates") as HTMLDivElement;
    public static ElementTemplates(): HTMLDivElement {
        return this._divElementTemplates;
    }

    public static readonly _divPlayerDetailsModal = document.getElementById('divPlayerDetailsModal') as HTMLDivElement;
    public static readonly _playerDetailsModal = new bootstrap.Modal(this._divPlayerDetailsModal) as bootstrap.Modal;
}