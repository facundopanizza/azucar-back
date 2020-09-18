import { Brand } from 'src/entities/Brand';

export const validateProduct = (
  title: string,
  brandCode: string,
  brand?: Brand | undefined,
  updating: boolean = false
) => {
  const errors = [];
  console.log(brand);

  if (title.length === 0) {
    errors.push({
      field: 'title',
      message: 'el nombre del producto tiene que tener 1 carácter o mas',
    });
  }

  if (brandCode.length === 0) {
    errors.push({
      field: 'brandCode',
      message: 'el código del producto tiene que tener 1 carácter o mas',
    });
  }

  if (brand === undefined && !updating) {
    errors.push({
      field: 'brandId',
      message: 'la marca seleccionada no existe',
    });
  }

  if (errors.length !== 0) {
    return { errors: errors };
  }

  return false;
};
