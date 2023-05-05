import dash
from dash import html

dash.register_page(
    __name__,
    path='/health-activity',
    title='Health activity',
    image='logo.png',
    description='Explore health activity'
)

layout = html.Div('task1-health-activity')
