import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [ContactsModule, FirebaseModule],
})
export class AppModule {}
