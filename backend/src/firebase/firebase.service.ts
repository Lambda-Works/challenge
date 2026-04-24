import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: admin.app.App;

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'lambda-a-269f7';
    
    // Si ya existe una app inicializada, no la volvemos a inicializar
    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(this.getServiceAccount()),
        projectId: projectId,
      });
      console.log('🔥 Firebase Admin SDK inicializado correctamente');
    } else {
      this.firebaseApp = admin.app();
    }
  }

  private getServiceAccount(): admin.ServiceAccount {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountJson) {
      try {
        return JSON.parse(serviceAccountJson);
      } catch (error) {
        console.error('❌ Error parseando FIREBASE_SERVICE_ACCOUNT:', error);
      }
    }

    // Retornamos un objeto vacío o valores por defecto para evitar que explote, 
    // pero idealmente esto debería estar en una variable de entorno.
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || 'lambda-a-269f7',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }

  getAuth() {
    return admin.auth();
  }
}
