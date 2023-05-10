# Galammadin, Olzhas
import dash_bootstrap_components as dbc
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from color_convert import color
from dash import Input, Output, callback, dcc, html

from app import dash
from assets.dataset.task1 import (
    app_data,
    app_data_total,
    app_data_total_by_category,
    app_names,
    days,
    done_phone_usage,
    goal_phone_usage,
    insta,
    kakao,
    piechart_values,
    tiktok,
    utub,
)
from utils.index import convert_to_hh_mm, dim_opacity

colors_hex = ["#BB86FC", "#3700B3", "#03DAC6", "#FFDE03", "#808080"]
colors_pie = [color.hex_to_rgba(col) for col in colors_hex]

# Plot
colors1 = ["rgba(0, 0, 255, 0.7)"] * 7
goal1 = list(np.asarray(goal_phone_usage))
extra = np.subtract(done_phone_usage, goal1)
days_subset = days[-7:]
goal_subset = goal1[-7:]
done_subset = done_phone_usage[-7:]
extra_subset = extra[-7:]
colors = ["green" if x >= 0 else "red" for x in extra_subset]
plot = go.Figure(
    data=[
        go.Bar(
            x=days_subset,
            y=goal_subset,
            name="goal",
            marker=dict(color=colors1, opacity=0.7),
        ),
        go.Bar(
            x=days_subset,
            y=extra_subset,
            name="extra",
            marker=dict(color=colors, opacity=0.7),
        ),
    ]
)
plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
plot.update_layout(
    title="Test Plot", xaxis_title="X axis", yaxis_title="Y axis", barmode="stack"
)
# Plot
pie = px.pie(
    labels=app_names,
    values=piechart_values,
    hover_data=[piechart_values],
    width=600,
    height=500,
    color_discrete_sequence=colors_pie,
)
data = [
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
                html.Div(
                    [
                        dcc.Dropdown(
                            id="days_dropdown",
                            options=[
                                {"label": "1 week", "value": 7},
                                {"label": "5 days", "value": 5},
                                {"label": "3 days", "value": 3},
                            ],
                            value=7,
                            style={"width": "150px", "marginLeft": "20px"},
                        ),
                        dcc.Dropdown(
                            id="apps_dropdown",
                            options=[
                                {"label": "All apps", "value": "all"},
                                {"label": "TikTok", "value": "tiktok"},
                                {"label": "Instagram", "value": "insta"},
                                {"label": "Play Market", "value": "play"},
                            ],
                            value="all",
                            style={"width": "150px", "marginLeft": "20px"},
                        ),
                        html.Div(
                            [
                                html.Label(
                                    "End Goal(hour):", style={"margin-left": "20px"}
                                ),
                                dcc.Slider(
                                    id="goal_slider",
                                    min=0,
                                    max=10,
                                    step=1,
                                    value=0,
                                    marks={i: str(i) for i in range(11)},
                                    tooltip={
                                        "placement": "bottom",
                                        "always_visible": True,
                                    },
                                ),
                            ],
                            style={
                                "width": "16%",
                                "marginLeft": "20px",
                                "marginTop": "5px",
                            },
                        ),
                    ],
                    className="graph-dropdown-container",
                ),
                dcc.Graph(
                    id="plot",
                    className="graph-style",
                    style={"margin-top": "10px"},
                    figure=plot,
                    hoverData={"points": [{"pointNumber": None}]},
                ),
            ],
            class_name="graph-container",
        ),
        dbc.Card(
            [
                dbc.CardHeader("Health activity"),
                dbc.CardBody([html.H4("Explore health activity")]),
                dcc.Graph(
                    id="dist_plot",
                    className="graph-style",
                    figure=dict(data=data),
                    style={"display": "none"},
                ),
            ],
            class_name="graph-container",
        ),
        dbc.Card(
            [
                dcc.Graph(
                    id="pie",
                    figure=pie,
                    className="graph-style",
                    style={"display": "none"},
                )
            ],
            class_name="graph-container",
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
    pos = int(clickData["points"][0]["label"])
    array = [0 for i in range(len(app_names))]
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


@callback(
    Output("plot", "figure", allow_duplicate=True),
    Output("dist_plot", "style", allow_duplicate=True),
    Output("pie", "style", allow_duplicate=True),
    Input("days_dropdown", "value"),
    Input("apps_dropdown", "value"),
    Input("goal_slider", "value"),
    Input("plot", "clickData"),
    Input("plot", "hoverData"),
    config_prevent_initial_callbacks=True,
)
def update_plot(days_dropdown, apps_dropdown, goal_slider, plot_click, hoverData):
    # = days if days else len(days)
    goal1 = list(np.asarray(goal_phone_usage) + goal_slider)
    extra = np.subtract(done_phone_usage, goal1)
    daysdropdown = days_dropdown * -1
    days_subset = days[daysdropdown:]
    goal_subset = goal1[daysdropdown:]
    done_subset = done_phone_usage[daysdropdown:]
    extra_subset = extra[daysdropdown:]

    app_data = []
    updated_plot = None
    if apps_dropdown != "all":
        if apps_dropdown == "tiktok":
            app_data = tiktok[daysdropdown:]
        elif apps_dropdown == "insta":
            app_data = insta[daysdropdown:]
        elif apps_dropdown == "kakao":
            app_data = kakao[daysdropdown:]
        elif apps_dropdown == "utub":
            app_data = utub[daysdropdown:]
        other_subset = np.subtract(done_subset, app_data)

        colors3 = ["orange"] * 7
        colors4 = ["green"] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData["points"][0]["pointNumber"]
            if point_number is not None:
                colors3[point_number] = "dark" + colors3[point_number]
                colors4[point_number] = "dark" + colors4[point_number]

        trace3 = go.Bar(
            x=days_subset, y=app_data, name=apps_dropdown, marker=dict(color=colors3)
        )
        trace4 = go.Bar(
            x=days_subset,
            y=other_subset,
            name="Other Apps",
            marker=dict(color=colors4, opacity=0.2),
        )
        updated_plot = go.Figure(data=[trace3, trace4])
        # fig.add_trace(go.Scatter(x=days_subset, y=app_data))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        updated_plot.update_layout(
            title="Test Plot",
            xaxis_title="X axis",
            yaxis_title="Y axis",
            barmode="stack",
        )
    else:
        colors = ["green" if x >= 0 else "red" for x in extra_subset]
        colors1 = ["rgba(0, 0, 255, 0.7)"] * 7
        # check if there is hover data and update trace2 marker color accordingly
        if hoverData:
            point_number = hoverData["points"][0]["pointNumber"]
            if point_number is not None:
                colors[point_number] = "dark" + colors[point_number]
                colors1[point_number] = "rgba(0, 0, 255, 0.9)"
        trace1 = go.Bar(
            x=days_subset,
            y=goal_subset,
            name="goal",
            marker=dict(color=colors1, opacity=0.7),
        )
        trace2 = go.Bar(
            x=days_subset,
            y=extra_subset,
            name="extra",
            marker=dict(color=colors, opacity=0.7),
        )
        updated_plot = go.Figure(data=[trace1, trace2])
        updated_plot.add_trace(go.Scatter(x=days_subset, y=goal_subset, name="goal"))
        updated_plot.add_trace(go.Scatter(x=days_subset, y=done_subset, name="done"))
        updated_plot.update_layout(
            title="Test Plot",
            xaxis_title="X axis",
            yaxis_title="Y axis",
            barmode="stack",
        )

    style = {"display": "block"} if plot_click else {"display": "none"}
    return updated_plot, style, style
