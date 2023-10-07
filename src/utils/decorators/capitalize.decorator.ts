import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { CategoryType } from 'src/categories/enums/category-type.enum';
import { StringHelper } from '../helpers/string.helper';

export function Capitalize(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CapitalizeConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Capitalize' })
@Injectable()
export class CapitalizeConstraint implements ValidatorConstraintInterface {
  // constructor(
  //   @Inject(StringHelper) private readonly stringHelper: StringHelper,
  // ) {}

  @Inject(StringHelper)
  private readonly stringHelper: StringHelper;

  validate(value: any, args: ValidationArguments) {
    let type = value != '' ? this.stringHelper.capitalize(value) : undefined;
    console.log('type', type);

    console.log(CategoryType[type]);

    return CategoryType[type];
  }

  // defaultMessage(args: ValidationArguments) {
  //   console.log(args, args.constraints);

  //   const [relatedPropertyName] = args.constraints;
  //   return `${relatedPropertyName} and ${args.property} don't match`;
  // }
}
