import { Matches, ValidationOptions } from 'class-validator';

// formato de uuid sem exigir versão/variante (os ids do seed não seguem nenhuma versão, então @IsUUID os rejeita)
const ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const IsId = (options?: ValidationOptions) =>
    Matches(ID_REGEX, { message: '$property deve ser um id válido', ...options });
