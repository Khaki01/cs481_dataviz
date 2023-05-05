from dash import html, dcc
from app import dash
# src=app.get_asset_url('my-image.png')
dash.register_page(
    __name__,
    path='/phone-usage',
    title='Phone usage',
    image='logo.png',
    description='Explore phone usage'
)

layout = html.Div('task1-phone-usage')
