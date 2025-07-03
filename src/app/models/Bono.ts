export class Bono {
  idBono: number = 0;
  nombre: string = "";
  montonominal: number = 0;
  moneda: string = "";
  tasainteres: number = 0;
  frecuenciapago: string = "";
  plazomeses: number = 0;
  fechaemision: Date = new Date(Date.now());
  idUsuario: number = 0;

  // ⚠️ Nuevo campo para mapear gracia por periodo
  mapaGraciaPorPeriodo: { [periodo: number]: string } = {};
}
