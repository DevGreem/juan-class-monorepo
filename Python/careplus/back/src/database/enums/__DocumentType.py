from enum import Enum


class DocumentType(str, Enum):
    cedula = "cedula"
    pasaporte = "pasaporte"
    otro = "otro"
