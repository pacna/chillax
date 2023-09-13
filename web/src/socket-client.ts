export class SocketClient {
    private _socket: WebSocket;
    private _onMessageCallback: (message: string) => void;

    constructor(url: string) {
        this._socket = new WebSocket(url);
        this._onMessageCallback = () => {};

        this._socket.addEventListener("message", this.onMessage.bind(this));
        this._socket.addEventListener("close", this.onClose.bind(this));
    }

    handleReceivedMsg(callback: (message: string) => void): void {
        this._onMessageCallback = callback;
    }

    async send<T>(msg: T): Promise<void> {
        await this.waitForSocketToBeOpen();
        this._socket.send(JSON.stringify(msg));
    }

    close(): void {
        this._socket.close();
    }

    private onMessage(event: MessageEvent): void {
        this._onMessageCallback(event.data);
    }

    private onClose(event: CloseEvent): void {
        if (event.wasClean) {
            console.log("Socket connection closed");
            return;
        }

        console.error("Connection died");
    }

    private async waitForSocketToBeOpen(): Promise<void> {
        if (this._socket.readyState === WebSocket.OPEN) {
            return;
        }

        return await new Promise<void>(
            (resolve: () => void | Promise<void>) => {
                this._socket.addEventListener("open", resolve);
            }
        );
    }
}
