from enum import Enum


class Gender(str, Enum):
    masculino = "masculino"
    femenino = "femenino"
    otro = "otro"
