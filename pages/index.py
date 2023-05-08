import dash
from dash import html

dash.register_page(
    __name__,
    path='/',
    title='Explore your data!',
    image='logo.png',
    description='Explore your data!'
)

layout = html.Div('Main page')
