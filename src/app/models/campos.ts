export class Campo {
    id?: string;
    name: string;
    controlType: string;
    value: string|number;
    key: string;
    label: string;
    required: boolean;
    constructor() {
        
    }
}

export enum controlTypes {
    TEXT_BOX = "textbox",
    DROPDOWN = "dropdown",
    CHECKBOX = "checkbox",
    // agregar otros tipos, incluyendo formula
}