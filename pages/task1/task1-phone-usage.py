from dash import html
from app import dash
import dash_bootstrap_components as dbc
from dash import dcc, callback, Output, Input
import plotly.express as px
from color_convert import color
import numpy as np
import plotly.graph_objects as go
from assets.dataset.task1 import app_data, app_names, app_data_total, piechart_values, app_data_total_by_category, \
    days, insta, kakao, utub, tiktok, goal_phone_usage, done_phone_usage
from utils.index import dim_opacity, convert_to_hh_mm, palette, font_family

colors_hex = [palette['primary'], palette['info'], palette['success'], palette['warning'], palette['secondary']]
colors_pie = [color.hex_to_rgba(col) for col in colors_hex]

days_dropdown_options = [
    {"label": "1 week", "value": 7},
    {"label": "5 days", "value": 5},
    {"label": "3 days", "value": 3},
]

apps_dropdown_options = [
    {"label": "All apps", "value": "all"},
    {"label": "TikTok", "value": "tiktok"},
    {"label": "Instagram", "value": "insta"},
    {"label": "Play Market", "value": "play"},
]
# Plot
goal1 = list(np.asarray(goal_phone_usage))
extra = np.subtract(done_phone_usage, goal1)
days_subset = days[-7:]
goal_subset = goal1[-7:]
done_subset = done_phone_usage[-7:]
extra_subset = extra[-7:]


def return_plot_layout_settings(time_dropdown_value=None):
    xaxis = "Week" if time_dropdown_value == 7 or time_dropdown_value is None else "Days"
    return go.Layout(margin={'t': 0}, barmode="stack", paper_bgcolor=palette['white'],
                     plot_bgcolor=palette['white'], xaxis=go.layout.XAxis(title=xaxis,
                                                                          titlefont=dict(
                                                                              color=palette['text-secondary'],
                                                                              family=font_family)),
                     yaxis=go.layout.YAxis(title="Calories", titlefont=dict(
                         color=palette['text-secondary'],
                         family=font_family
                     )))


plot_data = [
    go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=[palette['primary']] * 7, opacity=0.7)),
    go.Bar(x=days_subset, y=extra_subset, name="extra",
           marker=dict(color=[palette['success'] if x >= 0 else palette['error'] for x in extra_subset], opacity=0.7)),
    go.Scatter(x=days_subset, y=goal_subset, name="goal", line=dict(color=palette['info'])),
    go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error']))
]

plot = go.Figure(data=plot_data, layout=return_plot_layout_settings(None))

# Plot
pie = px.pie(labels=app_names, values=piechart_values,  hover_data=[piechart_values], width=600, height=500,
             color_discrete_sequence=colors_pie)
dist_plot_data = [
    go.Scatter(
        x=[i for i in range(1, 25)],
        y=app_data_total,
        mode="lines",
        name="Total",
        line=dict(color=colors_pie[-1], shape="spline", width=3),
        fill="tozeroy",
        fillcolor=dim_opacity(colors_hex[-1], opacity=0.3),
    ),
]

dist_plot_layout = go.Layout(margin={'t': 0}, plot_bgcolor=palette['background'], yaxis=go.layout.YAxis(
                             title="Minutes", titlefont=dict(color=palette['text-secondary'], family=font_family)),
                             xaxis=go.layout.XAxis(title="Hours", titlefont=dict(
                                 color=palette['text-secondary'],
                                 family=font_family)))

dist_plot = go.Figure(data=dist_plot_data, layout=dist_plot_layout)

dash.register_page(
    __name__,
    path="/phone-usage",
    title="Phone usage",
    image="logo.png",
    description="Explore phone usage",
)

layout = html.Div(
    [
        dbc.Card(
            [
                html.Div([
                    html.Div('Explore phone usage', className="typography-h5-primary"),
                    html.P('Following patterns, towards healthier life!', className="p-secondary", style={'margin': 0}),
                ]),
                html.Img(src="assets/phone_using.jpg", width=133, height=100, className="image")
            ],
            className="graph-container-with-image"
        ),
        dbc.Card(
            [
                html.Div('Total phone usage', className="typography-h5-secondary"),
                html.P('Study phone usage patterns throughout periods', className="p-secondary",
                       style={'marginBottom': '16px'}),
                dbc.Row(
                    [
                        dcc.Dropdown(
                            id="days_dropdown",
                            clearable=False,
                            className="dropdown",
                            options=days_dropdown_options,
                            value=7,
                            style={"width": "100px"},
                        ),
                        dcc.Dropdown(
                            id="apps_dropdown",
                            clearable=False,
                            className="dropdown",
                            options=apps_dropdown_options,
                            value="all",
                            style={"width": "150px"},
                        ),
                        html.Div(
                            [
                                dcc.Slider(
                                    id="goal_slider",
                                    min=0,
                                    max=10,
                                    step=1,
                                    value=0,
                                    className="slider",
                                    marks={i: str(i) for i in range(11)},
                                    tooltip={
                                        "placement": "bottom",
                                        "always_visible": True,
                                    },
                                ),
                            ],
                            className="slider-container",
                        ),
                    ],
                    className="graph-dropdown-container",
                    style={'paddingBottom': '16px'}
                ),
                dcc.Graph(
                    id="plot",
                    className="graph-style",
                    style={'marginTop': '10px'},
                    figure=plot,
                    hoverData={"points": [{"pointNumber": None}]},
                ),
            ],
            class_name="graph-container",
        ),
        dbc.Card(
            id="phone_usage_card",
            children=[
                html.Div('Daily phone usage', className="typography-h5-secondary", style={'marginBottom': '16px'}),
                dcc.Graph(
                    id="dist_plot",
                    className="graph-style",
                    figure=dist_plot,
                ),
                dcc.Graph(
                    id="pie",
                    figure=pie,
                )
            ],
            class_name="graph-container",
            style={'display': 'none'}
        ),
    ],
    className="main-container-task1",
)


@callback(
    Output(component_id="pie", component_property="figure", allow_duplicate=True),
    Output("dist_plot", "figure", allow_duplicate=True),
    Input(component_id="pie", component_property="clickData"),
    config_prevent_initial_callbacks=True,
)
def update_graph(clickData):
    pos = int(clickData['points'][0]['label'])
    array = [0 for app in app_names]
    array[pos] = 0.5
    colors_updated = [
        color[:-2] + "0.5)" if i != pos else color
        for (i, color) in enumerate(colors_pie)
    ]
    pie.update_traces(
        pull=array, selector=dict(type="pie"), marker=dict(colors=colors_updated)
    )
    updated_data = [
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=app_data_total,
            mode="lines",
            name="Total",
            line=dict(color=colors_pie[-1], shape="spline", width=3),
            fill="tozeroy",
            fillcolor=dim_opacity(colors_hex[-1], opacity=0.3),
        ),
        go.Scatter(
            x=[i for i in range(1, 25)],
            y=app_data[pos],
            mode="lines",
            name=app_names[pos],
            line=dict(color=colors_pie[pos], shape="spline", width=3),
            fill="tozeroy",
        ),
    ]
    pie.layout.annotations = ()
    pie.add_annotation(
        text=app_names[pos],
        showarrow=False,
        x=0.5,
        y=1.15,
        font=dict(size=16, color=colors_pie[pos]),
    )
    pie.add_annotation(
        text="You have used {} for {} hours today".format(
            app_names[pos], convert_to_hh_mm(app_data_total_by_category[pos])
        ),
        showarrow=False,
        x=1,
        y=1.05,
        font=dict(size=14),
    )
    return pie, dict(data=updated_data)


# attribution Image by <a href="https://www.freepik.com/free-vector/set-young-people-using-smartphones_12557558.htm#query=animated%20person%20using%20phone&position=9&from_view=search&track=ais">Freepik</a>
@callback(
    Output('plot', 'figure', allow_duplicate=True),
    Output('phone_usage_card', 'style', allow_duplicate=True),
    Input('days_dropdown', 'value'),
    Input('apps_dropdown', 'value'),
    Input('goal_slider', 'value'),
    Input('plot', 'clickData'),
    Input('plot', 'hoverData'),
    config_prevent_initial_callbacks=True
)
def update_plot(days_dropdown, apps_dropdown, goal_slider, plot_click, hoverData):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal_phone_usage) + goal_slider)
    extra = np.subtract(done_phone_usage, goal1)
    days_dropdown_inversed = days_dropdown * -1
    days_subset = days[days_dropdown_inversed:]
    goal_subset = goal1[days_dropdown_inversed:]
    done_subset = done_phone_usage[days_dropdown_inversed:]
    extra_subset = extra[days_dropdown_inversed:]

    app_data = []
    updated_plot = None
    if apps_dropdown != "all":
        if apps_dropdown == 'tiktok':
            app_data = tiktok[days_dropdown_inversed:]
        elif apps_dropdown == 'insta':
            app_data = insta[days_dropdown_inversed:]
        elif apps_dropdown == 'kakao':
            app_data = kakao[days_dropdown_inversed:]
        elif apps_dropdown == 'utub':
            app_data = utub[days_dropdown_inversed:]
        other_subset = np.subtract(done_subset, app_data)

        colors3 = [palette['warning']] * 7
        colors4 = [palette['success']] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData["points"][0]["pointNumber"]
            if point_number is not None:
                colors3[point_number] = dim_opacity(colors3[point_number], 0.6)
                colors4[point_number] = dim_opacity(colors4[point_number], 0.6)

        trace3 = go.Bar(x=days_subset, y=app_data, name=apps_dropdown, marker=dict(color=colors3))
        trace4 = go.Bar(x=days_subset, y=other_subset, name="other apps", marker=dict(color=colors4, opacity=0.2))

        updated_plot = go.Figure(data=[trace3, trace4], layout=return_plot_layout_settings(days_dropdown))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error'])))
    else:
        colors = [palette['success'] if x >= 0 else palette['error'] for x in extra_subset]
        colors1 = [palette['primary']] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData['points'][0]['pointNumber']
            if point_number is not None:
                colors[point_number] = dim_opacity(colors[point_number], 0.6)
                colors1[point_number] = dim_opacity(colors1[point_number], 0.6)
        trace1 = go.Bar(x=days_subset, y=goal_subset, name="goal", marker=dict(color=colors1, opacity=0.7))
        trace2 = go.Bar(x=days_subset, y=extra_subset, name="extra", marker=dict(color=colors, opacity=0.7))
        updated_plot = go.Figure(data=[trace1, trace2], layout=return_plot_layout_settings(days_dropdown))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal", line=dict(color=palette['info'])))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done", line=dict(color=palette['error'])))

    style = {'display': 'block'} if plot_click else {'display': 'none'}
    return updated_plot, style
