from color_convert import color as color_convert
from time import strftime

def dim_opacity(color: str, opacity: float):
    return color_convert.hex_to_rgba(color)[:-2] + str(opacity) + ")"

def convert_to_hh_mm(time: int):
    hours = time // 60
    minutes = time % 60
    return "{} hours {} minutes".format(hours, minutes)
