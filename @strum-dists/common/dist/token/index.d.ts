export declare namespace LocalToken {
    function getToken(): string;
    function setToken(token: string): void | Promise<never>;
    function invalidate(): void | Promise<never>;
}
