from enum import Enum


class ConsultationStatus(str, Enum):
    programada = "programada"
    en_curso = "en_curso"
    completada = "completada"
    cancelada = "cancelada"
