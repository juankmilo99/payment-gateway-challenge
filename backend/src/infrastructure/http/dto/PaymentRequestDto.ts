import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, ValidateNested, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class DeliveryDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  cardNumber: string;

  @IsString()
  @IsNumberString()
  @Length(2, 2)
  expMonth: string;

  @IsString()
  @IsNumberString()
  @Length(2, 2)
  expYear: string;

  @IsString()
  @IsNumberString()
  @Length(3, 4)
  cvc: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;
}

export class PaymentRequestDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
