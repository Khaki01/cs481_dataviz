import dash
from dash import html, dcc, callback, Output, Input
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import numpy as np
from utils.index import dim_opacity, palette, font_family
from assets.dataset.task1 import activities_names, activities_data, activities_data_total, linebar_values, days, \
    running, cycling, workout, goal_health_activity, done_health_activity

dash.register_page(
    __name__,
    path="/health-activity",
    title="Health activity",
    image="logo.png",
    description="Explore health activity",
)


def return_plot_layout_settings(time_dropdown_value=None):
    xaxis = "Week" if time_dropdown_value == 7 or time_dropdown_value is None else "Days"
    return go.Layout(margin={'t': 0}, barmode="stack", paper_bgcolor=palette['white'],
                     plot_bgcolor=palette['white'], xaxis=go.layout.XAxis(title=xaxis,
                                                                          titlefont=dict(
                                                                              color=palette['text-secondary'],
                                                                              family=font_family)),
                     yaxis=go.layout.YAxis(title="Calories", range=[0, 4500], titlefont=dict(
                         color=palette['text-secondary'],
                         family=font_family
                     )))


goal1 = list(np.asarray(goal_health_activity))
extra = np.subtract(done_health_activity, goal1)
days_subset = days[-7:]
goal_subset = goal1[-7:]
done_subset = done_health_activity[-7:]
extra_subset = extra[-7:]
plot_data = [
    go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=[palette['primary']] * 7, opacity=0.7)),
    go.Bar(x=days_subset, y=extra_subset, name="extra/left",
           marker=dict(color=[palette['success'] if x >= 0 else palette['error'] for x in extra_subset], opacity=0.7)),
    go.Scatter(x=days_subset, y=goal_subset, name="goal", line=dict(color=palette['info'])),
    go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error']))
]

plot = go.Figure(data=plot_data, layout=return_plot_layout_settings(None))
# Plot


colors = [palette['primary'], palette['info'], palette['success'], palette['warning'], palette['secondary']]

time_dropdown_options = [
    {"label": "1 week", "value": 7},
    {"label": "5 days", "value": 5},
    {"label": "3 days", "value": 3}
]

activities_dropdown_options = [
    {"label": "All activities", "value": "all"},
    {"label": "Running", "value": "running"},
    {"label": "Cycling", "value": "cycling"},
    {"label": "Workout", "value": "workout"},
]

dist_plot_data = [
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

dist_plot_layout = go.Layout(margin={'t': 0},
                             plot_bgcolor=palette['background'],
                             xaxis=go.layout.XAxis(
                                 title="Hours",
                                 titlefont=dict(
                                     color=palette['text-secondary'],
                                     family=font_family
                                 ),
                             ),
                             yaxis=go.layout.YAxis(
                                 title="Minutes",
                                 titlefont=dict(
                                     color=palette['text-secondary'],
                                     family=font_family
                                 )
                             )
                             )

dist_plot_figure = go.Figure(data=dist_plot_data, layout=dist_plot_layout)

fig_data = [go.Bar(x=[linebar_values[i]], y=[""],
                   customdata=[activities_names[i]],
                   orientation='h',
                   marker=dict(
                       color=colors[i],
                       line=dict(color='rgb(248, 248, 249)', width=1)
                   )) for i in range(0, len(linebar_values))]

fig_layout = go.Layout(margin={'t': 0, 'b': 0}, showlegend=False, xaxis=dict(
    showline=False,
    showticklabels=False,
),
                       yaxis=dict(
                           showline=False,
                           showticklabels=False,
                       ),
                       barmode="stack",
                       paper_bgcolor=palette['white'],
                       plot_bgcolor=palette['white'],
                       )
fig = go.Figure(data=fig_data, layout=fig_layout)

fig.add_vrect(x0=-sum(linebar_values) * 0.015, x1=sum(linebar_values) * 1.3)
fig.add_vline(x=sum(linebar_values) * 1.1, line_color=palette['error'],
              annotation=dict(x=sum(linebar_values) * 1.1 + 300, y=1.5),
              fillcolor="red", line_dash="dot",
              annotation_position="top left", annotation_text="100%")


@callback(Output("dist_plot_activity", "figure", allow_duplicate=True), Input("bar_plot", 'clickData'),
          config_prevent_initial_callbacks=True)
def update_graph(clickData):
    label = clickData["points"][0]["customdata"]
    index = activities_names.index(label)
    updated_data = [
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=activities_data_total,
            mode="lines",
            name="Total",
            line=dict(color=colors[-1], shape="spline", width=3),
            fill="tozeroy",
            fillcolor=dim_opacity(colors[-1], opacity=0.3),
        ),
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=activities_data[index],
            mode="lines",
            name=activities_names[index],
            line=dict(color=colors[index], shape="spline", width=3),
            fill="tozeroy",
        ),
    ]
    updated_dist_plot = go.Figure(data=updated_data, layout=dist_plot_layout)
    return updated_dist_plot


## attribution <a href="https://www.freepik.com/free-vector/outdoor-workout-training-healthy-lifestyle-open-air-jogging-fitness-activity-male-athlete-running-park-muscular-sportsman-exercising-outdoors-vector-isolated-concept-metaphor-illustration_11663630.htm#page=2&query=exercise%20cartoon&position=43&from_view=keyword&track=ais">Image by vectorjuice</a> on Freepik
layout = html.Div(
    [
        dbc.Card(
            [
                html.Div([
                    html.Div('Explore health activity', className="typography-h5-primary"),
                    html.P('Following patterns, towards healthier life!', className="p-secondary"),
                ]),
                html.Img(src="assets/exercising.jpg", width=100, height=100, className="image")
            ],
            className="graph-container-with-image"
        ),
        dbc.Card(
            [
                html.Div('Total activity', className="typography-h5-secondary"),
                html.P('Study activity patterns throughout periods', className="p-secondary",
                       style={'marginBottom': '16px'}),
                dbc.Row(
                    [
                        dcc.Dropdown(
                            clearable=False,
                            id="days_dropdown",
                            className="dropdown",
                            options=time_dropdown_options,
                            value=7,
                            style={"width": "100px"},
                        ),
                        dcc.Dropdown(
                            clearable=False,
                            id="activity_dropdown",
                            className="dropdown",
                            options=activities_dropdown_options,
                            value="all",
                            style={"width": "140px"},
                        ),
                        html.Div(
                            [
                                dcc.Slider(
                                    id="goal_slider",
                                    min=2000,
                                    max=4500,
                                    step=250,
                                    value=2000,
                                    marks={
                                        2000: {'label': '2000J', 'style': {'color': palette['error']}},
                                        4500: {'label': '4500J', 'style': {'color': palette['success']}}
                                    },
                                    className="slider",
                                    tooltip={"placement": "top", "always_visible": True}
                                ),
                            ],
                            className="slider-container"
                        ),
                    ],
                    className="graph-dropdown-container",
                    style={'paddingBottom': '16px'}
                ),
                dcc.Graph(id="plot_activity", hoverData={'points': [{'pointNumber': None}]}, figure=plot,
                          className="graph-style"),
            ],
            class_name="graph-container",
        ),
        dbc.Card(
            id="physical_activity_card",
            children=[
                html.Div('Daily activity', className="typography-h5-secondary"),
                html.P('Study detailed activity patterns', className="p-secondary",
                       style={'marginBottom': '16px'}),
                dcc.Graph(
                    id="dist_plot_activity",
                    figure=dist_plot_figure,
                    className="graph-style",
                ),
                html.Div('Physical activity breakdown', className="typography-h5-secondary",
                         style={'marginBottom': '16px'}),
                dcc.Graph(
                    id="bar_plot",
                    figure=fig,
                    className="bar-plot-style",
                )
            ],
            class_name="graph-container",
            style={'display': 'none'}
        ),
    ],
    className="main-container-task1",
)


@callback(
    Output('plot_activity', 'figure', allow_duplicate=True),
    Output('physical_activity_card', 'style', allow_duplicate=True),
    Input('days_dropdown', 'value'),
    Input('activity_dropdown', 'value'),
    Input('goal_slider', 'value'),
    Input('plot_activity', 'clickData'),
    Input('plot_activity', 'hoverData'),
    config_prevent_initial_callbacks=True
)
def update_plot(days_dropdown, activity_dropdown, goal_slider, plot_click, hoverData):
    goal1 = list(np.asarray(goal_health_activity) + (goal_slider - 2000))
    extra = np.subtract(done_health_activity, goal1)
    days_dropdown_inversed = days_dropdown * -1
    days_subset = days[days_dropdown_inversed:]
    goal_subset = goal1[days_dropdown_inversed:]
    done_subset = done_health_activity[days_dropdown_inversed:]
    extra_subset = extra[days_dropdown_inversed:]
    physical_data = []
    updated_plot = None
    if activity_dropdown != "all":
        if activity_dropdown == 'running':
            physical_data = running[days_dropdown_inversed:]
        elif activity_dropdown == 'cycling':
            physical_data = cycling[days_dropdown_inversed:]
        elif activity_dropdown == 'workout':
            physical_data = workout[days_dropdown_inversed:]
        other_subset = np.subtract(done_subset, physical_data)

        colors3 = [palette['warning']] * 7
        colors4 = [palette['success']] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData["points"][0]["pointNumber"]
            if point_number is not None:
                colors3[point_number] = dim_opacity(colors3[point_number], 0.6)
                colors4[point_number] = dim_opacity(colors4[point_number], 0.6)

        trace3 = go.Bar(x=days_subset, y=physical_data, name=activity_dropdown, marker=dict(color=colors3))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="other activities", marker=dict(color=colors4, opacity=0.2))

        updated_plot = go.Figure(data=[trace3, trace4], layout=return_plot_layout_settings(days_dropdown))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error'])))



    else:
        colors = [palette['success'] if x >= 0 else palette['error'] for x in extra_subset]
        colors1 = [palette['primary']] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData["points"][0]["pointNumber"]
            if point_number is not None:
                colors[point_number] = dim_opacity(colors[point_number], 0.6)
                colors1[point_number] = dim_opacity(colors1[point_number], 0.6)
        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=colors1, opacity=0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra/left", marker=dict(color=colors, opacity=0.7))
        updated_plot = go.Figure(data=[trace1, trace2], layout=return_plot_layout_settings(days_dropdown))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal", line=dict(color=palette['info'])))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error'])))

    style = {'display': 'block'} if plot_click else {'display': 'none'}
    return updated_plot, style
