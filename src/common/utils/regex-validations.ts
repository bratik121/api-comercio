export const validName = (name: string) =>
  !name.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'´]{3,}$/i);

export const validEmail = (email: string) =>
  !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i);
