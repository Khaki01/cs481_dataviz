from dash import html
from app import dash
import dash_bootstrap_components as dbc
from dash import dcc, callback, Output, Input
import plotly.express as px
import plotly.figure_factory as ff
from color_convert import color

density = [[150, 120, 130, 140, 140, 130, 120, 110], [100, 120, 130, 100, 90, 80, 70, 70], [100, 120, 130, 100, 90, 80, 70, 70], [100, 120, 130, 100, 90, 80, 70, 70]]
labels = ['Instagram', 'Kakaotalk', 'Youtube', 'Netflix']
values = [4500, 2500, 1053, 500]
colors = [color.hex_to_rgba(col) for col in px.colors.sequential.Plasma[:len(labels) + 1]]

pie = px.pie(labels=labels, values=values, template="plotly_dark", width=600, height=500,
             color_discrete_sequence=colors)

dist = ff.create_distplot(density, labels, colors=colors, show_rug=False)


dash.register_page(
    __name__,
    path='/phone-usage',
    title='Phone usage',
    image='logo.png',
    description='Explore phone usage'
)

layout = html.Div([
    dbc.Card([
        dbc.CardHeader("Health activity"),
        dbc.CardBody([
            html.H4("Explore health activity")
        ])
    ]),
    dbc.Card([dcc.Graph(id="distplot", figure=dist)]),
    dbc.Card([dcc.Graph(id="pie", figure=pie)])
])


@callback(
    Output(component_id="pie", component_property="figure", allow_duplicate=True),
    Input(component_id="pie", component_property="clickData"),
    config_prevent_initial_callbacks=True
)
def update_graph(clickData):
    pos = int(clickData['points'][0]['label'])
    array = [0 for i in range(len(labels))]
    array[pos] = 0.5
    colors_updated = [color[:-2] + "0.5)" if i != pos else color for (i, color) in enumerate(colors)]
    pie.update_traces(pull=array, selector=dict(type="pie"), marker=dict(colors=colors_updated))
    pie.update_layout()
    return pie
