export class RequestError  extends Error {
    public readonly code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
        this.name = 'RequestError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class SystemError  extends Error {
    public readonly code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
        this.name = 'SystemError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export const ERROR_CODES = {
    INVALID_REQUEST: 'PLAYER_REQUEST_ERROR_INVALID_REQUEST',
    TIMEOUT: 'PLAYER_REQUEST_ERROR_TIMEOUT',
    無法下注_已封盤: '無法下注_已封盤'
} as const;