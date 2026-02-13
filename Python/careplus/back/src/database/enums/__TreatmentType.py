from enum import Enum


class TreatmentType(str, Enum):
    medicamento = "medicamento"
    terapia = "terapia"
    cirugia = "cirugia"
    procedimiento = "procedimiento"
    otro = "otro"
