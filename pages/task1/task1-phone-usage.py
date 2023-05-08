from dash import html
from app import dash
import dash_bootstrap_components as dbc
from dash import dcc, callback, Output, Input
import plotly.express as px
import plotly.figure_factory as ff
from color_convert import color
import numpy as np
import plotly.graph_objects as go
density = [[150, 120, 130, 140, 140, 130, 120, 110], [100, 120, 130, 100, 90, 80, 70, 70], [100, 120, 130, 100, 90, 80, 70, 70], [100, 120, 130, 100, 90, 80, 70, 70]]
labels = ['Instagram', 'Kakaotalk', 'Youtube', 'Netflix']
values = [4500, 2500, 1053, 500]
colors = [color.hex_to_rgba(col) for col in px.colors.sequential.Plasma[:len(labels) + 1]]

# GALA
days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
goal = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
insta = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
tiktok = [1, 1.2, 1.5, 1.4, 0.2, 0.3, 1.]
play = [0.1, 0.3, 0.4, 0.6, 1.5, 0, .35]
done = np.add(insta, np.add(tiktok, play))
# GALA

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
        html.Div([

            dcc.Dropdown(
                id='daysdropdown',
                options=[
                    {'label': '1 week', 'value': 7},
                    {'label': '5 days', 'value': 5},
                    {'label': '3 days', 'value': 3},
                ],
                value=7,
                style={'width': '150px', 'margin-left': '20px'}
            ),
            dcc.Dropdown(
                id='appsdropdown',
                options=[
                    {'label': 'All apps', 'value': 'all'},
                    {'label': 'TikTok', 'value': 'tiktok'},
                    {'label': 'Instagram', 'value': 'insta'},
                    {'label': 'Play Market', 'value': 'play'},
                ],
                value='all',
                style={'width': '150px', 'margin-left': '20px'}
            ),
            html.Div([
                html.Label('End Goal(hour):', style={'margin-left': '20px'}),
                dcc.Slider(
                    id='goalslider',
                    min=0,
                    max=10,
                    step=1,
                    value=0,
                    marks={i: str(i) for i in range(11)},
                    tooltip={"placement": "bottom", "always_visible": True}
                ),
            ], style={'width': '16%', 'margin-left': '20px', 'margin-top': '5px'}),
        ], style={'display': 'flex'}),
        dcc.Graph(id='plot', style={'margin-top': '10px'})
    ]),
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

@callback(
    Output('plot', 'figure', allow_duplicate=True),
    Input('daysdropdown', 'value'),
    Input('appsdropdown', 'value'),
    Input('goalslider', 'value'),
    config_prevent_initial_callbacks=True
    )
def update_plot(daysdropdown, appsdropdown, goalslider):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal) + goalslider)
    extra = np.subtract(done, goal1)
    daysdropdown = daysdropdown * -1
    days_subset = days[daysdropdown:]
    goal_subset = goal1[daysdropdown:]
    done_subset = done[daysdropdown:]
    extra_subset = extra[daysdropdown:]

    app_data = []
    if appsdropdown != "all":
        if appsdropdown == 'tiktok':
            app_data = tiktok[daysdropdown:]
        elif appsdropdown == 'insta':
            app_data = insta[daysdropdown:]
        elif appsdropdown == 'play':
            app_data = play[daysdropdown:]
        other_subset = np.subtract(done_subset, app_data)
        trace3 = go.Bar(x=days_subset, y=app_data, name=appsdropdown, marker=dict(color='orange'))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="Other Apps", marker=dict(color='rgba(0, 128, 0, 0.2)'))
        fig = go.Figure(data=[trace3, trace4])
        #fig.add_trace(go.Scatter(x=days_subset, y=app_data))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig
    else:
        app_data = []
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]

        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal")
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra", marker=dict(color=colors))
        fig = go.Figure(data=[trace1, trace2])
        fig.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig