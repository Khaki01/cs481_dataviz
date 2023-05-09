import dash
from dash import html, dcc, callback, Output, Input
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import numpy as np
from assets.dataset.task1 import activities_names, activities_data, activities_data_total, linebar_values
from utils.index import dim_opacity

dash.register_page(
    __name__,
    path='/health-activity',
    title='Health activity',
    image='logo.png',
    description='Explore health activity'
)

# GALA
days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
running = [500, 600, 800, 700, 900, 750, 850]
cycling = [350, 400, 500, 450, 550, 600, 700]
workout = [600, 700, 650, 800, 750, 700, 900]
goal = [100, 312, 550, 816, 1114, 1447, 1819]
done = np.add(running, np.add(cycling, workout))
# GALA

fig = go.Figure()

colors = ["#BB86FC", "#3700B3", "#03DAC6", "#FFDE03", "#808080"]

data = [
    go.Scatter(
        x=[i for i in range(1, 25)],
        y=activities_data_total,
        mode='lines',
        name="Total",
        line=dict(color=colors[-1], shape="spline", width=3),
        fill="tozeroy",
        fillcolor=dim_opacity(colors[-1], opacity=0.3)
    ),
]

for i in range(0, len(linebar_values)):
    fig.add_trace(go.Bar(
        x=[linebar_values[i]], y=[""],
        customdata=[activities_names[i]],
        orientation='h',
        marker=dict(
            color=colors[i],
            line=dict(color='rgb(248, 248, 249)', width=1)
        )
    ))

fig.update_layout(
    width=500,
    height=220,
    xaxis=dict(
        showline=False,
        showticklabels=False,
    ),
    yaxis=dict(
        showline=False,
        showticklabels=False,
    ),
    barmode="stack",
    paper_bgcolor='rgb(248, 248, 255)',
    plot_bgcolor='rgb(248, 248, 255)',
)

fig.add_vrect(x0=-sum(linebar_values) * 0.015, x1=sum(linebar_values) * 1.3)
fig.add_vline(x=sum(linebar_values) * 1.1, line_color="red", annotation=dict(x=sum(linebar_values) * 1.1 + 300, y=1.5),
              fillcolor="red", line_dash="dot",
              annotation_position="top left", annotation_text="100%")


@callback(Output("distplot", "figure", allow_duplicate=True), Input("barplot", 'clickData'),
          config_prevent_initial_callbacks=True)
def update_graph(clickData):
    label = clickData['points'][0]['customdata']
    index = activities_names.index(label)
    updated_data = [
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=activities_data_total,
            mode='lines',
            name="Total",
            line=dict(color=colors[-1], shape="spline", width=3),
            fill="tozeroy",
            fillcolor=dim_opacity(colors[-1], opacity=0.3)
        ),
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=activities_data[index],
            mode='lines',
            name=activities_names[index],
            line=dict(color=colors[index], shape="spline", width=3),
            fill="tozeroy"
        )
    ]
    return dict(data=updated_data)


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
                id='activitydropdown',
                options=[
                    {'label': 'All activities', 'value': 'all'},
                    {'label': 'Running', 'value': 'running'},
                    {'label': 'Cycling', 'value': 'cycling'},
                    {'label': 'Workout', 'value': 'workout'},
                ],
                value='all',
                style={'width': '150px', 'margin-left': '20px'}
            ),
            html.Div([
                html.Label('End Goal(joul):', style={'margin-left': '20px'}),
                dcc.Slider(
                    id='goalslider',
                    min=2000,
                    max=4500,
                    step=250,
                    value=2000,
                    marks={i: str(i) for i in range(10)},
                    tooltip={"placement": "bottom", "always_visible": True}
                ),
            ], style={'width': '16%', 'margin-left': '20px', 'margin-top': '5px'}),
        ], style={'display': 'flex'}),
        dcc.Graph(
            id='plot',
            style={'margin-top': '10px'}
        )
    ]),
    dbc.Card([
        dbc.CardHeader("Phone usage"),
        dbc.CardBody([
            html.H4("Explore phone usage")
        ]),
        dbc.Card([dcc.Graph(id="distplot", figure=dict(data=data))]),
        dbc.Card([dcc.Graph(id="barplot", figure=fig)]),
    ])
])


@callback(
    Output('plot', 'figure', allow_duplicate=True),
    Input('daysdropdown', 'value'),
    Input('activitydropdown', 'value'),
    Input('goalslider', 'value'),
    Input('plot', 'hoverData'),
    config_prevent_initial_callbacks=True
)
def update_plot(daysdropdown, appsdropdown, goalslider, hoverData):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal) + (goalslider - 2000))
    extra = np.subtract(done, goal1)
    daysdropdown = daysdropdown * -1
    days_subset = days[daysdropdown:]
    goal_subset = goal1[daysdropdown:]
    done_subset = done[daysdropdown:]
    extra_subset = extra[daysdropdown:]

    physical_data = []
    if appsdropdown != "all":
        if appsdropdown == 'running':
            physical_data = running[daysdropdown:]
        elif appsdropdown == 'cycling':
            physical_data = cycling[daysdropdown:]
        elif appsdropdown == 'workout':
            physical_data = workout[daysdropdown:]
        other_subset = np.subtract(done_subset, physical_data)
        trace3 = go.Bar(x=days_subset, y=physical_data, name=appsdropdown, marker=dict(color='orange'))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="Other Activities", marker=dict(color='green', opacity=0.2))
        data = [trace3, trace4]
        fig = go.Figure(data=data)
        # fig.add_trace(go.Scatter(x=days_subset, y=physical_data))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")



    else:
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]

        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(opacity=0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra/left", marker=dict(color=colors, opacity=0.7))
        # if hoverData:
        #     point_index = hoverData['points'][0]['pointNumber']
        #     trace1['marker']['opacity'] = [0.7 if i != point_index else 1.0 for i in range(daysdropdown)]
        #     trace2['marker']['opacity'] = [0.7 if i != point_index else 1.0 for i in range(daysdropdown)]
        data = [trace1, trace2]
        fig = go.Figure(data=data)
        fig.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        fig.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        fig.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")

    return fig
