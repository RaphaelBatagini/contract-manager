class ClientNotFoundError extends Error {
    constructor(id) {
        super(`Client ${id} not found`);
        this.name = 'ClientNotFoundError';
    }
}

module.exports = ClientNotFoundError;