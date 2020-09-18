import { Product } from 'src/entities/Product';

export const validatePrice = (
  amount: number,
  size: string,
  product: Product | undefined | false = false
) => {
  const errors = [];

  if (size.length === 0) {
    errors.push({
      field: 'size',
      message: 'el talle tiene que tener 1 carácter o mas',
    });
  }

  if (amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'el precio tiene que ser mayor a 0',
    });
  }

  if (product) {
    if (typeof product === 'undefined') {
      return errors.push({
        field: 'productId',
        message: 'el producto seleccionado no existe',
      });
    }
  }

  if (errors.length !== 0) {
    return { errors: errors };
  }

  return false;
};
