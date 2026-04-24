import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado o formato inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Validamos el token con la SDK de Admin
      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(token);
      
      // Inyectamos el usuario decodificado en la request para uso posterior
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        roles: decodedToken.roles || [], // Preparado para RBAC futuro
      };

      return true;
    } catch (error: any) {
      console.error('❌ Error validando Firebase Token:', error.message);
      throw new UnauthorizedException('Token de Firebase inválido o expirado');
    }
  }
}
