class Script {
    constructor( data = {}) {
        this.name = data.name;
        this.url = data.url;
        this.description = data.description;
        this.local = data.local
    }
}

export { Script };