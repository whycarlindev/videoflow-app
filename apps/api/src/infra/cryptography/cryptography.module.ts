import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { Encrypter } from '@/domain/account/application/cryptography/encrypter'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: env.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [
    BcryptHasher,
    JwtEncrypter,
    { provide: HashGenerator, useExisting: BcryptHasher },
    { provide: HashComparer, useExisting: BcryptHasher },
    { provide: Encrypter, useExisting: JwtEncrypter },
  ],
  exports: [HashGenerator, HashComparer, Encrypter, JwtModule],
})
export class CryptographyModule {}
