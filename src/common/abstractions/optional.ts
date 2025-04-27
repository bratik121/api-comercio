export class Optional<T> {
	private value: T | undefined;
	private assigned: boolean;

	constructor(value: T | undefined) {
		this.value = value;
		this.assigned = value !== undefined;
	}

	getValue(): T {
		if (!this.hasValue()) {
			throw new Error("No se puede devolver un valor de un Optional vacío");
		}
		return <T>this.value;
	}

	hasValue(): boolean {
		return this.assigned;
	}

	unWrap(): T | undefined {
		return this.value;
	}
}
