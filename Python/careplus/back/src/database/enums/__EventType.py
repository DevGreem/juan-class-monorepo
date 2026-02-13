from enum import Enum


class EventType(str, Enum):
    consulta = "consulta"
    diagnostico = "diagnostico"
    tratamiento = "tratamiento"
    nota = "nota"
