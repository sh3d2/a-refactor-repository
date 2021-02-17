export interface Payload {
    userId: number,
    name: string,
    role: string,
    iat: number,
    exp: number,
    iss: string,
    sub: number
}

export interface User {
    userId: number,
    name: string,
    role: 'basic'|'premium',
}