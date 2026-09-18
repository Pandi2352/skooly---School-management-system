import { Global, Module } from '@nestjs/common'
import { FILE_STORAGE } from './file-storage.interface'
import { LocalFileStorage } from './local-file-storage.service'

/** Provides FILE_STORAGE app-wide. Replace useClass to move uploads to cloud storage. */
@Global()
@Module({
  providers: [{ provide: FILE_STORAGE, useClass: LocalFileStorage }],
  exports: [FILE_STORAGE],
})
export class StorageModule {}
