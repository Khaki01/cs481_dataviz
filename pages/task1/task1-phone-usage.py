from dash import html
from app import dash
import dash_bootstrap_components as dbc
from dash import dcc, callback, Output, Input
import plotly.express as px
from color_convert import color
import numpy as np
import plotly.graph_objects as go
from assets.dataset.task1 import app_data, app_names, app_data_total, piechart_values, app_data_total_by_category
from utils.index import dim_opacity, convert_to_hh_mm

colors_hex = ["#BB86FC", "#3700B3", "#03DAC6", "#FFDE03", "#808080"]
colors = [color.hex_to_rgba(col) for col in colors_hex]
# GALA
days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
goal = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
insta = [2, 1.5, 1.2, 1., 0.8, 0.7, 0.65]
tiktok = [1, 1.2, 1.5, 1.4, 0.2, 0.3, 1.]
play = [0.1, 0.3, 0.4, 0.6, 1.5, 0, .35]
done = np.add(insta, np.add(tiktok, play))
# GALA

pie = px.pie(labels=app_names, values=piechart_values,  hover_data=[piechart_values], template="plotly_dark", width=600, height=500,
             color_discrete_sequence=colors)
data = [
    go.Scatter(
        x=[i for i in range(1, 25)],
        y=app_data_total,
        mode='lines',
        name="Total",
        line=dict(color=colors[-1], shape="spline", width=3),
        fill="tozeroy",
        fillcolor=dim_opacity(colors_hex[-1], opacity=0.3)
    ),
]

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
    dbc.Card([dcc.Graph(id="distplot", figure=dict(data=data))]),
    dbc.Card([dcc.Graph(id="pie", figure=pie)]),
])


@callback(
    Output(component_id="pie", component_property="figure", allow_duplicate=True),
    Output("distplot", "figure", allow_duplicate=True),
    Input(component_id="pie", component_property="clickData"),
    config_prevent_initial_callbacks=True
)

def update_graph(clickData):
    pos = int(clickData['points'][0]['label'])
    array = [0 for i in range(len(app_names))]
    array[pos] = 0.5
    colors_updated = [color[:-2] + "0.5)" if i != pos else color for (i, color) in enumerate(colors)]
    pie.update_traces(pull=array,
                      selector=dict(type="pie"),
                      marker=dict(colors=colors_updated))
    updated_data = [
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=app_data_total,
            mode='lines',
            name="Total",
            line=dict(color=colors[-1], shape="spline", width=3),
            fill="tozeroy",
            fillcolor=dim_opacity(colors_hex[-1], opacity=0.3)
        ),
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=app_data[pos],
            mode='lines',
            name=app_names[pos],
            line=dict(color=colors[pos], shape="spline", width=3),
            fill="tozeroy"
        )
    ]
    pie.layout.annotations = ()
    pie.add_annotation(text=app_names[pos], showarrow=False, x=0.5, y=1.15, font=dict(size=16, color=colors[pos]))
    pie.add_annotation(text="You have used {} for {} hours today".format(app_names[pos],
             convert_to_hh_mm(app_data_total_by_category[pos])), showarrow=False, x=1, y=1.05, font=dict(size=14))
    return pie, dict(data=updated_data)


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
        # fig.add_trace(go.Scatter(x=days_subset, y=app_data))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig
    else:
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]

        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal")
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra", marker=dict(color=colors))
        fig = go.Figure(data=[trace1, trace2])
        fig.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
        return fig
