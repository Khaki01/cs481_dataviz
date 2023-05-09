import dash
from dash import html, dcc, callback, Output, Input
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import numpy as np
from utils.index import dim_opacity
from assets.dataset.task1 import activities_names, activities_data, activities_data_total, linebar_values, days,\
    running, cycling, workout, goal_health_activity, done_health_activity

dash.register_page(
    __name__,
    path='/health-activity',
    title='Health activity',
    image='logo.png',
    description='Explore health activity'
)

# Plot
colors1 = ['rgba(0, 0, 255, 0.7)'] * 7
goal1 = list(np.asarray(goal_health_activity))
extra = np.subtract(done_health_activity, goal1)
days_subset = days[-7:]
goal_subset = goal1[-7:]
done_subset = done_health_activity[-7:]
extra_subset = extra[-7:]
colors = ['green' if x >= 0 else 'red' for x in extra_subset]
plot_data = [
    go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=colors1, opacity=0.7)),
    go.Bar(x=days_subset, y=extra_subset, name="extra/left", marker=dict(color=colors, opacity=0.7))
]
plot = go.Figure(data=plot_data)
plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
plot.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")
# Plot


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


@callback(Output("dist_plot", "figure", allow_duplicate=True), Input("bar_plot", 'clickData'),
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
                id='days_dropdown',
                options=[
                    {'label': '1 week', 'value': 7},
                    {'label': '5 days', 'value': 5},
                    {'label': '3 days', 'value': 3},
                ],
                value=7,
                style={'width': '150px', 'margin-left': '20px'}
            ),
            dcc.Dropdown(
                id='activity_dropdown',
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
                    id='goal_slider',
                    min=2000,
                    max=4500,
                    step=250,
                    value=2000,
                    marks={
                        2000: {'label': '2000J'},
                        4500: {'label': '4500J'}
                    },
                    tooltip={"placement": "bottom", "always_visible": True}
                ),
            ], style={'width': '16%', 'margin-left': '20px', 'margin-top': '5px'}),
        ], style={'display': 'flex'}),
        dcc.Graph(
            id='plot',
            style={'margin-top': '10px'},
            hoverData={'points': [{'pointNumber': None}]},
            figure=plot
        )
    ]),
    dbc.Card([
        dbc.CardHeader("Phone usage"),
        dbc.CardBody([
            html.H4("Explore phone usage")
        ]),
        dbc.Card([dcc.Graph(id="dist_plot", figure=dict(data=data), style={'display': 'none'})]),
        dbc.Card([dcc.Graph(id="bar_plot", figure=fig, style={'display': 'none'})]),
    ])
])


@callback(
    Output('plot', 'figure', allow_duplicate=True),
    Output('dist_plot', 'style', allow_duplicate=True),
    Output('bar_plot', 'style', allow_duplicate=True),
    Input('days_dropdown', 'value'),
    Input('activity_dropdown', 'value'),
    Input('goal_slider', 'value'),
    Input('plot', 'clickData'),
    Input('plot', 'hoverData'),
    config_prevent_initial_callbacks=True
)
def update_plot(days_dropdown, activity_dropdown, goal_slider, plot_click, hoverData):

    goal1 = list(np.asarray(goal_health_activity) + (goal_slider - 2000))
    extra = np.subtract(done_health_activity, goal1)
    days_dropdown = days_dropdown * -1
    days_subset = days[days_dropdown:]
    goal_subset = goal1[days_dropdown:]
    done_subset = done_health_activity[days_dropdown:]
    extra_subset = extra[days_dropdown:]

    physical_data = []
    updated_plot = None
    if activity_dropdown != "all":
        if activity_dropdown == 'running':
            physical_data = running[days_dropdown:]
        elif activity_dropdown == 'cycling':
            physical_data = cycling[days_dropdown:]
        elif activity_dropdown == 'workout':
            physical_data = workout[days_dropdown:]
        other_subset = np.subtract(done_subset, physical_data)

        colors3 = ["orange"] * 7
        colors4 = ["green"] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData['points'][0]['pointNumber']
            if point_number is not None:
                colors3[point_number] = 'dark' + colors3[point_number]
                colors4[point_number] = 'dark' + colors4[point_number]

        trace3 = go.Bar(x=days_subset, y=physical_data, name=activity_dropdown, marker=dict(color=colors3))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="Other Activities", marker=dict(color=colors4, opacity=0.2))
        data = [trace3, trace4]
        updated_plot = go.Figure(data=data)
        # fig.add_trace(go.Scatter(x=days_subset, y=physical_data))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        updated_plot.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")



    else:
        colors = ['green' if x >= 0 else 'red' for x in extra_subset]
        colors1 = ['rgba(0, 0, 255, 0.7)'] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData['points'][0]['pointNumber']
            if point_number is not None:
                colors[point_number] = 'dark' + colors[point_number]
                colors1[point_number] = 'rgba(0, 0, 255, 0.9)'
        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=colors1, opacity=0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra/left", marker=dict(color=colors, opacity=0.7))
        data = [trace1, trace2]
        updated_plot = go.Figure(data=data)
        updated_plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        updated_plot.update_layout(title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack")

    style = {'display': 'block'} if plot_click else {'display': 'none'}
    return updated_plot, style, style
