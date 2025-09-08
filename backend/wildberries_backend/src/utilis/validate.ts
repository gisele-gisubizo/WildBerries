import { validate } from "class-validator";

export const validateEntity = async (entity: any) => {
  const errors = await validate(entity);
  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();
    throw new Error(messages.join(", "));
  }
};
