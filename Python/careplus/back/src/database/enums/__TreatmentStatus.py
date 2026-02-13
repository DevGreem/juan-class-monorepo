from enum import Enum


class TreatmentStatus(str, Enum):
    activo = "activo"
    completado = "completado"
    suspendido = "suspendido"
    cancelado = "cancelado"
