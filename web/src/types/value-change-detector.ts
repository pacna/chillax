export interface ValueChangeDetector<T> {
    hasValueAndChanged(incomingValue: T): boolean;
    hasValue(): boolean;
    getValue(): T;
}

export function ValueChangeDetector<T>(value: T): ValueChangeDetector<T> {
    return {
        hasValueAndChanged(incomingValue: T): boolean {
            if (incomingValue === null || incomingValue === undefined) {
                return false;
            }

            return incomingValue !== value;
        },

        hasValue(): boolean {
            return value !== null && value !== undefined;
        },

        getValue(): T {
            return value;
        },
    };
}
