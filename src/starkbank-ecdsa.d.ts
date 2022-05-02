declare module 'starkbank-ecdsa' {
    export class PublicKey {
        toDer(): string;

        toPem(): string;

        toString(): string;

        static fromDer(str: string): PublicKey;

        static fromPem(str: string): PublicKey;

        static fromString(str: string): PublicKey;
    }

    export class PrivateKey {
        publicKey(): PublicKey;

        toDer(): string;

        toPem(): string;

        toString(): string;

        static fromDer(str: string): PrivateKey;

        static fromPem(str: string): PrivateKey;

        static fromString(str: string): PrivateKey;
    }

    export class Signature {
        toBase64(): string;

        toDer(): string;

        static fromBase64(str: string): Signature;

        static fromDer(str: string): Signature;
    }

    export const utils: {
        File: {
            read: any;
        };
    };

    export namespace Ecdsa {
        function sign(message: string, privateKey: PrivateKey, hashfunc?: any, randNum?: number): Signature;

        function verify(message: string, signature: Signature, publicKey: PublicKey, hashfunc?: any): boolean;

    }
}


