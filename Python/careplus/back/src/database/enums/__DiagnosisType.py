from enum import Enum


class DiagnosisType(str, Enum):
    presuntivo = "presuntivo"
    definitivo = "definitivo"
    diferencial = "diferencial"
