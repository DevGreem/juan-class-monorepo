from enum import Enum


class Severity(str, Enum):
    leve = "leve"
    moderado = "moderado"
    grave = "grave"
    critico = "critico"
