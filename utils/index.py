from color_convert import color as color_convert
from time import strftime


def dim_opacity(color: str, opacity: float):
    return color_convert.hex_to_rgba(color)[:-2] + str(opacity) + ")"


def convert_to_hh_mm(time: int):
    hours = time // 60
    minutes = time % 60
    return "{} hours {} minutes".format(hours, minutes)


palette = {
    'white': '#ffffff',
    'black': '#000000',
    'success': '#71dd37',
    'dark': '#233446',
    'info': '#03c3ec',
    'warning': '#ffab00',
    'error': '#ff3e1d',
    'primary': '#696cff',
    'teal': '#20c997',
    'secondary': '#697a8d',
    'secondary-disabled': 'rgba(105, 108, 255, 0.16)',
    'text-secondary': '#566a7f',
    'background': '#f5f5f9',
    'background-secondary': '#8592a3',
}

font_family = "Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, " \
              "Droid Sans, Helvetica Neue, sans-serif"
