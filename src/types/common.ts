export type Rol = 'admin' | 'profesor' | 'alumno';

export type Nivel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';

export const DIAS_SEMANA: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

export const NIVELES: Nivel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** Referencia liviana a un usuario, para no repetir todo el documento en subcolecciones */
export interface UsuarioRef {
  uid: string;
  nombre: string;
}
