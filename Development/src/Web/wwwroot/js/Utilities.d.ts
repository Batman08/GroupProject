type CustomAlert = {
    Message: string;
    Format: "Default" | "WithAccentColour";
    Type: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    AdditionalClasses?: string;
    OverrideWidthToMax?: boolean;
    IsDismissable?: boolean;
}