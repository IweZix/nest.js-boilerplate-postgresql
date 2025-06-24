export class Channel {
    id: string;
    name: string;
    parentName: string;

    constructor(id: string, name: string, parentName: string) {
        this.id = id;
        this.name = name;
        this.parentName = parentName;
    }
}