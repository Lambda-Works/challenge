import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Lo hacemos global para que esté disponible en toda la app sin re-importar
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
